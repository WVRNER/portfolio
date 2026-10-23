import { InstantLink } from "@/components/InstantLink";
import { BlurImage } from "@/components/BlurImage";
import { getImageMetadata } from "@/lib/imageMetadataHelper";
import { PROJECTS_AND_LABS, type ProjectOrLab } from "@/lib/projectsData";
import { MonolithSurface } from "./MonolithSurface";

/**
 * Clean reusable media surface for a project position.
 * Displays real uploaded imagery when imageUrl is defined.
 * Displays a technical architectural schematic with "In Progress" status when empty.
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
      className={`relative w-full h-full rounded-2xl bg-[#0D0D0E] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 group-hover:border-white/25 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Precision Blueprint Grid Overlay */}
      <div
        className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Top Meta: Status Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 font-mono text-[11px] sm:text-[12px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-white/10 border border-white/20 text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span>VERIFIED ARCHITECTURE</span>
        </div>

        {project.relatedPostSlug && (
          <span className="text-[10.5px] text-white/60 font-mono tracking-wider uppercase">
            NOTE ATTACHED
          </span>
        )}
      </div>

      {/* Center Schematic Vector Sketch */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center">
        {!isLab ? (
          <div className="w-full max-w-[480px]">
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
          </div>
        ) : (
          <div className="w-full max-w-[340px]">
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
          </div>
        )}
      </div>
    </div>
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
 * Automatically selects featured projects from lib/projectsData.ts.
 * Swapping is handled easily by toggling `featured: true` or reordering items.
 */
export function ProjectsGallery() {
  const featured = PROJECTS_AND_LABS.filter((p) => p.featured !== false);
  const project1 = featured[0] || PROJECTS_AND_LABS[0];
  const project2 = featured[1] || PROJECTS_AND_LABS[1] || project1;

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
