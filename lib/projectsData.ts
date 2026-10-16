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
    title: "",
    kind: "PROJECT",
    shortDescription: "",
    technologies: [],
    imageUrl: undefined, // Upload path for wide Project 01 image (e.g., "/projects/project-01.png")
    relatedPostSlug: undefined, // Set to matching slug in lib/blogData.ts to enable READ WRITE-UP ↗
  },
  {
    slug: "project-02",
    number: "02",
    title: "",
    kind: "LAB",
    shortDescription: "",
    technologies: [],
    imageUrl: undefined, // Upload path for square Project/Lab 02 image (e.g., "/projects/project-02.png")
    relatedPostSlug: undefined, // Set to matching slug in lib/blogData.ts to enable READ WRITE-UP ↗
  },
];
