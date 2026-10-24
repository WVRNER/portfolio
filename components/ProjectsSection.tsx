"use client";

import { useEffect, useState } from "react";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { getLiveProjectsAndLabs, type ProjectOrLab } from "@/lib/projectsData";
import type { BlogPost } from "@/lib/blogData";
import { MonolithSurface } from "./MonolithSurface";

/**
 * Clean reusable media surface for a project position.
 * Always displays real uploaded imagery from the post or case study.
 * Schematic vector diagram is completely removed.
 * Zero em dashes.
 */
function ProjectMediaTile({
  project,
  className = "",
}: {
  project: ProjectOrLab;
  className?: string;
}) {
  const isLab = project.number === "02" || project.kind === "LAB";
  const fallbackImage = isLab
    ? "/blog/short-lived-credentials-aws-oidc-github.webp"
    : "/blog/deterministic-terraform-ephemeral-environments.webp";
  const imageSrc = project.imageUrl || fallbackImage;

  return (
    <MonolithSurface className={`w-full h-full ${className}`}>
      <BlurImage
        src={imageSrc}
        alt={project.title}
        aspectRatio={getImageMetadata(project.slug)?.aspectRatio || 1.777}
        blurDataUrl={getImageMetadata(project.slug)?.blurDataUrl}
        className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out relative z-10"
      />
    </MonolithSurface>
  );
}

/**
 * Clean metadata block beneath each media tile.
 * Matches body font and simplifies hierarchy.
 */
function ProjectInfo({
  project,
  className = "",
}: {
  project: ProjectOrLab;
  className?: string;
}) {
  const hasRealTitle = Boolean(
    project.title && project.title.trim() !== "" && project.title !== "Project Title"
  );

  const hasRealTech = Boolean(
    project.technologies &&
      project.technologies.length > 0 &&
      !project.technologies.includes("Technology 01")
  );

  return (
    <div className={`space-y-2.5 pt-5 sm:pt-6 ${className}`}>
      {hasRealTitle && (
        <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium text-[#242424] tracking-[-0.03em] leading-snug group-hover:text-[#242424]/70 transition-colors">
          {project.title}
        </h3>
      )}

      {project.shortDescription && (
        <p className="text-[14px] sm:text-[15px] text-[#5A5A5A] leading-relaxed max-w-[56ch]">
          {project.shortDescription}
        </p>
      )}

      {hasRealTech && project.technologies && (
        <div className="text-[13px] sm:text-[13.5px] font-sans text-[#6B6B6B] font-normal tracking-normal flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{project.technologies.join(" · ")}</span>
        </div>
      )}
    </div>
  );
}

/**
 * PROJECTS & LABS TITLE
 * Sentence case matching other section headings.
 */
export function ProjectsTitle() {
  return (
    <div
      id="projects"
      aria-label="Projects and Labs"
      className="relative pt-24 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto border-t border-[#242424]/10 bg-white"
    >
      <div className="w-full">
        <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium tracking-[-0.035em] text-[#242424] leading-[1.05] select-none">
          Projects &amp; Labs
        </h2>
      </div>
    </div>
  );
}

/**
 * PROJECTS GALLERY
 * Automatically resolves featured projects from Ghost CMS or local posts.
 * Slot 1 is routed via tag `#project-1`, Slot 2 via `#project-2` or `#lab`.
 * Fallback routes first `#project` to Slot 1, second `#project` to Slot 2.
 */
export function ProjectsGallery({ initialPosts }: { initialPosts?: BlogPost[] } = {}) {
  const [livePosts, setLivePosts] = useState<BlogPost[] | undefined>(initialPosts);

  useEffect(() => {
    fetch("/ghost-posts.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLivePosts(data);
        }
      })
      .catch(() => {
        // Fallback silently to static posts
      });
  }, []);

  const [project1, project2] = getLiveProjectsAndLabs(livePosts);

  const targetUrl1 = project1.relatedPostSlug
    ? `/blog/${project1.relatedPostSlug}`
    : `/blog/${project1.slug}`;

  const targetUrl2 = project2.relatedPostSlug
    ? `/blog/${project2.relatedPostSlug}`
    : `/blog/${project2.slug}`;

  return (
    <div
      aria-label="Projects Gallery"
      className="relative pb-24 sm:pb-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] lg:gap-x-8 xl:gap-x-10 gap-y-12 lg:gap-y-0">
        {/* Project 01: Single cohesive card & link */}
        <div className="w-full min-w-0">
          <InstantLink
            href={targetUrl1}
            className="group block w-full focus:outline-none cursor-pointer"
            aria-label={project1.title ? `View ${project1.title}` : "View Project 01"}
          >
            <div className="w-full h-[240px] sm:h-[300px] lg:h-[420px] xl:h-[480px]">
              <ProjectMediaTile project={project1} />
            </div>
            <ProjectInfo project={project1} />
          </InstantLink>
        </div>

        {/* Project 02: Single cohesive card & link */}
        <div className="w-full lg:w-[420px] xl:w-[480px] min-w-0 pt-10 lg:pt-0 border-t border-[#242424]/10 lg:border-t-0">
          <InstantLink
            href={targetUrl2}
            className="group block w-full focus:outline-none cursor-pointer"
            aria-label={project2.title ? `View ${project2.title}` : "View Project 02"}
          >
            <div className="w-full lg:w-[420px] xl:w-[480px] h-[240px] sm:h-[300px] lg:h-[420px] xl:h-[480px]">
              <ProjectMediaTile project={project2} />
            </div>
            <ProjectInfo project={project2} />
          </InstantLink>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard combined export if referenced together.
 */
export function ProjectsSection() {
  return (
    <section className="bg-white">
      <ProjectsTitle />
      <ProjectsGallery />
    </section>
  );
}
