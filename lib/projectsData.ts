export interface TechnicalDecision {
  decision: string;
  rationale: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

export interface ProjectOrLab {
  slug: string;
  number: string;
  title: string;
  kind?: string;
  year?: string;
  shortDescription: string;
  technologies?: string[];
  imageUrl?: string;
  isUpcoming?: boolean;
  relatedPostSlug?: string;
  // Optional Case-Study Content Sections (Rendered on dedicated /projects/[slug] route)
  overview?: string;
  whatIBuilt?: string[];
  architecture?: string;
  implementation?: string;
  technicalDecisions?: TechnicalDecision[];
  challenges?: string[];
  whatILearned?: string[];
  commands?: string[];
  codeBlock?: CodeBlock;
  links?: ProjectLink[];
}

/**
 * PROJECTS & LABS REPOSITORY
 * 
 * The two primary project media surfaces:
 * 1. Wide Project 01
 * 2. Square Project 02 (Lab)
 * 
 * Reusable content structure for real engineering systems.
 * Renders real titles, technologies, images, and blog write-ups when configured.
 */
export const PROJECTS_AND_LABS: ProjectOrLab[] = [
  {
    slug: "project-01",
    number: "01",
    title: "Project 01",
    kind: "PROJECT",
    shortDescription: "Cloud Infrastructure & System Architecture",
    technologies: ["AWS", "Terraform", "Docker", "CI/CD"],
    imageUrl: undefined, // Upload path for wide Project 01 image (e.g., "/projects/project-01.png")
    relatedPostSlug: "project-01",
  },
  {
    slug: "project-02",
    number: "02",
    title: "Project 02",
    kind: "LAB",
    shortDescription: "Systems Engineering & Architectural Lab",
    technologies: ["Kubernetes", "DevOps", "Telemetry", "Linux"],
    imageUrl: undefined, // Upload path for square Project/Lab 02 image (e.g., "/projects/project-02.png")
    relatedPostSlug: "project-02",
  },
];
