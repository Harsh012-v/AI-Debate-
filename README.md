# Debate AI - Advanced Reasoning Platform

Debate AI is an interactive platform designed to test your reasoning skills. Challenge your beliefs against an advanced AI debater that provides sharp, concise counter-arguments.

## 🚀 Key Features

- **Dynamic AI Debater**: Powered by Groq (LLaMA 3.3 70B) for lighting-fast, logical responses.
- **Voice Intelligence**: Speak your counter-arguments using integrated Speech-to-Text.
- **Debate Summary**: Get a detailed analysis of your performance, including strongest points, logical fallacies, and areas for improvement.
- **Customizable Experience**: Select from various topics, difficulties, and time limits.
- **Premium UI**: Modern, glassmorphism design with smooth animations.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **AI Service**: [Groq API](https://groq.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Speech**: Web Speech API (Recognition & Synthesis)

## 📦 Deployment on Vercel

To deploy this project to Vercel, follow these steps:

1. **Push to GitHub**: Push your local code to a GitHub repository.
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository.
3. **Configure Environment Variables**:
   - In the Vercel dashboard, go to your project settings.
   - Add the following Environment Variable:
     - `GROQ_API_KEY`: Your API key from the [Groq Console](https://console.groq.com).
4. **Deploy**: Vercel will automatically detect Next.js and build the project.

## 🛠 Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your `GROQ_API_KEY`.
4. Start the dev server:
   ```bash
   npm run dev
   ```
