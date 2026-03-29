"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Server, Cloud, Smartphone, Shield, Brain, ArrowRight, Briefcase, Megaphone, PenTool, Share2, MessageSquare, CalendarCheck, Users, Dumbbell, Gift } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { useShouldReduceMotion } from "@/lib/hooks";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = { Globe, Server, Cloud, Smartphone, Shield, Brain, Briefcase, Megaphone, PenTool, Share2, MessageSquare, CalendarCheck, Users, Dumbbell, Gift };

export default function Services() {
  const [services, setServices] = useState<Service[]>(
    SERVICES.map((s, i) => ({
      id: `default-${i}`,
      icon: s.icon,
      title: s.title,
      description: s.description,
      display_order: i + 1
    }))
  );
  const reduce = useShouldReduceMotion();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("services")
          .select("id, icon, title, description, display_order")
          .order("display_order", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="section-padding bg-gradient-to-br from-slate-50 via-white to-navy-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <SectionHeading title="Our Platforms" highlight="Platforms" subtitle="What We Build" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Globe;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: reduce ? 0 : i * 0.1, duration: reduce ? 0 : 0.6, ease: "easeOut" }}
                className="group relative"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white via-white to-navy-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main Card */}
                <div className="relative p-10 rounded-3xl glass-card border border-navy-100/60 hover:border-navy-200/80 shadow-lg shadow-navy-900/5 hover:shadow-xl hover:shadow-navy-900/10 transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                  {/* Icon Container */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-50 to-white shadow-lg shadow-navy-900/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-crimson-500 group-hover:to-crimson-600 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-crimson-500/25">
                      <Icon className="w-9 h-9 text-navy-700 group-hover:text-white transition-colors duration-500 group-hover:scale-110" />
                    </div>
                    {/* Icon Glow Effect */}
                    <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-crimson-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-navy-900 group-hover:text-navy-800 transition-colors duration-300 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {service.title}
                    </h3>
                    <p className="text-navy-600 leading-relaxed text-base group-hover:text-navy-700 transition-colors duration-300 text-justify">
                      {service.description}
                    </p>

                    {/* Enhanced Learn More Link */}
                    <div className="pt-2">
                      <a href="#contact" className="inline-flex items-center gap-3 text-sm font-bold text-navy-800 group-hover:text-crimson-600 transition-all duration-300 hover:gap-4">
                        <span>Learn More</span>
                        <div className="w-8 h-8 rounded-full bg-navy-100 group-hover:bg-crimson-100 flex items-center justify-center transition-all duration-300">
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
