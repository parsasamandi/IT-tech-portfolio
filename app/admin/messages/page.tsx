"use client";

/**
 * Admin Messages Page
 *
 * List of contact form submissions with:
 * - Read/unread status indicators
 * - Message detail view in modal
 * - Delete action
 * - Search and filter
 */
import { useState } from "react";
import { Mail, MailOpen, Trash2, Search, Eye } from "lucide-react";

/** Sample messages data for demo */
const DEMO_MESSAGES = [
  {
    id: "1",
    name: "Alex Martinez",
    email: "alex@example.com",
    subject: "Project Inquiry - E-commerce Platform",
    message:
      "Hi, I'm interested in building an e-commerce platform for my retail business. We need inventory management, payment processing (Stripe), and a mobile-responsive design. Our budget is around $15-20K and we'd like to launch in 3 months. Can we schedule a call to discuss?",
    is_read: false,
    created_at: "2024-03-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Sara Williams",
    email: "sara@company.com",
    subject: "Partnership Opportunity",
    message:
      "We're a marketing agency looking for a reliable technology partner. We have several clients who need custom web applications and we'd like to explore a partnership. Let me know if you're interested.",
    is_read: false,
    created_at: "2024-03-20T08:15:00Z",
  },
  {
    id: "3",
    name: "David Kim",
    email: "david@startup.io",
    subject: "Technical Consultation Request",
    message:
      "We're a startup building a SaaS platform and need help with our architecture. We're currently using a monolithic Node.js app and want to migrate to microservices. Looking for expert guidance.",
    is_read: true,
    created_at: "2024-03-19T14:45:00Z",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@enterprise.co",
    subject: "Cloud Migration Quote",
    message:
      "Our company is looking to migrate from on-premise servers to AWS. We have approximately 20 services and 5 databases. Could you provide a rough estimate for the migration?",
    is_read: true,
    created_at: "2024-03-18T09:00:00Z",
  },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMsg = messages.find((m) => m.id === selectedMessage);

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage === id) setSelectedMessage(null);
  };

  return (
    <div className="page-transition">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Messages
        </h1>
        <p className="text-text-secondary mt-1">
          Manage contact form submissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-text-primary bg-white/5 
                rounded-xl border border-white/10 outline-none focus:border-crimson-500/50 
                placeholder:text-text-muted transition-colors"
            />
          </div>

          {/* Message List */}
          <div className="space-y-2 glass rounded-2xl p-3">
            {filteredMessages.length === 0 ? (
              <p className="text-center text-text-muted py-8 text-sm">
                No messages found
              </p>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg.id);
                    markAsRead(msg.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selectedMessage === msg.id
                      ? "bg-crimson-500/10 border border-crimson-500/20"
                      : msg.is_read
                      ? "hover:bg-white/5"
                      : "bg-white/[0.03] hover:bg-white/[0.06] border-l-2 border-crimson-500"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.is_read ? (
                      <MailOpen className="w-4 h-4 text-text-muted flex-shrink-0" />
                    ) : (
                      <Mail className="w-4 h-4 text-crimson-400 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-text-primary truncate">
                      {msg.name}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate pl-6">
                    {msg.subject}
                  </p>
                  <p className="text-[10px] text-text-muted pl-6 mt-1">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selectedMsg ? (
            <div className="glass rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2
                    className="text-lg font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selectedMsg.subject}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    From: <span className="text-text-primary">{selectedMsg.name}</span>{" "}
                    &lt;{selectedMsg.email}&gt;
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(selectedMsg.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMsg.id)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center 
                    text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message Body */}
              <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                  className="px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary 
                    hover:opacity-90 transition-opacity shadow-lg shadow-crimson-600/20"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Eye className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
