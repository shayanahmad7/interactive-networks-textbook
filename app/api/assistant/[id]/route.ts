/* eslint-disable */

import { AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { MongoClient, Db, Collection } from 'mongodb';

// Define the structure of a message
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the structure of the thread document
interface Thread {
  userId: string; // Unique identifier for the user
  threadId: string; // OpenAI thread ID
  messages: Message[]; // Array of messages in the thread
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
let db: Db | null = null;
let collections: { [key: string]: Collection<Thread> } = {};

// Connect to MongoDB if not already connected
async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('interactive-networks-textbook');
  }
}

// Get collection for specific assistant
function getCollection(assistantId: string): Collection<Thread> {
  if (!collections[assistantId]) {
    collections[assistantId] = db!.collection<Thread>(`threads${assistantId}`);
  }
  return collections[assistantId];
}

export const maxDuration = 30;

// Save a message (user or assistant) to MongoDB with detailed logging
async function saveMessageToDatabase(
  userId: string,
  threadId: string,
  role: 'user' | 'assistant',
  content: string,
  assistantId: string
) {
  try {
    if (!db) {
      await connectToDatabase();
    }

    const collection = getCollection(assistantId);

    // Check if the message already exists to prevent duplicates
    const existingMessage = await collection.findOne({
      userId,
      threadId,
      'messages.content': content,
    });

    if (existingMessage) {
      return;
    }

    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };

    await collection.updateOne(
      { userId, threadId },
      { $push: { messages: message } },
      { upsert: true }
    );
  } catch (err) {
    console.error('Error saving message to database:', err);
  }
}

// GET endpoint to fetch chat history for a specific user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assistantId } = await params;

    // Parse query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      console.error('[API] Missing userId in query parameters.');
      return new Response(
        JSON.stringify({ error: 'Missing userId in query parameters.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Connect to the database if not already connected
    if (!db) {
      await connectToDatabase();
    }

    const collection = getCollection(assistantId);

    // Query the database for the user's thread
    const thread = await collection.findOne({ userId });
    if (!thread) {
      console.warn(`[DB] No thread found for userId: ${userId}`);
      return new Response(JSON.stringify({ messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract and return the messages
    const messages = thread.messages || [];

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error fetching chat history:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching chat history.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assistantId } = await params;
    const input: { userId: string; threadId: string | null; message: string } = await req.json();

    let threadId = input.threadId;

    // If no threadId is provided, check if an existing thread exists for the user
    if (!threadId) {
      if (!db) {
        await connectToDatabase();
      }
      const collection = getCollection(assistantId);
      const existingThread = await collection.findOne({ userId: input.userId });
      if (existingThread) {
        threadId = existingThread.threadId;
      } else {
        // Create a new thread if none exists
        threadId = (await openai.beta.threads.create({})).id;

        // Save the new thread in MongoDB
        await collection.insertOne({
          userId: input.userId,
          threadId,
          messages: [],
        });
      }
    }

    try {
      // Cancel any active runs for this thread
      await cancelActiveRuns(threadId);

      // Create the user message on the OpenAI thread
      const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });

      // Save the user's message to MongoDB
      await saveMessageToDatabase(input.userId, threadId, 'user', input.message, assistantId);

      // Get the assistant ID from environment variables
      const assistantEnvVar = `ASSISTANT${assistantId.toUpperCase()}_ID`;
      const assistantOpenAIId = process.env[assistantEnvVar];

      if (!assistantOpenAIId) {
        throw new Error(`${assistantEnvVar} is not set`);
      }

      // Return a response that will stream the assistant's reply
      return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream }) => {
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id: assistantOpenAIId,
          });

          // Forward the stream to the client
          await forwardStream(runStream);

          // Get the latest message from the assistant
          const messages = await openai.beta.threads.messages.list(threadId);
          const lastMessage = messages.data[0];

          if (lastMessage && lastMessage.role === 'assistant') {
            const content = lastMessage.content[0];
            if (content.type === 'text') {
              // Save the assistant's message to MongoDB
              await saveMessageToDatabase(
                input.userId,
                threadId,
                'assistant',
                content.text.value,
                assistantId
              );
            }
          }
        }
      );
    } catch (error) {
      console.error('Error in assistant response:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the request.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Cancel any active runs for a thread
async function cancelActiveRuns(threadId: string) {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);
    for (const run of runs.data) {
      if (run.status === 'in_progress' || run.status === 'queued') {
        await openai.beta.threads.runs.cancel(threadId, run.id);
      }
    }
  } catch (error) {
    console.error('Error canceling active runs:', error);
  }
}

// Helper function to extract plain text from message content
function extractPlainText(content: any): string {
  if (content.type === 'text') {
    return content.text.value;
  }
  return '';
} 