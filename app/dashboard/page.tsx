/* eslint-disable */


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CheckCircle, Circle, Book, LogOut, ChevronDown, ChevronUp } from "lucide-react"
import Confetti from 'react-confetti'

import Chat from "@/components/Chat"


const chapters = [
  {
    title: "Chapter 1: Computer Networks and the Internet",
    sections: [
      { title: "1.1 What Is the Internet?", mastered: false },
      { title: "1.2 The Network Edge", mastered: false },
      { title: "1.3 The Network Core", mastered: false },
      { title: "1.4 Delay, Loss, and Throughput in Packet-Switched Networks", mastered: false },
      { title: "1.5 Protocol Layers and Their Service Models", mastered: false },
      { title: "1.6 Networks Under Attack", mastered: false },
      { title: "1.7 History of Computer Networking and the Internet", mastered: false },
      { title: "1.8 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 2: Application Layer",
    sections: [
      { title: "2.1 Principles of Network Applications", mastered: false },
      { title: "2.2 The Web and HTTP", mastered: false },
      { title: "2.3 Electronic Mail in the Internet", mastered: false },
      { title: "2.4 DNS—The Internet's Directory Service", mastered: false },
      { title: "2.5 Peer-to-Peer File Distribution", mastered: false },
      { title: "2.6 Video Streaming and Content Distribution Networks", mastered: false },
      { title: "2.7 Socket Programming: Creating Network Applications", mastered: false },
      { title: "2.8 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 3: Transport Layer",
    sections: [
      { title: "3.1 Introduction and Transport-Layer Services", mastered: false },
      { title: "3.2 Multiplexing and Demultiplexing", mastered: false },
      { title: "3.3 Connectionless Transport: UDP", mastered: false },
      { title: "3.4 Principles of Reliable Data Transfer", mastered: false },
      { title: "3.5 Connection-Oriented Transport: TCP", mastered: false },
      { title: "3.6 Principles of Congestion Control", mastered: false },
      { title: "3.7 TCP Congestion Control", mastered: false },
      { title: "3.8 Evolution of Transport-Layer Functionality", mastered: false },
      { title: "3.9 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 4: The Network Layer: Data Plane",
    sections: [
      { title: "4.1 Overview of Network Layer", mastered: false },
      { title: "4.2 What's Inside a Router?", mastered: false },
      { title: "4.3 The Internet Protocol (IP): IPv4, Addressing, IPv6, and More", mastered: false },
      { title: "4.4 Generalized Forwarding and SDN", mastered: false },
      { title: "4.5 Middleboxes", mastered: false },
      { title: "4.6 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 5: The Network Layer: Control Plane",
    sections: [
      { title: "5.1 Introduction", mastered: false },
      { title: "5.2 Routing Algorithms", mastered: false },
      { title: "5.3 Intra-AS Routing in the Internet: OSPF", mastered: false },
      { title: "5.4 Routing Among the ISPs: BGP", mastered: false },
      { title: "5.5 The SDN Control Plane", mastered: false },
      { title: "5.6 ICMP: The Internet Control Message Protocol", mastered: false },
      { title: "5.7 Network Management and SNMP, NETCONF/YANG", mastered: false },
      { title: "5.8 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 6: The Link Layer and LANs",
    sections: [
      { title: "6.1 Introduction to the Link Layer", mastered: false },
      { title: "6.2 Error-Detection and -Correction Techniques", mastered: false },
      { title: "6.3 Multiple Access Links and Protocols", mastered: false },
      { title: "6.4 Switched Local Area Networks", mastered: false },
      { title: "6.5 Link Virtualization: A Network as a Link Layer", mastered: false },
      { title: "6.6 Data Center Networking", mastered: false },
      { title: "6.7 Retrospective: A Day in the Life of a Web Page Request", mastered: false },
      { title: "6.8 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 7: Wireless and Mobile Networks",
    sections: [
      { title: "7.1 Introduction", mastered: false },
      { title: "7.2 Wireless Links and Network Characteristics", mastered: false },
      { title: "7.3 WiFi: 802.11 Wireless LANs", mastered: false },
      { title: "7.4 Cellular Networks: 4G and 5G", mastered: false },
      { title: "7.5 Mobility Management: Principles", mastered: false },
      { title: "7.6 Mobility Management in Practice", mastered: false },
      { title: "7.7 Wireless and Mobility: Impact on Higher-Layer Protocols", mastered: false },
      { title: "7.8 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
  {
    title: "Chapter 8: Security in Computer Networks",
    sections: [
      { title: "8.1 What Is Network Security?", mastered: false },
      { title: "8.2 Principles of Cryptography", mastered: false },
      { title: "8.3 Message Integrity and Digital Signatures", mastered: false },
      { title: "8.4 End-Point Authentication", mastered: false },
      { title: "8.5 Securing E-Mail", mastered: false },
      { title: "8.6 Securing TCP Connections: TLS", mastered: false },
      { title: "8.7 Network-Layer Security: IPsec and Virtual Private Networks", mastered: false },
      { title: "8.8 Securing Wireless LANs and 4G/5G Cellular Networks", mastered: false },
      { title: "8.9 Operational Security: Firewalls and Intrusion Detection Systems", mastered: false },
      { title: "8.10 Summary", mastered: false },
      { title: "Homework Problems and Questions", mastered: false },
    ],
  },
];



const sectionNames = [
  "1.1 What Is the Internet?", 
  "1.2 The Network Edge", 
  "1.3 The Network Core", 
  "1.4 Delay, Loss, and Throughput in Packet-Switched Networks", 
  "1.5 Protocol Layers and Their Service Models", 
  "1.6 Networks Under Attack", 
  "1.7 History of Computer Networking and the Internet", 
  "1.8 Summary",
  "Homework Problems and Questions"
];

const chatMap = [
  "1", // 1.1 What Is the Internet?
  "2", // 1.2 The Network Edge
  "3", // 1.3 The Network Core
  "4", // 1.4 Delay, Loss, and Throughput in Packet-Switched Networks
  "5", // 1.5 Protocol Layers and Their Service Models
  "6", // 1.6 Networks Under Attack
  "7", // 1.7 History of Computer Networking and the Internet
  "8", // 1.8 Summary
  "9"  // Homework Problems and Questions
];
  
    export default function DashboardPage() {
      const [user, setUser] = useState<any>(null)
      const [selectedSection, setSelectedSection] = useState<string | null>(null)
      const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({})
      const [viewMode, setViewMode] = useState<"chat" | "pdf">("chat")
      const router = useRouter()
      const [numPages, setNumPages] = useState<number | null>(null)
      const [pageNumber, setPageNumber] = useState(1)
      const [masteredSections, setMasteredSections] = useState<{ [key: string]: boolean }>({})
      const [showPopup, setShowPopup] = useState(false)
      const [showConfetti, setShowConfetti] = useState(false)
    
      useEffect(() => {
        const fetchUser = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            setUser(user)
          } else {
            router.push("/")
          }
        }
        fetchUser()
    
        // Load mastered sections from local storage
        const savedMasteredSections = localStorage.getItem("masteredSections")
        if (savedMasteredSections) {
          setMasteredSections(JSON.parse(savedMasteredSections))
        }
      }, [router])
    
      useEffect(() => {
        // Save mastered sections to local storage whenever it changes
        localStorage.setItem("masteredSections", JSON.stringify(masteredSections))
      }, [masteredSections])
    
      const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/")
      }
    
      const toggleChapter = (chapterTitle: string) => {
        setExpandedChapters((prev) => ({
          ...prev,
          [chapterTitle]: !prev[chapterTitle],
        }))
      }
    
      const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
      }
    
      const handleMastery = (isMastered: boolean) => {
        if (selectedSection) {
          setMasteredSections((prev) => ({ ...prev, [selectedSection]: isMastered }))
    
          // Update the chapters state to reflect the mastery status
          const updatedChapters = chapters.map((chapter) => ({
            ...chapter,
            sections: chapter.sections.map((section) =>
              section.title === selectedSection ? { ...section, mastered: isMastered } : section,
            ),
          }))

          // Show confetti if the section is mastered
          if (isMastered) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 5000) // Hide confetti after 5 seconds
          }
    
          // TODO: Implement backend logic to save mastery status
          //only frontend for now
        }
        setShowPopup(false)
      }
    
      if (!user) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-white text-2xl font-bold">Loading...</div>
          </div>
        )
      }
    
      const renderPDFViewer = () => (
        <div className="w-full bg-gray-100 rounded flex flex-col items-center justify-center p-4">
          <p className="mt-4">
            Page {pageNumber} of {numPages}
          </p>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => setPageNumber((page) => Math.min(page + 1, numPages || page))}
              disabled={pageNumber >= (numPages || 1)}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )
    
      return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-lg overflow-y-auto h-screen">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                <Book className="mr-2" />
                Table of Contents
              </h2>
              <nav className="space-y-2">
                {chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="mb-2">
                    <button
                      onClick={() => toggleChapter(chapter.title)}
                      className="flex items-center justify-between w-full text-left font-medium text-indigo-700 hover:bg-indigo-50 rounded p-2 transition-colors duration-200"
                    >
                      <span>{chapter.title}</span>
                      {expandedChapters[chapter.title] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {expandedChapters[chapter.title] && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {chapter.sections.map((section, sectionIndex) => (
                          <li key={sectionIndex}>
                            <button
                              onClick={() => setSelectedSection(section.title)}
                              className={`flex items-center w-full text-left px-2 py-1 rounded transition-colors duration-200 ${
                                selectedSection === section.title
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "hover:bg-indigo-50 text-gray-700 hover:text-indigo-700"
                              }`}
                            >
                              <span className="mr-2">
                                {masteredSections[section.title] ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                              </span>
                              <span className="text-sm">{section.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>
    
          {/* Main Content Area */}
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="mb-8 flex justify-between items-center">
              <h1
                className="text-3xl font-bold text-indigo-800 cursor-pointer hover:text-indigo-600 transition-colors duration-200"
                onClick={() => setSelectedSection(null)}
              >
                Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex rounded-lg overflow-hidden border border-indigo-200">
                  <button
                    onClick={() => setViewMode("chat")}
                    className={`px-4 py-2 flex items-center ${
                      viewMode === "chat" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500 hover:bg-indigo-50"
                    }`}
                  >
                    Mini Tutor
                  </button>
                  <button
                    onClick={() => setViewMode("pdf")}
                    className={`px-4 py-2 flex items-center ${
                      viewMode === "pdf" ? "bg-indigo-500 text-white" : "bg-white text-indigo-500 hover:bg-indigo-50"
                    }`}
                  >
                    Textbook PDF
                  </button>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center"
                >
                  <LogOut className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
    
            {viewMode === "pdf" ? (
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Computer Networking: A Top-Down Approach</h2>
                <embed src="/networks-textbook.pdf" type="application/pdf" width="100%" height="600px" />
              </div>
            ) : selectedSection ? (
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-800">Interactive AI Mini-Tutor for {selectedSection}</h2>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center"
                    onClick={() => setShowPopup(true)}
                  >
                    💡 Mastered this unit?
                  </button>
                </div>
                {(() => {
                  const index = sectionNames.findIndex(name => name === selectedSection)
                  const assistantId = index !== -1 ? chatMap[index] : undefined
                  return <Chat userId={user.id} assistantId={assistantId} key={`${user.id}-${assistantId || 'none'}`} />
                })()}
              </div>
            ) : (
              // Welcome Screen
              <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-indigo-500">
                <h1 className="text-3xl font-bold text-indigo-800 mb-4">
                  Welcome to Your Interactive Computer Networks AI Textbook
                </h1>
                <p className="text-indigo-600 mb-4">
                  This interactive textbook is based on <strong>"Computer Networking: A Top-Down Approach"</strong> 
                  by <strong>James F. Kurose</strong> and <strong>Keith W. Ross</strong>. We credit the authors for the original 
                  material, which has been used to create an AI-driven learning experience that guides you through 
                  computer networking concepts in an interactive and structured way.
                </p>
                
                <h2 className="text-xl font-semibold text-indigo-700 mb-2">How It Works</h2>
                <p className="text-indigo-600 mb-4">
                  Each section of the book has its own dedicated <strong>mini tutor</strong>. These tutors are focused 
                  <strong> only </strong> on their assigned section and will <strong>not answer questions</strong> outside their scope. 
                  If you want to learn about another section, simply switch to the appropriate tutor.
                </p>
                <p className="text-indigo-600 mb-4">
                  The AI tutors will guide you <strong>bit by bit</strong>, just like a textbook, explaining concepts in a structured 
                  way, testing your understanding after each subsection, and ensuring you grasp the material before moving on.
                </p>

                <h2 className="text-xl font-semibold text-indigo-700 mb-2">How to Use</h2>
                <ul className="list-disc list-inside text-indigo-600 mb-4">
                  <li>Start a session by selecting a section from the left.</li>
                  <li>The AI tutor will introduce the topic and guide you through it systematically.</li>
                  <li>At any point, you can ask questions, request clarification, or move ahead.</li>
                  <li>Conversations are <strong>automatically saved</strong>, so you can revisit past discussions anytime for quick revision.</li>
                  <li>Once you complete a section, you can move on to the next mini tutor to continue your learning journey.</li>
                </ul>

                <p className="text-indigo-800 font-medium bg-indigo-100 p-4 rounded-lg">
                  This platform is designed to make learning <strong>computer networking</strong> more interactive, structured, and personalized. 
                  Let's dive in and explore the <strong>fundamentals of the Internet, protocols, and networks—one section at a time!</strong>
                </p>
              </div>
            )}
            {/* Disclaimer */}
            <div className="mt-8 text-sm text-indigo-500 bg-white p-4 rounded-lg shadow">
              <p>
                <strong>Disclaimer:</strong> This platform is a prototype that provides an AI-powered interactive learning experience for 
                <strong> computer networking </strong>. It is based on content from <strong>"Computer Networking: A Top-Down Approach"</strong> 
                by <strong>James F. Kurose</strong> and <strong>Keith W. Ross</strong>. We credit the authors for their original work. 
                This platform is intended for educational purposes only.
              </p>
            </div>
          </main>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Have you mastered this unit?</h2>
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => handleMastery(true)}>
                    Yes
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => handleMastery(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* show confetti if section mastered */}
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
          )}
        </div>
      )
    }