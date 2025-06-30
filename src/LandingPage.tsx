"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import {
  Sparkles,
  Wand2,
  Gamepad2,
  Zap,
  Download,
  Palette,
  Save,
  BarChart3,
  Users,
  ArrowRight,
  Play,
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant AI-powered game prototyping",
    description: "Generate games in seconds with advanced AI",
  },
  {
    icon: Wand2,
    title: "No coding required",
    description: "Just describe your idea in plain English",
  },
  {
    icon: Download,
    title: "Download, play, and share",
    description: "Export your creations instantly",
  },
  {
    icon: Palette,
    title: "Stunning AI-generated art & sound",
    description: "Beautiful visuals and immersive audio",
  },
  {
    icon: Gamepad2,
    title: "Classic and creative genres",
    description: "From retro classics to innovative concepts",
  },
  {
    icon: Save,
    title: "Save your favorite assets",
    description: "Build your personal game asset library",
  },
  {
    icon: BarChart3,
    title: "Game Flow overview",
    description: "Visualize your game's structure and mechanics",
  },
  {
    icon: Users,
    title: "Analytics and collaboration",
    description: "Track performance and work with teams",
  },
]

const sampleGames = [
  { name: "Snake", url: "/samples/snake.html", color: "bg-emerald-500" },
  { name: "Breakout", url: "/samples/breakout.html", color: "bg-blue-500" },
  { name: "Tic-Tac-Toe", url: "/samples/tictactoe.html", color: "bg-purple-500" },
]

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Game Genie
              </span>
            </div>
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Sign In
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Game Creation
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent leading-tight">
              Turn Ideas Into
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                Playable Games
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Instantly transform your wildest game concepts into playable prototypes. No coding skills required – just
              describe your vision and watch it come to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="w-64 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/generate")}
              >
                <span>Start Creating Games</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-64 flex items-center justify-center gap-2 px-8 py-6 text-lg rounded-full bg-transparent">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Games Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Everything You Need to Create Amazing Games</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools and intuitive features that make game development accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sample Games Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 flex items-center justify-center">
              <Gamepad2 className="mr-3 text-purple-600" />
              Try Sample Games
            </h2>
            <p className="text-xl text-gray-600">Experience the quality of AI-generated games</p>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mb-12">
            {sampleGames.map((game, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${game.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
                  >
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                  <Button variant="outline" size="sm" onClick={() => window.open(game.url, "_blank")}>
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">How Game Genie Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Describe Your Game</h4>
                    <p className="text-gray-600">Tell us your game idea in plain English</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Magic Happens</h4>
                    <p className="text-gray-600">Our AI generates code, art, and sound</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Play & Share</h4>
                    <p className="text-gray-600">Your game is ready to play and share instantly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Create Your First Game?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of creators who are already building amazing games with AI
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="w-64 flex items-center justify-center gap-2 px-8 py-6 text-lg font-semibold rounded-full mx-auto"
                onClick={() => navigate("/generate")}
              >
                <span>Start Creating Now</span>
                <Sparkles className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 border-t">
          <p>&copy; {new Date().getFullYear()} Game Genie. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default LandingPage
