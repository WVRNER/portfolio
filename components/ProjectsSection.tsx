import Link from "next/link";
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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={project.imageUrl}
          alt={hasRealTitle ? project.title : `Project ${project.number}`}
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

  const targetUrl =
    project.slug === "project-02" || project.kind?.toLowerCase() === "lab"
      ? "/blog/lab"
      : `/blog/${project.slug}`;

  return (
    <div className={`space-y-3 pt-6 sm:pt-8 ${className}`}>
      <div className="text-[11px] font-mono tracking-[0.24em] uppercase text-[#5A5A5A]">
        {project.number
          ? `${project.number} / ${project.kind ? project.kind.toUpperCase() : "PROJECT"}`
          : "01 / PROJECT"}
      </div>

      {hasRealTitle && (
        <Link
          href={targetUrl}
          className="block group focus:outline-none"
        >
          <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium text-[#0A0A0A] tracking-[-0.035em] leading-snug group-hover:text-[#0A0A0A]/70 transition-colors">
            {project.title}
          </h3>
        </Link>
      )}

      {hasRealTech && project.technologies && (
        <div className="text-[13px] font-mono text-[#5A5A5A] tracking-wide">
          {project.technologies.join(" · ")}
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          href={targetUrl}
          className="group/link inline-flex items-center gap-1.5 text-[11.5px] font-mono font-medium text-[#0A0A0A] uppercase tracking-[0.16em] hover:opacity-60 transition-opacity"
        >
          <span>VIEW {project.kind ? project.kind.toUpperCase() : "PROJECT"}</span>
          <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
            ↗
          </span>
        </Link>

        {hasWriteUp && project.relatedPostSlug && (
          <Link
            href={`/blog/${project.relatedPostSlug}`}
            className="group/link inline-flex items-center gap-1.5 text-[11.5px] font-mono font-medium text-[#0A0A0A] uppercase tracking-[0.16em] hover:opacity-60 transition-opacity"
          >
            <span>READ WRITE-UP</span>
            <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
              ↗
            </span>
          </Link>
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
      {/* DESKTOP LAYOUT: [ WIDE MEDIA TILE 01 ] [ SQUARE MEDIA TILE 02 ] */}
      <div className="hidden lg:block w-full">
        <div className="flex flex-row items-stretch gap-8 xl:gap-10 h-[420px] xl:h-[480px]">
          {/* Wide Project 01 */}
          <div className="flex-1 h-full min-w-0">
            <Link
              href="/blog/project-01"
              className="group block w-full h-full focus:outline-none"
              aria-label={project1.title ? `View ${project1.title}` : "View Project 01"}
            >
              <ProjectMediaTile project={project1} />
            </Link>
          </div>

          {/* Square Project/Lab 02 */}
          <div className="w-[420px] xl:w-[480px] shrink-0 h-full aspect-square">
            <Link
              href="/blog/lab"
              className="group block w-full h-full focus:outline-none"
              aria-label={project2.title ? `View ${project2.title}` : "View Lab"}
            >
              <ProjectMediaTile project={project2} />
            </Link>
          </div>
        </div>

        {/* Project Metadata & Action Links */}
        <div className="flex flex-row gap-8 xl:gap-10 items-start pt-2">
          <div className="flex-1 min-w-0">
            <ProjectInfo project={project1} />
          </div>
          <div className="w-[420px] xl:w-[480px] shrink-0">
            <ProjectInfo project={project2} />
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET LAYOUT (< lg) */}
      <div className="block lg:hidden w-full space-y-14">
        {/* Project 01 */}
        <div className="space-y-4">
          <div className="w-full h-[240px] sm:h-[300px]">
            <Link
              href="/blog/project-01"
              className="group block w-full h-full focus:outline-none"
            >
              <ProjectMediaTile project={project1} />
            </Link>
          </div>
          <ProjectInfo project={project1} />
        </div>

        {/* Project 02 */}
        <div className="space-y-4 pt-10 border-t border-[#0A0A0A]/10">
          <div className="w-[75%] sm:w-[65%] aspect-square">
            <Link
              href="/blog/lab"
              className="group block w-full h-full focus:outline-none"
            >
              <ProjectMediaTile project={project2} />
            </Link>
          </div>
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
