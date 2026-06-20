// Helpers to format AI image analysis into shareable formats

export type ImageAnalysis = {
  ai_description?: string | null;
  ai_mood?: string | null;
  ai_tags?: string[] | null;
  ai_dominant_colors?: string[] | null;
  ai_suggested_alt?: string | null;
  ai_suggested_caption?: string | null;
  ai_use_cases?: string[] | null;
  ai_suggested_copy?: {
    instagram?: string;
    facebook?: string;
    landing_headline?: string;
  } | null;
};

export type DocLike = {
  id: string;
  title?: string | null;
  folder?: string | null;
  storage_path?: string | null;
};

export function analysisToMarkdown(doc: DocLike, a: ImageAnalysis, imageUrl?: string | null): string {
  const lines: string[] = [];
  lines.push(`# ${doc.title ?? "Képelemzés"}`);
  if (doc.folder) lines.push(`*Mappa: ${doc.folder}*`);
  if (imageUrl) lines.push(`\n![${doc.title ?? "kép"}](${imageUrl})\n`);

  if (a.ai_description) {
    lines.push(`## Leírás`);
    lines.push(a.ai_description);
  }
  if (a.ai_mood) {
    lines.push(`\n**Hangulat:** ${a.ai_mood}`);
  }
  if (a.ai_tags?.length) {
    lines.push(`\n**Címkék:** ${a.ai_tags.map((t) => `#${t}`).join(" ")}`);
  }
  if (a.ai_dominant_colors?.length) {
    lines.push(`\n**Domináns színek:** ${a.ai_dominant_colors.join(", ")}`);
  }
  if (a.ai_suggested_alt) {
    lines.push(`\n## SEO alt szöveg\n${a.ai_suggested_alt}`);
  }
  if (a.ai_suggested_caption) {
    lines.push(`\n## Caption\n${a.ai_suggested_caption}`);
  }
  if (a.ai_use_cases?.length) {
    lines.push(`\n## Felhasználási ötletek`);
    a.ai_use_cases.forEach((u) => lines.push(`- ${u}`));
  }
  const c = a.ai_suggested_copy;
  if (c?.instagram || c?.facebook || c?.landing_headline) {
    lines.push(`\n## Copy javaslatok`);
    if (c.landing_headline) lines.push(`\n**Landing headline:** ${c.landing_headline}`);
    if (c.instagram) lines.push(`\n**Instagram:**\n${c.instagram}`);
    if (c.facebook) lines.push(`\n**Facebook:**\n${c.facebook}`);
  }
  return lines.join("\n");
}

export function analysisToChatContext(doc: DocLike, a: ImageAnalysis): string {
  return `[Csatolt kép: "${doc.title}"]\n\n${analysisToMarkdown(doc, a)}\n\n---\nKérlek dolgozz ezzel a képpel és elemzéssel. `;
}
