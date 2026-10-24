import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

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
 * PROJECTS & ARCHITECTURAL LABS REPOSITORY
 * ==============================================================================
 * 
 * GHOST CMS / TAGGING ROUTING:
 * To feature a post in the main page Projects & Labs section from Ghost CMS:
 * - Attach tag "project-1" (or internal tag "#project-1") to send it to Position 01 (Left / Wide).
 * - Attach tag "project-2" (or internal tag "#project-2", "lab", "#lab") to send it to Position 02 (Right / Square).
 * - If you attach general tag "project", the first post lands in Slot 01 and the second lands in Slot 02.
 * 
 * Each slot automatically inherits the post's title, subtitle, picture, and tool tags.
 * ==============================================================================
 */
export const PROJECTS_AND_LABS: ProjectOrLab[] = [
  {
    slug: "project-01",
    number: "01",
    title: "Autonomous Multi-Region State Engine",
    kind: "PROJECT",
    isDraft: false,
    featured: true,
    shortDescription: "Declarative infrastructure state reconciliation and automated drift remediation across AWS.",
    technologies: ["AWS", "Terraform", "GitHub OIDC", "Docker"],
    imageUrl: "/blog/deterministic-terraform-ephemeral-environments.webp",
    relatedPostSlug: "deterministic-terraform-ephemeral-environments",
  },
  {
    slug: "project-02",
    number: "02",
    title: "Ephemeral Sandbox Mesh",
    kind: "LAB",
    isDraft: false,
    featured: true,
    shortDescription: "On-demand isolated preview environments running on AWS Fargate with verified OIDC.",
    technologies: ["AWS Fargate", "ECS", "Terraform", "Docker"],
    imageUrl: "/blog/short-lived-credentials-aws-oidc-github.webp",
    relatedPostSlug: "short-lived-credentials-aws-oidc-github",
  },
];

/**
 * Resolves the 2 live projects/labs dynamically from Ghost CMS / blog posts.
 * Supports explicit slot tags (project-1, project-2, lab) or general tag (project).
 */
export function getLiveProjectsAndLabs(posts?: BlogPost[]): [ProjectOrLab, ProjectOrLab] {
  const allPosts = posts && posts.length > 0 ? posts : BLOG_POSTS.filter((p) => p.isDraft !== true);

  const cleanTechTags = (tags?: string[]) =>
    (tags || []).filter((t) => !/^(#)?(project(s|-?[12])?|lab(s)?)$/i.test(t.trim()));

  // 1. Check for explicit slot 1: tagged 'project-1', '#project-1', 'project1'
  let p1Post = allPosts.find((p) =>
    p.tags?.some((t) => /^(#)?project-?1$/i.test(t.trim()))
  );

  // 2. Check for explicit slot 2: tagged 'project-2', '#project-2', 'project2', 'lab', '#lab'
  let p2Post = allPosts.find((p) =>
    p.tags?.some((t) => /^(#)?(project-?2|lab(s)?)$/i.test(t.trim()))
  );

  // 3. Fallback for slot 1: any post tagged 'project'
  if (!p1Post) {
    p1Post = allPosts.find(
      (p) => p !== p2Post && p.tags?.some((t) => /^(#)?project(s)?$/i.test(t.trim()))
    );
  }

  // 4. Fallback for slot 2: second post tagged 'project'
  if (!p2Post) {
    p2Post = allPosts.find(
      (p) => p !== p1Post && p.tags?.some((t) => /^(#)?(project(s)?|lab(s)?)$/i.test(t.trim()))
    );
  }

  const fallback1 = PROJECTS_AND_LABS[0];
  const fallback2 = PROJECTS_AND_LABS[1];

  const project1: ProjectOrLab = p1Post
    ? {
        slug: p1Post.slug,
        number: "01",
        title: p1Post.title,
        kind: "PROJECT",
        isDraft: false,
        featured: true,
        shortDescription: p1Post.subtitle || p1Post.excerpt || fallback1.shortDescription,
        technologies: cleanTechTags(p1Post.tags).length > 0 ? cleanTechTags(p1Post.tags) : fallback1.technologies,
        imageUrl: p1Post.featureImage || fallback1.imageUrl,
        relatedPostSlug: p1Post.slug,
      }
    : fallback1;

  const project2: ProjectOrLab = p2Post
    ? {
        slug: p2Post.slug,
        number: "02",
        title: p2Post.title,
        kind: "LAB",
        isDraft: false,
        featured: true,
        shortDescription: p2Post.subtitle || p2Post.excerpt || fallback2.shortDescription,
        technologies: cleanTechTags(p2Post.tags).length > 0 ? cleanTechTags(p2Post.tags) : fallback2.technologies,
        imageUrl: p2Post.featureImage || fallback2.imageUrl,
        relatedPostSlug: p2Post.slug,
      }
    : fallback2;

  return [project1, project2];
}
