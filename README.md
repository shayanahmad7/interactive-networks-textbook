# Interactive Networks Textbook 🚀

Live Demo → **https://interactive-networks-textbook.vercel.app/dashboard**  
Source Code → **https://github.com/shayanahmad7/interactive-networks-textbook**

An AI-powered, section-by-section tutor for _Computer Networking: A Top-Down Approach_ (8ᵗʰ ed.). Each textbook section launches its own “mini-tutor” that streams explanations, quizzes, and follow-ups—automatically saving progress so learners can resume any time.

> **Research prototype** — built with permission from the authors **Prof. Jim Kurose** and **Prof. Keith Ross**. The textbook content remains copyrighted; the code and interface here are MIT-licensed so others can adapt the idea.

---

## ✨ Features

|                                 | What it does                                                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 🔸 **Per-Section Mini Tutors**  | One OpenAI Assistant per _chapter_, distinct thread per _section_. Learners get laser-focused help—no off-topic tangents.           |
| 🔸 **Auto-Start Conversations** | Opening a section silently sends the numeric trigger (e.g. `3` ⇒ _Section 3_) so the tutor greets the learner without manual input. |
| 🔸 **Streaming UI**             | Responses stream token-by-token; loader disappears the moment the tutor speaks.                                                     |
| 🔸 **Persistent History**       | Thread + messages stored in MongoDB; reopen a section and continue exactly where you left off.                                      |
| 🔸 **Mastery Tracking**         | Mark a section “Mastered” once you feel confident—confetti included 🎉.                                                             |

---

## 🏗️ Architecture

### Front-End _(Next.js / React / TypeScript)_

- `Dashboard` lists all chapters/sections. Selecting a section renders `Chat` with `assistantId = <chapter>-<section>`.
- `Chat.tsx` uses **@ai-sdk/react `useAssistant`**:
  - `append({role:'user', content:<sectionNumber>})` sends the hidden trigger. The trigger is filtered from the UI so learners never see “1 / 2 / …”.
  - Streams assistant messages; loading overlay tied to hook `status`.

### Back-End _(Next.js Route Handlers)_

- `api/assistant/[id]` handles both GET (history) & POST (chat). Logic:
  1. Parses `assistantId` `<chapter>-<section>`.
  2. Uses `CHAPTER_<n>_ASSISTANT_ID` env var to pick the OpenAI Assistant.
  3. Silently ignores & doesn’t store the numeric trigger message.
  4. Streams assistant response → client; saves assistant text to MongoDB.

---

## ⚙️ Local Setup

```bash
git clone https://github.com/shayanahmad7/interactive-networks-textbook
cd interactive-networks-textbook
npm install
```

Create `.env.local`:

```env
OPENAI_API_KEY=sk-••••
MONGODB_URI=mongodb+srv://•••

# One assistant per chapter (create them in OpenAI dashboard and paste IDs)
CHAPTER_1_ASSISTANT_ID=asst_•••
CHAPTER_2_ASSISTANT_ID=asst_•••
CHAPTER_3_ASSISTANT_ID=asst_•••
CHAPTER_4_ASSISTANT_ID=asst_•••
CHAPTER_5_ASSISTANT_ID=asst_•••
CHAPTER_6_ASSISTANT_ID=asst_•••
CHAPTER_7_ASSISTANT_ID=asst_•••
CHAPTER_8_ASSISTANT_ID=asst_•••
```

```bash
npm run dev
open http://localhost:3000/dashboard
```

---

## 📚 Using the Tutor

1. Select any section on the left sidebar.
2. The tutor introduces the topic; ask questions or follow the prompts.
3. Click “Mastered this unit?” when you feel confident—progress is stored locally.
4. Return any time; your conversation is restored from MongoDB.

---

## 🤝 Contributing

1. Fork → feature branch → PR.
2. Keep commits atomic; run `npm run lint && npm test` (if tests added).
3. New chapters? Add `CHAPTER_<n>_ASSISTANT_ID` and extend `chapters[]` list in `dashboard/page.tsx`.

---

## 📝 License

MIT for code & UI. Textbook excerpts belong to Pearson and the authors; used here solely for educational research.
