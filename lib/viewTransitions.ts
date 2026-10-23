/**
 * View Transitions API - Safe Identifiers Helper
 *
 * Generates valid CSS <custom-ident> values for elements participating
 * in card-to-article fluid morph transitions.
 */
export function getPostTransitionName(type: "title" | "cover", slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `post-${type}-${safeSlug}`;
}
