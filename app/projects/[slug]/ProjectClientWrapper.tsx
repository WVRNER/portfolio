"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { CVDrawer } from "@/components/CVDrawer";
import { PROJECTS_AND_LABS, type ProjectOrLab } from "@/lib/projectsData";

interface ProjectClientWrapperProps {
  project: ProjectOrLab;
}

export function ProjectClientWrapper({ project }: ProjectClientWrapperProps) {
  const [cvOpen, setCvOpen] = useState(false);

  // Pagination: Previous / Next project links (only rendered if more than 1 project exists)
  const currentIndex = PROJECTS_AND_LABS.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? PROJECTS_AND_LABS[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < PROJECTS_AND_LABS.length - 1
      ? PROJECTS_AND_LABS[currentIndex + 1]
      : null;

  return (
    <div className="relative min-h-[100dvh] bg-white text-[#0A0A0A] font-sans selection:bg-[#0A0A0A] selection:text-white">
      {/* Navigation */}
      <Navigation onOpenCV={() => setCvOpen(true)} />

      {/* Main Case-Study Container */}
      <main className="max-w-[1240px] mx-auto px-6 sm:px-10 md:px-14 pt-32 sm:pt-40 pb-28">
        
        {/* Back Link */}
        <div className="mb-10 sm:mb-14">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-[12px] font-mono tracking-wider uppercase text-[#686763] hover:text-[#121211] transition-colors"
          >
            <span>←</span>
            <span>BACK TO PROJECTS &amp; LABS</span>
          </Link>
        </div>

        {/* Project Page Hero Header */}
        <header className="border-b border-[#121211]/15 pb-12 sm:pb-16 mb-12 sm:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.24em] uppercase text-[#9E9D97]">
              <span>PROJECT</span>
              <span>{"//"}</span>
              <span>{project.number}</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal text-[#121211] leading-[1.02] tracking-[-0.035em]">
              {project.title}
            </h1>

            {project.shortDescription && (
              <p className="text-[16px] sm:text-[18px] text-[#686763] max-w-[54ch] leading-relaxed pt-2">
                {project.shortDescription}
              </p>
            )}
          </div>

          {/* Technical Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 sm:pt-12 mt-10 border-t border-[#121211]/10 text-[12px] font-mono">
            <div>
              <span className="text-[#9E9D97] block uppercase tracking-wider mb-1">TYPE</span>
              <span className="text-[#121211] font-medium">{project.kind}</span>
            </div>

            {project.year && (
              <div>
                <span className="text-[#9E9D97] block uppercase tracking-wider mb-1">YEAR</span>
                <span className="text-[#121211] font-medium">{project.year}</span>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="col-span-2">
                <span className="text-[#9E9D97] block uppercase tracking-wider mb-1">TECHNOLOGIES</span>
                <span className="text-[#121211] font-medium uppercase tracking-wide">
                  {project.technologies.join(" · ")}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Case Study Technical Breakdown Sections (Rendered only if defined) */}
        <div className="space-y-16 sm:space-y-20">

          {/* 01 // OVERVIEW */}
          {project.overview && (
            <section className="space-y-4 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                01 {"//"} OVERVIEW &amp; CONTEXT
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#121211] leading-relaxed max-w-[68ch]">
                {project.overview}
              </p>
            </section>
          )}

          {/* 02 // WHAT I BUILT */}
          {project.whatIBuilt && project.whatIBuilt.length > 0 && (
            <section className="space-y-6 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                02 {"//"} DELIVERABLES &amp; SCOPE
              </div>
              <ul className="space-y-3.5 max-w-[68ch]">
                {project.whatIBuilt.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-[15px] text-[#121211] leading-relaxed">
                    <span className="font-mono text-[12px] text-[#9E9D97] mt-1 shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 03 // ARCHITECTURE */}
          {project.architecture && (
            <section className="space-y-4 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                03 {"//"} ARCHITECTURAL TOPOLOGY
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#121211] leading-relaxed max-w-[68ch]">
                {project.architecture}
              </p>
            </section>
          )}

          {/* 04 // IMPLEMENTATION */}
          {project.implementation && (
            <section className="space-y-4 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                04 {"//"} IMPLEMENTATION NOTES
              </div>
              <p className="text-[15px] sm:text-[16px] text-[#121211] leading-relaxed max-w-[68ch]">
                {project.implementation}
              </p>
            </section>
          )}

          {/* 05 // TECHNICAL DECISIONS */}
          {project.technicalDecisions && project.technicalDecisions.length > 0 && (
            <section className="space-y-6 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                05 {"//"} KEY TECHNICAL DECISIONS
              </div>
              <div className="border-t border-[#121211]/15 divide-y divide-[#121211]/10">
                {project.technicalDecisions.map((item, idx) => (
                  <div key={idx} className="py-6 space-y-1.5">
                    <div className="text-[15px] font-medium text-[#121211]">
                      {item.decision}
                    </div>
                    <p className="text-[14px] text-[#686763] leading-relaxed max-w-[64ch]">
                      {item.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 06 // PROBLEMS & CHALLENGES */}
          {project.challenges && project.challenges.length > 0 && (
            <section className="space-y-6 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                06 {"//"} ROADBLOCKS &amp; DEBUGGING
              </div>
              <ul className="space-y-3 max-w-[68ch]">
                {project.challenges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14.5px] text-[#121211] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#121211]/40 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 07 // WHAT I LEARNED */}
          {project.whatILearned && project.whatILearned.length > 0 && (
            <section className="space-y-6 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                07 {"//"} TAKEAWAYS &amp; LESSONS
              </div>
              <ul className="space-y-3 max-w-[68ch]">
                {project.whatILearned.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14.5px] text-[#121211] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#121211] mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 08 // COMMANDS & WORKFLOW */}
          {project.commands && project.commands.length > 0 && (
            <section className="space-y-4 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                08 {"//"} VERIFICATION COMMANDS
              </div>
              <div className="bg-[#141413] text-[#FBFBFA] p-5 sm:p-6 rounded-sm font-mono text-[12.5px] sm:text-[13px] leading-relaxed overflow-x-auto">
                <pre>{project.commands.join("\n")}</pre>
              </div>
            </section>
          )}

          {/* 09 // LINKS */}
          {project.links && project.links.length > 0 && (
            <section className="space-y-4 pb-12 sm:pb-16 border-b border-[#121211]/10">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#9E9D97]">
                09 {"//"} REFERENCES &amp; REPOSITORIES
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-mono text-[#121211] hover:underline uppercase tracking-wider"
                  >
                    <span>{link.label}</span>
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Project Navigation Footer (Only renders previous/next when multiple projects exist) */}
        <footer className="mt-16 pt-10 border-t border-[#121211]/15">
          {PROJECTS_AND_LABS.length > 1 ? (
            <div className="flex items-center justify-between">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group flex flex-col text-left space-y-1"
                >
                  <span className="text-[11px] font-mono text-[#9E9D97] tracking-wider uppercase">
                    ← PREVIOUS PROJECT
                  </span>
                  <span className="text-[15px] font-medium text-[#121211] group-hover:underline">
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group flex flex-col text-right space-y-1"
                >
                  <span className="text-[11px] font-mono text-[#9E9D97] tracking-wider uppercase">
                    NEXT PROJECT →
                  </span>
                  <span className="text-[15px] font-medium text-[#121211] group-hover:underline">
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9E9D97] uppercase tracking-wider">
              <Link href="/#work" className="hover:text-[#121211] transition-colors">
                ← RETURN TO ALL PROJECTS &amp; LABS
              </Link>
              <span>WVRNER CASE STUDY {"//"} INITIAL ENTRY</span>
            </div>
          )}
        </footer>

      </main>

      {/* CV Modal Drawer */}
      <CVDrawer isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
