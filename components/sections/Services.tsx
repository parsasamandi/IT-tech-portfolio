"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Server, Cloud, Smartphone, Shield, Brain, ArrowRight, Briefcase, Megaphone, PenTool, Share2, MessageSquare, CalendarCheck, Users, Dumbbell, Gift } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

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
    <section id="services" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading title="Our Platforms" highlight="Platforms" subtitle="What We Build" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Globe;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group p-8 rounded-3xl bg-navy-50 border border-navy-100 card-shadow-hover transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-crimson-600 transition-colors duration-500">
                  <Icon className="w-8 h-8 text-navy-900 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-black text-navy-900 mb-4 group-hover:text-crimson-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  {service.title}
                </h3>
                <p className="text-navy-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 group-hover:text-crimson-600 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
