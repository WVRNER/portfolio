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
  kind?: "PROJECT" | "LAB";
  year?: string;
  shortDescription: string;
  technologies?: string[];
  imageUrl?: string;
  isDraft?: boolean;
  featured?: boolean;
  relatedPostSlug?: string;
  // Optional Case-Study Content Sections
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
 * ==============================================================================
 * PROJECTS & ARCHITECTURAL LABS REPOSITORY (EASY USER EDIT GUIDE)
 * ==============================================================================
 * 
 * HOW TO SWAP OR CHANGE PROJECTS ON THE HOMEPAGE:
 * 1. TO SWAP PROJECTS:
 *    - The homepage automatically displays the projects where `featured: true`
 *      (or the first 2 items in this array).
 *    - Position 01 (Left / Wide): Wide architectural project.
 *    - Position 02 (Right / Square): Lab / sandbox environment.
 *    - To swap, simply change which items have `featured: true` or reorder them!
 * 
 * 2. TO DRAFT OR PUBLISH:
 *    - Set `isDraft: true` -> Displays a clean [DRAFT // IN LAB] badge.
 *    - Set `isDraft: false` -> Marks it as a live verified production system.
 * 
 * 3. TO CONNECT A PROJECT TO A WRITING / BLOG ARTICLE:
 *    - Set `relatedPostSlug: "your-blog-slug"` (must match a slug in lib/blogData.ts).
 *    - Clicking the card will smoothly morph directly into that article!
 * 
 * 4. TO ADD A CUSTOM IMAGE:
 *    - Place an image in public/projects/ (e.g., /projects/my-arch.png)
 *    - Set `imageUrl: "/projects/my-arch.png"`
 * ==============================================================================
 */
export const PROJECTS_AND_LABS: ProjectOrLab[] = [
  {
    slug: "project-01",
    number: "01",
    title: "Autonomous Multi-Region State Engine",
    kind: "PROJECT",
    isDraft: true,
    featured: true,
    shortDescription: "Declarative infrastructure state reconciliation and automated drift remediation across AWS.",
    technologies: ["AWS", "Terraform", "GitHub OIDC", "Docker"],
    imageUrl: undefined,
    relatedPostSlug: "deterministic-terraform-ephemeral-environments",
  },
  {
    slug: "project-02",
    number: "02",
    title: "Ephemeral Sandbox Mesh",
    kind: "LAB",
    isDraft: true,
    featured: true,
    shortDescription: "On-demand isolated preview environments running on AWS Fargate with verified OIDC.",
    technologies: ["AWS Fargate", "ECS", "Terraform", "Docker"],
    imageUrl: undefined,
    relatedPostSlug: "short-lived-credentials-aws-oidc-github",
  },
];
