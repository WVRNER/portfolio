import Link from "next/link";
import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { PROJECTS_AND_LABS, type ProjectOrLab } from "@/lib/projectsData";
import { BLOG_POSTS } from "@/lib/blogData";
import { MonolithSurface } from "./MonolithSurface";

/**
 * Clean reusable media surface for a project position.
 * Displays real uploaded imagery when `imageUrl` is defined.
 * Displays substantial tactile graphite surface (#141413 + grain) when empty.
 */
function ProjectMediaTile({
  project,
  className = "",
}: {
  project: ProjectOrLab;
  className?: string;
}) {
  const hasRealTitle = Boolean(
    project.title && project.title.trim() !== "" && project.title !== "Project Title"
  );

  return (
    <MonolithSurface className={`w-full h-full ${className}`}>
      {project.imageUrl && (
        <BlurImage
          src={project.imageUrl}
          alt={hasRealTitle ? project.title : `Project ${project.number}`}
          aspectRatio={getImageMetadata(project.slug)?.aspectRatio || 1.777}
          blurDataUrl={getImageMetadata(project.slug)?.blurDataUrl}
          className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out relative z-10"
        />
      )}
    </MonolithSurface>
  );
}

/**
 * Clean metadata and action block beneath each media tile.
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

  const hasWriteUp = Boolean(
    project.relatedPostSlug &&
      project.relatedPostSlug !== "article-01" &&
      BLOG_POSTS.some((p) => p.slug === project.relatedPostSlug)
  );

  const targetUrl = `/blog/${project.slug}`;

  return (
    <div className={`space-y-3 pt-6 sm:pt-8 ${className}`}>
      <div className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#5A5A5A]">
        {project.number
          ? `${project.number} / ${project.kind ? project.kind.toUpperCase() : "PROJECT"}`
          : "01 / PROJECT"}
      </div>

      {hasRealTitle && (
        <InstantLink
          href={targetUrl}
          className="block group focus:outline-none"
        >
          <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium text-[#0A0A0A] tracking-[-0.035em] leading-snug group-hover:text-[#0A0A0A]/70 transition-colors">
            {project.title}
          </h3>
        </InstantLink>
      )}

      {hasRealTech && project.technologies && (
        <div className="text-[13px] font-mono text-[#5A5A5A] tracking-wide">
          {project.technologies.join(" · ")}
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <InstantLink
          href={targetUrl}
          className="group/link inline-flex items-center gap-1.5 text-[11.5px] font-mono font-medium text-[#0A0A0A] uppercase tracking-[0.16em] hover:opacity-60 transition-opacity"
        >
          <span>VIEW {project.kind ? project.kind.toUpperCase() : "PROJECT"}</span>
          <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
            ↗
          </span>
        </InstantLink>

        {hasWriteUp && project.relatedPostSlug && (
          <InstantLink
            href={`/blog/${project.relatedPostSlug}`}
            className="group/link inline-flex items-center gap-1.5 text-[11.5px] font-mono font-medium text-[#0A0A0A] uppercase tracking-[0.16em] hover:opacity-60 transition-opacity"
          >
            <span>READ WRITE-UP</span>
            <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
              ↗
            </span>
          </InstantLink>
        )}
      </div>
    </div>
  );
}

/**
 * PROJECTS & LABS TITLE
 * The visual destination of the reversible geometric sequence.
 */
export function ProjectsTitle() {
  return (
    <div
      id="projects"
      aria-label="Projects and Labs"
      className="relative pt-24 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1720px] mx-auto border-t border-[#0A0A0A]/10 bg-white"
    >
      <div className="w-full">
        <h2 className="font-display text-[clamp(3.5rem,8.5vw,7.8rem)] font-medium tracking-[-0.04em] text-[#0A0A0A] leading-[0.88] select-none">
          PROJECTS &amp; LABS
        </h2>
      </div>
    </div>
  );
}

/**
 * PROJECTS GALLERY
 * The static project cards (Wide Project 01 & Square Project 02).
 * Unaffected by the geometric animation sequence.
 */
export function ProjectsGallery() {
  const project1 = PROJECTS_AND_LABS[0];
  const project2 = PROJECTS_AND_LABS[1];

  return (
    <div
      aria-label="Projects Gallery"
      className="relative pb-24 sm:pb-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1720px] mx-auto bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] lg:gap-x-8 xl:lg:gap-x-10">
        {/* Project 01 Media Tile */}
        <div className="w-full h-[240px] sm:h-[300px] lg:h-[420px] xl:lg:h-[480px] lg:col-start-1 lg:row-start-1 min-w-0">
          <InstantLink
            href="/blog/project-01"
            className="group block w-full h-full focus:outline-none"
            aria-label={project1.title ? `View ${project1.title}` : "View Project 01"}
          >
            <ProjectMediaTile project={project1} />
          </InstantLink>
        </div>

        {/* Project 01 Info Block */}
        <div className="lg:col-start-1 lg:row-start-2 min-w-0 pb-10 lg:pb-0">
          <ProjectInfo project={project1} />
        </div>

        {/* Project 02 Media Tile */}
        <div className="pt-10 lg:pt-0 border-t border-[#0A0A0A]/10 lg:border-t-0 w-[75%] sm:w-[65%] lg:w-[420px] xl:lg:w-[480px] lg:h-[420px] xl:lg:h-[480px] aspect-square lg:col-start-2 lg:row-start-1 shrink-0">
          <InstantLink
            href="/blog/project-02"
            className="group block w-full h-full focus:outline-none"
            aria-label={project2.title ? `View ${project2.title}` : "View Lab"}
          >
            <ProjectMediaTile project={project2} />
          </InstantLink>
        </div>

        {/* Project 02 Info Block */}
        <div className="lg:col-start-2 lg:row-start-2 lg:w-[420px] xl:lg:w-[480px] shrink-0">
          <ProjectInfo project={project2} />
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
