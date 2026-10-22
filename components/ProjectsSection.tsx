import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { PROJECTS_AND_LABS, type ProjectOrLab } from "@/lib/projectsData";
import { BLOG_POSTS } from "@/lib/blogData";
import { MonolithSurface } from "./MonolithSurface";

/**
 * Clean reusable media surface for a project position.
 * Displays real uploaded imagery when `imageUrl` is defined.
 * Displays a technical architectural schematic with "In Progress" status when empty.
 */
function ProjectMediaTile({
  project,
  className = "",
}: {
  project: ProjectOrLab;
  className?: string;
}) {
  const isLab = project.number === "02" || project.kind === "LAB";

  if (project.imageUrl) {
    return (
      <MonolithSurface className={`w-full h-full ${className}`}>
        <BlurImage
          src={project.imageUrl}
          alt={project.title}
          aspectRatio={getImageMetadata(project.slug)?.aspectRatio || 1.777}
          blurDataUrl={getImageMetadata(project.slug)?.blurDataUrl}
          className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out relative z-10"
        />
      </MonolithSurface>
    );
  }

  return (
    <div
      className={`relative w-full h-full rounded-2xl bg-[#0D0D0E] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Precision Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Top Meta: Live Status Badge + Architecture Tag */}
      <div className="relative z-10 flex items-center justify-between gap-3 font-mono text-[11px] sm:text-[12px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>IN PROGRESS</span>
        </div>

        <span className="text-white/40 tracking-widest uppercase">
          {isLab ? "LAB // AWS FARGATE" : "SYS // MULTI-REGION"}
        </span>
      </div>

      {/* Center Schematic Vector Sketch */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center">
        {!isLab ? (
          <div className="w-full max-w-[480px] space-y-4">
            <svg viewBox="0 0 480 120" className="w-full h-auto fill-none stroke-white/30" strokeWidth="1">
              <rect x="20" y="35" width="90" height="50" rx="6" fill="#161618" stroke="#333336" />
              <text x="65" y="58" fill="#EDEDED" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GIT OIDC</text>
              <text x="65" y="72" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">v4.2 SHA</text>

              <line x1="110" y1="60" x2="160" y2="60" stroke="#444448" strokeDasharray="3 3" />
              <polygon points="160,60 152,56 152,64" fill="#666" />

              <rect x="160" y="25" width="120" height="70" rx="8" fill="#1C1C1F" stroke="#444448" />
              <text x="220" y="52" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">TERRAFORM CORE</text>
              <text x="220" y="68" fill="#34D399" fontSize="9" fontFamily="monospace" textAnchor="middle">DRIFT: ZERO</text>
              <text x="220" y="80" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">STATE LOCK // S3</text>

              <line x1="280" y1="45" x2="330" y2="35" stroke="#444448" />
              <line x1="280" y1="75" x2="330" y2="85" stroke="#444448" />

              <rect x="330" y="15" width="130" height="40" rx="6" fill="#161618" stroke="#333336" />
              <text x="395" y="34" fill="#EDEDED" fontSize="9.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">AWS us-east-1</text>
              <text x="395" y="47" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">PRIMARY VPC</text>

              <rect x="330" y="65" width="130" height="40" rx="6" fill="#161618" stroke="#333336" />
              <text x="395" y="84" fill="#EDEDED" fontSize="9.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">AWS eu-west-1</text>
              <text x="395" y="97" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">REPLICA CANARY</text>
            </svg>
            <p className="text-[12px] sm:text-[13px] font-sans text-neutral-400 text-center leading-relaxed">
              Declarative state engine reconciling infrastructure drift and multi-region routing across AWS.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[340px] space-y-4">
            <svg viewBox="0 0 340 140" className="w-full h-auto fill-none stroke-white/30" strokeWidth="1">
              <rect x="20" y="45" width="80" height="50" rx="6" fill="#161618" stroke="#333336" />
              <text x="60" y="68" fill="#EDEDED" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PR DISPATCH</text>
              <text x="60" y="82" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">EPHEMERAL</text>

              <line x1="100" y1="70" x2="140" y2="70" stroke="#444448" strokeDasharray="3 3" />
              <polygon points="140,70 132,66 132,74" fill="#666" />

              <rect x="140" y="25" width="160" height="90" rx="8" fill="#1C1C1F" stroke="#444448" />
              <text x="220" y="52" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">FARGATE SANDBOX</text>
              <text x="220" y="70" fill="#60A5FA" fontSize="9" fontFamily="monospace" textAnchor="middle">TTL: 45 MINUTES</text>
              <text x="220" y="84" fill="#888888" fontSize="8" fontFamily="monospace" textAnchor="middle">ISOLATED SUBNET</text>
              <text x="220" y="98" fill="#34D399" fontSize="8" fontFamily="monospace" textAnchor="middle">MUTUAL TLS MESH</text>
            </svg>
            <p className="text-[12px] sm:text-[13px] font-sans text-neutral-400 text-center leading-relaxed">
              Automated container preview environments spun up and torn down per pull request.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Technical Telemetry Line */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10.5px] font-mono text-white/50">
        <span>ARCH SPEC v2.4</span>
        <span className="text-white/70">AUTONOMOUS STATE: ONLINE</span>
      </div>
    </div>
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

      {project.shortDescription && (
        <p className="text-[14px] sm:text-[15px] text-[#5A5A5A] leading-relaxed max-w-[56ch]">
          {project.shortDescription}
        </p>
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
      className="relative pt-24 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto border-t border-[#0A0A0A]/10 bg-white"
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
      className="relative pb-24 sm:pb-32 px-6 sm:px-12 md:px-16 lg:px-24 max-w-[1400px] mx-auto bg-white"
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
