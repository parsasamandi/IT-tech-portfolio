"use client";

/**
 * ChatMessage Component
 *
 * Individual chat message bubble with:
 * - User (right-aligned, crimson) vs AI (left-aligned, glass) styling
 * - Entrance animation
 * - Timestamp display
 * - Streaming text effect for AI responses
 */
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
          ${isUser ? "gradient-primary" : "bg-white border border-navy-100"}
        `}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-crimson-400" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`
          max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "gradient-primary text-white rounded-br-md"
            : "bg-navy-50 border border-navy-100 text-navy-900 rounded-bl-md"
          }
        `}
      >
        {message.content}

        {/* Timestamp */}
        <div
          className={`
            text-[10px] mt-1.5
            ${isUser ? "text-white/50 text-right" : "text-text-muted"}
          `}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}
