"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import toast from "react-hot-toast";

const inputCls = `w-full px-4 py-3 text-sm text-navy-900 bg-white rounded-xl
  border border-slate-200 outline-none
  focus:border-crimson-400 focus:ring-2 focus:ring-crimson-100
  placeholder:text-slate-400 transition-all duration-200`;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactData, setContactData] = useState<{
    email: string;
    phone: string;
    location: string;
    working_hours: { day: string; time: string }[];
  }>({
    email: "contact@sysplat.com",
    phone: "",
    location: "Vancouver, BC",
    working_hours: [
      { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
      { day: "Saturday", time: "Closed" },
      { day: "Sunday", time: "Closed" },
    ],
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("email, phone, location, working_hours")
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setContactData({
            email: data.email || "contact@sysplat.com",
            phone: data.phone || "",
            location: data.location || "Vancouver, BC",
            working_hours: data.working_hours || [
              { day: "Mon - Fri", time: "9:00 AM - 6:00 PM" },
              { day: "Saturday", time: "Closed" },
              { day: "Sunday", time: "Closed" },
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching contact settings:", err);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Message sent!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else toast.error("Failed to send.");
    } catch { toast.error("Something went wrong."); }
    finally { setIsSubmitting(false); }
  };

  const change = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((p) => ({ ...p, [field]: e.target.value }));

  const infoItems = [
    { Icon: Mail, label: "Email", value: contactData.email, href: `mailto:${contactData.email}` },
    ...(contactData.phone ? [{ Icon: Phone, label: "Phone", value: contactData.phone, href: `tel:${contactData.phone.replace(/\s+/g, "")}` }] : []),
    { Icon: MapPin, label: "Location", value: contactData.location },
  ];

  return (
    <section id="contact" className="relative py-24 bg-white border-t border-navy-100/50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.4] dot-pattern" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        <SectionHeading title="Let's Build Your Platform" highlight="Platform" subtitle="Contact Us" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info */}
          <div className="space-y-4">
            {infoItems.map(({ Icon, label, value, href }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card bg-navy-50/50 backdrop-blur-sm p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0
                  shadow-sm shadow-crimson-500/15">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-navy-900 hover:text-crimson-600 transition-colors truncate block max-w-[180px] sm:max-w-none">{value}</a>
                  ) : (
                    <p className="text-sm font-medium text-navy-900">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card bg-navy-50/50 backdrop-blur-sm p-4"
            >
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Working Hours</h4>
              <div className="space-y-1.5">
                {contactData.working_hours.map(({ day, time }) => (
                  <div key={day} className="flex justify-between text-xs">
                    <span className="text-text-secondary">{day}</span>
                    <span className={`font-medium ${time === "Closed" ? "text-crimson-500" : "text-navy-900"}`}>{time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 card bg-navy-50/50 backdrop-blur-sm p-6 md:p-7"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
                <input id="contact-name" type="text" required placeholder="John Doe"
                  className={inputCls} value={formData.name} onChange={change("name")} />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
                <input id="contact-email" type="email" required placeholder="john@example.com"
                  className={inputCls} value={formData.email} onChange={change("email")} />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="contact-subject" className="block text-xs font-medium text-text-secondary mb-1.5">Subject</label>
              <input id="contact-subject" type="text" required placeholder="How can we help?"
                className={inputCls} value={formData.subject} onChange={change("subject")} />
            </div>
            <div className="mb-5">
              <label htmlFor="contact-message" className="block text-xs font-medium text-text-secondary mb-1.5">Message</label>
              <textarea id="contact-message" required rows={5} placeholder="Tell us about your project..."
                className={`${inputCls} resize-none`} value={formData.message} onChange={change("message")} />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full md:w-auto px-7 py-3 text-sm font-semibold text-white rounded-xl
                gradient-primary hover:opacity-90 transition-all shadow-sm shadow-crimson-500/15
                flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
