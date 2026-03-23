"use client";

/**
 * Home Page
 *
 * Main landing page composing all sections in order.
 * Includes the floating chat widget overlay.
 */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import ChatWidget from "@/components/chat/ChatWidget";

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Services />
        <About />
        <Projects />
        <Testimonials />
        <Blog />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chat Widget */}
      <ChatWidget />
    </>
  );
}
