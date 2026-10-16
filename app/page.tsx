"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StoryScrollSequence } from "@/components/StoryScrollSequence";
import { ProjectsTitle, ProjectsGallery } from "@/components/ProjectsSection";
import { SystemsSection } from "@/components/SystemsSection";
import { WritingSection } from "@/components/WritingSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { CVDrawer } from "@/components/CVDrawer";

export default function Home() {
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <SmoothScroll>
      <div className="relative min-h-[100dvh] bg-white text-[#0A0A0A] font-sans">
        {/* Navigation */}
        <Navigation onOpenCV={() => setCvOpen(true)} />

        {/* Hero Section */}
        <HeroSection />

        {/* Cinematic Theatrical Scroll-Driven Sequence (Nima Hosseini -> Silence -> Standard) */}
        <StoryScrollSequence />

        {/* 5. Systems & Disciplines (Syscore - Untouched internal animation) */}
        <SystemsSection />

        {/* 6. Stories / Writing Section */}
        <WritingSection />

        {/* 7. Projects & Labs (under blog / stories) */}
        <ProjectsTitle />
        <ProjectsGallery />

        {/* 7. Profile / About */}
        <AboutSection />

        {/* 8. Contact & Footer */}
        <ContactSection />

        {/* Modal CV View */}
        <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
      </div>
    </SmoothScroll>
  );
}
