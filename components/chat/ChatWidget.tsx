"use client";

/**
 * ChatWidget Component
 *
 * Floating chat button (bottom-right corner) that toggles
 * the ChatPanel. Features a pulsing glow animation to
 * attract user attention.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl
          gradient-primary flex items-center justify-center
          shadow-lg shadow-crimson-600/30 hover:opacity-90 transition-opacity
          ${!isOpen ? "chat-pulse" : ""}
        `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
