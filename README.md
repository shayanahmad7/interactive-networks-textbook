# Interactive Networks Textbook 📡

Live Demo: **https://interactive-networks-textbook.vercel.app/dashboard**  
Source Code: **https://github.com/shayanahmad7/interactive-networks-textbook**

This is a **research prototype** that turns the classic textbook _Computer Networking: A Top-Down Approach_ into an AI-guided, fully interactive learning experience.  
It is being developed with the knowledge and permission of the book’s authors **Prof. Keith Ross** and **Prof. Jim Kurose**.

While the underlying textbook content remains copyrighted by the authors/publisher, the **interface, code, and AI orchestration** here are open-sourced so that others can build upon or adapt the idea to different domains.

---

## Overview 🏆

### Problem Statement

Many students (and adults!) struggle with math confidence. They believe they just “don’t have the math gene.” Our research shows that personalized, step-by-step practice and positive reinforcement can dramatically improve outcomes. But not everyone has access to one-on-one tutoring.

### Our Solution

We built an AI-powered interactive textbook for Pre-Algebra, providing mini tutors for each topic. This system:

- Breaks the content into small, digestible sections (e.g. “Naming Numbers,” “Rounding Whole Numbers,” etc.).
- Walks the learner through each step, asking questions and clarifying misunderstandings.
- Tracks mastery by checking if the student can answer 3 questions in a row correctly.
- Offers positive, supportive messages, emphasizing that anyone can learn math with the right approach!

## Key Features ⚙️

### AI Chat

A dynamic chat interface (using OpenAI Beta Threads) that:

- Automatically greets the user or sends a topic-specific prompt (e.g. “Section 1: Naming Numbers”).
- Streams real-time answers and clarifications from the AI.
- Saves conversation history to MongoDB so learners can pick up where they left off.

### Modular Tutors

Instead of one big AI model for the entire book, we can conceptually assign each chapter or section its own “mini tutor.” This ensures a focused learning experience.

### Mastery Checks

If the learner consistently answers questions correctly, the system marks that section as mastered and encourages them to move to the next topic.

### Growth Mindset Cues

Encouraging language (“You got this!”) is embedded throughout. Mistakes are treated as natural learning steps, not failures.

## Architecture 🏗️

### Frontend

- Next.js + React + ai/react for an elegant chat UI.
- `Chat1.tsx` automatically sends a prompt (like “1”) to start each section, then streams the AI’s replies.

### Backend

- `/api/assistant1/route.ts`: A Next.js route using OpenAI Beta Threads.
- Stores messages in MongoDB (threads1 collection) for each (threadId).
- On each user message, we:
  - Add it to the Beta Thread.
  - Stream the assistant’s response.
  - Save that response in Mongo for future reference.

## Installation 🛠️

Clone this repo:

```sh
git clone https://github.com/YourUser/interactive-prealgebra.git
```

Install dependencies:

```sh
cd interactive-prealgebra
npm install
```

Set environment variables in `.env`:

```sh
OPENAI_API_KEY=your_openai_key
ASSISTANT1_ID=your_assistant_id
MONGODB_URI=your_mongo_uri
```

Run the dev server:

```sh
npm run dev
```

Navigate to `http://localhost:3000` and chat away!

## Usage 🚀

1. Sign up or log in (if you have authentication).
2. Pick a chapter/section from the sidebar.
3. Observe the AI automatically send a “section number” or greeting to start the conversation.
4. Ask questions in the chatbox or follow the prompts.
5. Reach mastery by answering 3 correct questions in a row, then unlock the next topic.

## Contributing 🤝

1. Fork the repo.
2. Create a feature branch (e.g. `git checkout -b feature/new-algebra-content`).
3. Push and open a pull request describing your changes.

## Roadmap 🛣️

- Expand beyond pre-algebra to more math domains.
- Support text-to-speech for accessibility.
- Add built-in “growth mindset” quizzes.
- Enhance real-time collaboration (e.g., teacher and student viewing the same chat).

## License ⚖️

This project is licensed under the MIT License. Feel free to use, modify, and distribute.

## Acknowledgements 🙏

We would like to thank the following for their support and contributions:

- OpenAI for providing the AI models and API access.
- MongoDB for database solutions.
- The open-source community for their invaluable tools and libraries.
- Our beta testers for their feedback and suggestions.

## Contact 📧

For any questions, suggestions, or feedback, please reach out to us at support@interactive-prealgebra.com.

## Stay Connected 🌐

Follow us on social media to stay updated with the latest features and announcements:

- Twitter: [@InteractivePreAlgebra](https://twitter.com/InteractivePreAlgebra)
- Facebook: [Interactive Pre-Algebra](https://facebook.com/InteractivePreAlgebra)
- LinkedIn: [Interactive Pre-Algebra AI Textbook](https://linkedin.com/company/interactive-prealgebra)

Thank you for being a part of our journey to make math learning more accessible and enjoyable for everyone!

## Authors

- Shayan Ahmad
- Ramsha Bilal
- Izah Sohail
- Aysa Moma
- Samroz Ahmad Shoaib
