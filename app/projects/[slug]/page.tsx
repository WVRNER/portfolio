import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PROJECTS_AND_LABS } from "@/lib/projectsData";
import { ProjectClientWrapper } from "./ProjectClientWrapper";

export async function generateStaticParams() {
  return PROJECTS_AND_LABS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS_AND_LABS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | WVRNER",
    };
  }

  return {
    title: `${project.title} | Case Study | WVRNER`,
    description: project.shortDescription,
  };
}

async function ProjectContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS_AND_LABS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectClientWrapper project={project} />;
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#FBFBFA]" />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}
