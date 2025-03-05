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
let collection: Collection<Thread>;

// Connect to MongoDB if not already connected
async function connectToDatabase() {
  if (!db) {
    
    await client.connect();
    db = client.db('interactive-networks-textbook');
    collection = db.collection<Thread>('threads1');
    
  }
}

export const maxDuration = 30;

// Save a message (user or assistant) to MongoDB with detailed logging
async function saveMessageToDatabase(
  userId: string,
  threadId: string,
  role: 'user' | 'assistant',
  content: string
) {
  try {
    if (!collection) {
      await connectToDatabase();
    }

    // Check if the message already exists to prevent duplicates
    const existingMessage = await collection!.findOne({
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

    
    await collection!.updateOne(
      { userId, threadId },
      { $push: { messages: message } },
      { upsert: true }
    );
    
  } catch (err) {
    
  }
}

// GET endpoint to fetch chat history for a specific user
export async function GET(req: Request) {
  try {
    

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
    if (!collection) {
      await connectToDatabase();
    }

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


export async function POST(req: Request) {
  try {
    
    const input: { userId: string; threadId: string | null; message: string } = await req.json();
    

    let threadId = input.threadId;

    // If no threadId is provided, check if an existing thread exists for the user
    if (!threadId) {
      if (!collection) {
        await connectToDatabase();
      }
      const existingThread = await collection?.findOne({ userId: input.userId });
      if (existingThread) {
        threadId = existingThread.threadId;
        
      } else {
        // Create a new thread if none exists
        threadId = (await openai.beta.threads.create({})).id;
        

        // Save the new thread in MongoDB
        await collection!.insertOne({
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
      await saveMessageToDatabase(input.userId, threadId, 'user', input.message);

      // Return a response that will stream the assistant's reply
      return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream }) => {
          
          const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id: process.env.ASSISTANT1_ID ?? (() => {
              throw new Error('ASSISTANT1_ID is not set');
            })(),
          });

          let runResult = await forwardStream(runStream);
          

          // Process any required actions (if needed) until the run completes
          while (
            runResult?.status === 'requires_action' &&
            runResult.required_action?.type === 'submit_tool_outputs'
          ) {
            
            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(
                threadId,
                runResult.id,
                { tool_outputs: [] }
              )
            );
            
          }

          // Once the run is completed, fetch the thread messages to obtain the assistant reply
          if (runResult?.status === 'completed') {
            
            try {
              const messagesPage = await openai.beta.threads.messages.list(threadId);
              

              const threadMessages: any[] = messagesPage.data || [];
              

              const assistantMessages = threadMessages.filter((msg: any) => msg.role === 'assistant');
              if (assistantMessages.length > 0) {
                const latestAssistantMessage = assistantMessages[0];
                

                const assistantContent = extractPlainText(latestAssistantMessage.content);
                

                await saveMessageToDatabase(input.userId, threadId, 'assistant', assistantContent);
              } else {
                console.warn('[STREAM] No assistant message found in fetched thread messages.');
              }
            } catch (fetchError) {
              console.error('[STREAM] Error fetching thread messages:', fetchError);
            }
          } else {
            console.warn('[STREAM] Run did not complete successfully. Final runResult:', runResult);
          }
        }
      );
    } catch (error) {
      console.error('[API] Error in processing thread:', error);
      return new Response(
        JSON.stringify({
          error: 'An error occurred while processing the request (inner).',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('[API] Error in request handling:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing the request (outer).',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Dummy (or existing) cancelActiveRuns implementation
async function cancelActiveRuns(threadId: string) {
  
  // Add actual cancellation logic here if needed.
}

// Helper function to extract plain text from assistant's content
function extractPlainText(content: any): string {
  if (Array.isArray(content)) {
    return content
      .map((item: any) => {
        if (item.type === 'text') {
          return item.text.value;
        }
        return ''; // Ignore non-text items
      })
      .join(' ');
  }
  return String(content); // Fallback to string conversion
}