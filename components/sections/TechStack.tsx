"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/lib/supabase";
import { TECH_STACK } from "@/lib/constants";

export default function TechStack() {
  const [techStack, setTechStack] = useState<string[]>(TECH_STACK);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("settings")
          .select("tech_stack_items")
          .single();

        if (error) throw error;
        if (data?.tech_stack_items && Array.isArray(data.tech_stack_items)) {
          setTechStack(data.tech_stack_items);
        }
      } catch (err) {
        console.error("Error fetching tech stack:", err);
      }
    };

    fetchTechStack();
  }, []);

  return (
    <section id="tech-stack" className="section-padding bg-navy-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <SectionHeading title="Our Tech Stack" highlight="Tech Stack" subtitle="Built With Modern Tools" />

        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="px-6 py-3 rounded-full bg-white border border-navy-200 card-shadow-hover hover:border-crimson-400 hover:bg-crimson-50 transition-all duration-300"
            >
              <span className="text-sm font-bold text-navy-900 hover:text-crimson-600 transition-colors">
                {tech}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
