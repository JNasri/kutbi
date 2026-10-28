export function createJournalSlug(title: string): string {
  const slug = title.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 180)
    .replace(/^-+|-+$/g, '');

  return slug.length === 1 ? `journal-${slug}` : slug;
}
