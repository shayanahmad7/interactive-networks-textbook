"use client"
import SignUp from "./SignUp"
import Login from "./Login"
import { useState } from "react"

export default function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar - Simplified */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">AITextbooks</div>
          <div className="space-x-4">
            <button onClick={() => setShowLogin(true)} className="text-gray-600 hover:text-blue-600">
              Login
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reimagining Textbooks with AI</h1>
            <p className="text-xl mb-8">
              Experience "Computer Networking: A Top-Down Approach" as an interactive AI-enhanced learning journey.
            </p>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-50 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* The Future of Textbooks Section - Shortened */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">The Future of Textbooks in the Age of AI</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
              <p>
                Our platform transforms "Computer Networking: A Top-Down Approach" into an AI-enhanced learning
                experience that adapts to each student's learning style, provides immediate feedback, and makes complex
                networking concepts more accessible.
              </p>
              <p>
                By combining the depth of traditional textbooks with the personalization and interactivity of AI, we're
                creating a new paradigm for technical education that helps students truly master the material.
              </p>
            </div>
          </div>
        </section>

        {/* Mini Tutors Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Mini AI Tutors</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
              <p>
                Our platform features specialized "mini tutors" that focus on teaching specific sections of the
                textbook. Each tutor is an AI expert in its particular networking topic, providing personalized
                guidance, answering questions, and ensuring you fully understand each concept before moving forward.
              </p>
              <p>
                As you progress through the material, the platform saves your progress, allowing you to pick up exactly
                where you left off. The system tracks which concepts you've mastered and which ones need more attention,
                creating a truly personalized learning path through the textbook.
              </p>
              <p>
                This modular approach ensures you build a solid foundation in computer networking by mastering each
                component before moving to more advanced topics—transforming passive reading into active learning.
              </p>
            </div>
          </div>
        </section>

        {/* Modal for Sign Up */}
        {showSignUp && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sign Up</h3>
                <div className="mt-2 px-7 py-3">
                  <SignUp setShowSignUp={setShowSignUp} />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowSignUp(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Login */}
        {showLogin && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Login</h3>
                <div className="mt-2 px-7 py-3">
                  <Login setShowLogin={setShowLogin} />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setShowLogin(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

