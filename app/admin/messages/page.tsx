"use client";

/**
 * Admin Messages Page
 *
 * List of contact form submissions with:
 * - Read/unread status indicators
 * - Message detail panel
 * - Delete action with confirm modal
 * - Search and filter
 */
import { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Inbox,
  Loader2,
  X,
  Reply,
  Clock,
  AtSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMsg = messages.find((m) => m.id === selectedMessage);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const markAsRead = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.is_read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      if (supabase) {
        try {
          await supabase.from("messages").update({ is_read: true }).eq("id", id);
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    }
  };

  const deleteMessage = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage === id) setSelectedMessage(null);
    setDeleteConfirmId(null);
    if (supabase) {
      try {
        await supabase.from("messages").delete().eq("id", id);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const handleSelect = (id: string) => {
    setSelectedMessage(id);
    markAsRead(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    if (diffHrs < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatFullDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="page-transition">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl md:text-3xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Messages
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-crimson-500 rounded-full shadow-sm shadow-crimson-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-text-secondary mt-1">Manage contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
        {/* ── Left: Messages List ─────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, subject, email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-text-primary bg-overlay-hover 
                rounded-xl border border-border-subtle outline-none 
                focus:border-crimson-500/50 focus:ring-2 focus:ring-crimson-500/15
                placeholder:text-text-muted transition-all"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto glass rounded-2xl p-2 space-y-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-text-muted">
                <Loader2 className="w-7 h-7 animate-spin mb-3 text-crimson-500" />
                <p className="text-sm">Loading messages…</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-text-muted">
                <Inbox className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium text-text-secondary">No messages</p>
                <p className="text-xs mt-1">{searchQuery ? "Try a different search" : "Your inbox is empty"}</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all ${
                    selectedMessage === msg.id
                      ? "bg-crimson-500/12 border border-crimson-500/25"
                      : msg.is_read
                      ? "hover:bg-overlay-hover border border-transparent"
                      : "bg-overlay-hover hover:bg-overlay-hover border-l-2 border-crimson-500 border-r border-t border-b border-r-transparent border-t-transparent border-b-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                      ${msg.is_read
                        ? "bg-overlay-hover text-text-muted"
                        : "bg-crimson-500/15 text-crimson-400"
                      }`}
                    >
                      {getInitials(msg.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${msg.is_read ? "text-text-secondary" : "text-text-primary font-semibold"}`}>
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-text-muted shrink-0">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${msg.is_read ? "text-text-muted" : "text-text-secondary"}`}>
                        {msg.subject}
                      </p>
                    </div>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-crimson-500 shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: Message Detail ───────────────────────── */}
        <div className="lg:col-span-3 min-h-0">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div
                key={selectedMsg.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col glass rounded-2xl overflow-hidden"
              >
                {/* Detail Header */}
                <div className="px-6 pt-5 pb-4 border-b border-border-subtle">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-crimson-500/20 to-navy-700/30 flex items-center justify-center text-sm font-bold text-crimson-400 shrink-0">
                        {getInitials(selectedMsg.name)}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-text-primary leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                          {selectedMsg.subject}
                        </h2>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-xs text-text-primary font-medium">{selectedMsg.name}</span>
                          <span className="flex items-center gap-1 text-xs text-text-muted">
                            <AtSign className="w-3 h-3" />{selectedMsg.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-text-muted mt-1">
                          <Clock className="w-3 h-3" />{formatFullDate(selectedMsg.created_at)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirmId(selectedMsg.id)}
                      className="w-8 h-8 rounded-xl bg-overlay-hover hover:bg-red-500/12 flex items-center justify-center text-text-muted hover:text-red-400 transition-all shrink-0"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="bg-overlay-hover rounded-2xl p-5 border border-border-subtle">
                    <div className="flex items-center gap-2 mb-3 text-xs text-text-muted">
                      <Mail className="w-3.5 h-3.5" /> Message
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {selectedMsg.message}
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors lg:hidden"
                  >
                    <X className="w-4 h-4" /> Close
                  </button>
                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={() => setDeleteConfirmId(selectedMsg.id)}
                      className="px-4 py-2 text-sm font-medium text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all"
                    >
                      Delete
                    </button>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/20"
                    >
                      <Reply className="w-4 h-4" /> Reply
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center glass rounded-2xl text-text-muted"
              >
                <div className="w-14 h-14 rounded-2xl bg-overlay-hover flex items-center justify-center mb-4">
                  <MailOpen className="w-7 h-7 opacity-40" />
                </div>
                <p className="text-sm font-medium text-text-secondary">No message selected</p>
                <p className="text-xs mt-1">Pick a conversation from the left</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Delete Confirm Modal ─────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm"
            >
              <div className="glass-strong rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-4 mx-auto">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-text-primary text-center mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Delete Message
                </h3>
                <p className="text-sm text-text-secondary text-center mb-6">
                  This message will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary rounded-xl border border-border-subtle hover:bg-overlay-hover hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteMessage}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
