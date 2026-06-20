// @ts-nocheck
import { driveFetch } from "./drive.ts";

// In-memory cache (per cold-start) for parent lookups
const parentsCache = new Map<string, string[]>();
const ancestorsCache = new Map<string, Set<string>>();

export async function getRootFolder(supabase: any): Promise<{ id: string; name: string } | null> {
  const { data } = await supabase.from("brand_knowledge").select("value").eq("key", "drive_root_folder").maybeSingle();
  const v = data?.value;
  if (v && v.id) return { id: v.id, name: v.name ?? "Drive scope" };
  return null;
}

export async function getArchiveFolder(supabase: any): Promise<{ id: string; name: string } | null> {
  const { data } = await supabase.from("brand_knowledge").select("value").eq("key", "drive_archive_folder").maybeSingle();
  const v = data?.value;
  if (v && v.id) return { id: v.id, name: v.name ?? "_Archív" };
  return null;
}

async function getParents(fileId: string): Promise<string[]> {
  if (parentsCache.has(fileId)) return parentsCache.get(fileId)!;
  const res = await driveFetch(`/drive/v3/files/${fileId}?fields=parents&supportsAllDrives=true`);
  if (!res.ok) return [];
  const j = await res.json();
  const parents = j.parents ?? [];
  parentsCache.set(fileId, parents);
  return parents;
}

export async function isInScope(fileId: string, rootId: string): Promise<boolean> {
  if (fileId === rootId) return true;
  if (ancestorsCache.has(fileId)) return ancestorsCache.get(fileId)!.has(rootId);
  const visited = new Set<string>();
  const queue = [fileId];
  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    if (id === rootId) {
      ancestorsCache.set(fileId, visited);
      return true;
    }
    const parents = await getParents(id);
    for (const p of parents) if (!visited.has(p)) queue.push(p);
    if (visited.size > 25) break; // safety
  }
  ancestorsCache.set(fileId, visited);
  return visited.has(rootId);
}

export async function assertInScope(supabase: any, fileIds: string[]): Promise<void> {
  const root = await getRootFolder(supabase);
  if (!root) return; // no scope set → allow (back-compat)
  for (const id of fileIds) {
    const ok = await isInScope(id, root.id);
    if (!ok) {
      throw new Response(JSON.stringify({ error: `A fájl (${id}) kívül esik a beállított Drive mappa-scope-on.` }), {
        status: 403,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }
  }
}

export async function ensureArchiveFolder(supabase: any): Promise<{ id: string; name: string }> {
  const existing = await getArchiveFolder(supabase);
  if (existing) return existing;
  const root = await getRootFolder(supabase);
  if (!root) throw new Error("Nincs beállítva Drive scope mappa.");
  // Look for existing _Archív in root
  const params = new URLSearchParams();
  params.set("q", `'${root.id}' in parents and name = '_Archív' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  params.set("fields", "files(id,name)");
  const findRes = await driveFetch(`/drive/v3/files?${params}`);
  const found = findRes.ok ? (await findRes.json()).files?.[0] : null;
  let folder = found;
  if (!folder) {
    const createRes = await driveFetch(`/drive/v3/files`, {
      method: "POST",
      body: JSON.stringify({ name: "_Archív", mimeType: "application/vnd.google-apps.folder", parents: [root.id] }),
    });
    if (!createRes.ok) throw new Error(`Archív mappa létrehozása sikertelen: ${await createRes.text()}`);
    folder = await createRes.json();
  }
  await supabase.from("brand_knowledge").upsert({ key: "drive_archive_folder", value: { id: folder.id, name: folder.name } }, { onConflict: "key" });
  return { id: folder.id, name: folder.name };
}

export async function ensureSubfolder(parentId: string, name: string): Promise<string> {
  const params = new URLSearchParams();
  params.set("q", `'${parentId}' in parents and name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  params.set("fields", "files(id,name)");
  const res = await driveFetch(`/drive/v3/files?${params}`);
  const found = res.ok ? (await res.json()).files?.[0] : null;
  if (found) return found.id;
  const createRes = await driveFetch(`/drive/v3/files`, {
    method: "POST",
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] }),
  });
  if (!createRes.ok) throw new Error(`Almappa létrehozása sikertelen: ${await createRes.text()}`);
  return (await createRes.json()).id;
}
