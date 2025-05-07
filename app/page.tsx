"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { SparklesCore } from "@/components/ui/sparkles"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SpotlightButton } from "@/components/ui/spotlight-button"
import { Spotlight } from "@/components/ui/spotlight"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button } from "@/components/ui/button"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { GlowingStars } from "@/components/ui/glowing-stars"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { SignInButton, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import {
  ChevronRight,
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  ArrowRight,
  Zap,
  LineChart,
  PieChart,
  BarChart,
  UserPlus,
  Mail,
} from "lucide-react"

export default function LandingPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  // Use a ref to track if the component is mounted to prevent memory leaks
  const isMounted = useRef(true)

  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      }
    }

    // Throttle the mouse move event to prevent too many updates
    let timeoutId: NodeJS.Timeout | null = null
    const throttledHandleMouseMove = (e: MouseEvent) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleMouseMove(e)
          timeoutId = null
        }, 16) // Approximately 60fps
      }
    }

    window.addEventListener("mousemove", throttledHandleMouseMove)

    return () => {
      window.removeEventListener("mousemove", throttledHandleMouseMove)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, []) 
  const handleAppNavigation = () => {
    router.push("/dashboard")
  }

  const features = [
    {
      title: "Analytics Dashboard",
      description: "Get real-time insights into your customer relationships and business performance.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      title: "Contact Management",
      description: "Organize and manage your contacts efficiently with powerful filtering and tagging.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Scheduling",
      description: "Schedule meetings and follow-ups with an integrated calendar system.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Communication Hub",
      description: "Centralize all customer communications in one place for better context.",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      title: "Customizable Workflows",
      description: "Create custom workflows that match your unique business processes.",
      icon: <Settings className="h-6 w-6" />,
    },
  ]

  const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
  ]

  const team = [
    {
      id: 1,
      name: "Dron Guin",
      designation: "Founder",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Priyanshu Singh",
      designation: "CEO",
      image: "/placeholder.svg?height=100&width=100",
    },
    
  ]

  const cards = [
    {
      title: "Real-time Analytics",
      description: "Track customer interactions and business metrics in real-time.",
      icon: <LineChart className="h-10 w-10 text-white" />,
    },
    {
      title: "Visual Reporting",
      description: "Beautiful charts and graphs to visualize your business data.",
      icon: <PieChart className="h-10 w-10 text-white" />,
    },
    {
      title: "Performance Metrics",
      description: "Measure team performance and identify growth opportunities.",
      icon: <BarChart className="h-10 w-10 text-white" />,
    },
    {
      title: "Lead Management",
      description: "Capture, track, and nurture leads through your sales pipeline.",
      icon: <UserPlus className="h-10 w-10 text-white" />,
    },
    {
      title: "Email Campaigns",
      description: "Create and track email campaigns directly from your CRM.",
      icon: <Mail className="h-10 w-10 text-white" />,
    },
    {
      title: "Automation",
      description: "Automate repetitive tasks and focus on what matters most.",
      icon: <Zap className="h-10 w-10 text-white" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden" ref={containerRef}>
      {/* Authentication UI - show different elements based on sign-in status */}
      <div className="absolute top-4 right-4 z-20">
        {/* User Button - only shows when user IS signed in */}
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-10 w-10 border-2 border-gray-700 hover:border-white transition-colors duration-200"
              }
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl="/auth-callback" mode="modal">
            <Button 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-900 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <span className="flex items-center relative z-10">
                Sign in<ArrowRight className="ml-2 h-4 w-4" />
              </span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 to-gray-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Button>
          </SignInButton>
        </SignedOut>
      </div>

      <FloatingNav navItems={navItems} />

      {/* Hero Section with Spotlight */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <Spotlight className="hidden md:block" fill="white" size={800} />

        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 100, 100, 0.4) 0%, transparent 60%)`,
            transition: "background 0.3s ease",
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center"
        >
          <motion.div
            className="relative h-40 w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
          >
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
            <motion.h1
              className="absolute inset-0 flex items-center justify-center text-[200px] font-semibold tracking-tighter pt-56"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              azmth
            </motion.h1>
          </motion.div>

          <div className="max-w-3xl mx-auto mt-8 pt-32">
            <TextGenerateEffect
              words="The Smartest AI CRM is here ."
              className="text-xl md:text-2xl text-gray-300 mb-8 pt-8"
            />
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {/* Conditional button rendering based on sign-in status */}
            <SignedIn>
              <SpotlightButton 
                className="bg-white text-black hover:bg-gray-200 relative overflow-hidden group top-[-40px]"
                onClick={handleAppNavigation}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <span className="flex items-center relative z-10">
                  Go to the App <ChevronRight className="ml-2 h-4 w-4" />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </SpotlightButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <SpotlightButton 
                  className="bg-white text-black hover:bg-gray-200 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <span className="flex items-center relative z-10">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </SpotlightButton>
              </SignInButton>
            </SignedOut>
          </motion.div>
        </motion.div>

        <BackgroundBeams className="opacity-20" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-950 relative">
        <GlowingStars
          number={20}
          className="absolute inset-0 z-0"
          starColor="rgba(255, 255, 255, 0.3)"
          glowColor="rgba(255, 255, 255, 0.1)"
        />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage and grow your customer relationships
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />

                <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900 blur-md" />

                <div className="relative z-10">
                  <div className="bg-gray-800 p-3 rounded-lg w-fit mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {hoveredIndex === index && (
                  <div className="absolute inset-0 -z-10 bg-gray-800 opacity-[0.03] rounded-xl">
                    <SparklesCore
                      id={`tsparticles-${index}`}
                      background="transparent"
                      minSize={0.2}
                      maxSize={0.6}
                      particleDensity={20}
                      className="w-full h-full"
                      particleColor="#FFFFFF"
                    />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Card Hover Effect Section */}
      <section className="py-20 bg-black relative">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover what makes Azmth CRM the preferred choice for growing businesses
            </p>
          </motion.div>

          <HoverEffect items={cards} />
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-20 relative overflow-hidden">
        <Spotlight className="hidden md:block" fill="white" size={600} />

        <TracingBeam className="px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Innovative Teams</h2>
            </motion.div>

            <div className="space-y-10">
              <motion.div
                className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-white" />

                <div className="relative z-10">
                  <p className="text-xl italic text-gray-300 mb-6">
                    "Azmth CRM has transformed how we manage our client relationships. The intuitive interface and
                    powerful analytics have helped us increase our customer retention by 35%."
                  </p>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-gray-400 text-sm">Director of Sales, TechNova</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 to-white" />

                <div className="relative z-10">
                  <p className="text-xl italic text-gray-300 mb-6">
                    "The automation features in Azmth CRM have saved our team countless hours. We've been able to focus
                    more on strategy and less on data entry."
                  </p>
                  <div>
                    <p className="font-semibold">Michael Rodriguez</p>
                    <p className="text-gray-400 text-sm">Operations Manager, Quantum Solutions</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </TracingBeam>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-950 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The brilliant minds behind Azmth CRM</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-10">
            <AnimatedTooltip items={team} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-black relative overflow-hidden">
        <Spotlight className="hidden md:block" fill="white" size={800} />

        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 100, 100, 0.4) 0%, transparent 60%)`,
            transition: "background 0.3s ease",
          }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Customer Relationships?</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of businesses already using Azmth CRM to grow their customer base and increase revenue.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SignedIn>
                <SpotlightButton className="bg-white text-black hover:bg-gray-200 relative overflow-hidden group" onClick={handleAppNavigation}>
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <span className="flex items-center relative z-10">
                    Go to the App <ChevronRight className="ml-2 h-4 w-4" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </SpotlightButton>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <SpotlightButton className="bg-white text-black hover:bg-gray-200 relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <span className="flex items-center relative z-10">
                      Get Started Today <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </SpotlightButton>
                </SignInButton>
              </SignedOut>
            </motion.div>
          </motion.div>
        </div>

        <BackgroundBeams className="opacity-20" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">azmth CRM</h3>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}