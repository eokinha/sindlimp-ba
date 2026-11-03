// Extrai conteúdo do WordPress de sindilimpba.org.br para content/ e public/wp-content/uploads/.
// Uso: node scripts/extract-content.mjs   (Node 24, só stdlib)
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://sindilimpba.org.br";
const API = `${ORIGIN}/wp-json/wp/v2`;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const PUBLIC = join(ROOT, "public");
const DELAY = 250;
const UA = { "User-Agent": "curl/8.9.1" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
const downloaded = new Set();
let downloadCount = 0;

async function getJson(url) {
  await sleep(DELAY);
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return { data: await res.json(), totalPages: Number(res.headers.get("x-wp-totalpages") || 1) };
}

async function getAll(endpoint, params = "") {
  const out = [];
  for (let page = 1; ; page++) {
    const { data, totalPages } = await getJson(`${API}/${endpoint}?per_page=100&page=${page}${params}`);
    out.push(...data);
    if (page >= totalPages) break;
  }
  return out;
}

// Normaliza URL absoluta/relativa de upload do próprio site -> caminho local /wp-content/uploads/...
const UPLOAD_RE = /(?:https?:)?(?:\\?\/\\?\/)(?:www\.)?sindilimpba\.org\.br(\\?\/wp-content\\?\/uploads\\?\/[^"'\s)<>?#]+)/gi;

async function download(path) {
  const clean = decodeURIComponent(path.replace(/\\\//g, "/"));
  if (downloaded.has(clean)) return;
  downloaded.add(clean);
  const dest = join(PUBLIC, ...clean.split("/").filter(Boolean));
  try {
    await access(dest);
    return; // já existe
  } catch {}
  try {
    await sleep(DELAY);
    const res = await fetch(ORIGIN + encodeURI(clean), { headers: UA });
    if (!res.ok) throw new Error(String(res.status));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloadCount++;
  } catch (e) {
    failures.push(`${clean}: ${e.message}`);
  }
}

async function rewriteHtml(html) {
  if (!html) return html;
  const paths = new Set();
  html = html.replace(UPLOAD_RE, (_, p) => {
    const local = p.replace(/\\\//g, "/");
    paths.add(local);
    return local;
  });
  // srcset/src podem trazer variações redimensionadas; todas entram em paths acima.
  for (const p of paths) await download(p);
  // Links internos restantes -> relativos à raiz
  html = html.replace(/(href|src|action)=(["'])(?:https?:)?\/\/(?:www\.)?sindilimpba\.org\.br(\/[^"']*)?\2/gi,
    (_, attr, q, p) => `${attr}=${q}${p || "/"}${q}`);
  return html;
}

const text = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function featured(item) {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return null;
  const m = media.source_url.match(/\/wp-content\/uploads\/[^?#]+/);
  if (!m) return null;
  await download(m[0]);
  return { src: decodeURIComponent(m[0]), alt: media.alt_text || "", width: media.media_details?.width ?? null, height: media.media_details?.height ?? null };
}

async function mapItem(item, catById, isPage) {
  const out = {
    id: item.id,
    slug: item.slug,
    title: text(item.title?.rendered),
    date: item.date,
    modified: item.modified,
    link: new URL(item.link).pathname,
    excerpt: text(item.excerpt?.rendered),
    contentHtml: await rewriteHtml(item.content?.rendered || ""),
    featuredImage: await featured(item),
  };
  if (isPage) {
    out.parent = item.parent || 0;
    out.menuOrder = item.menu_order;
    out.template = item.template || "";
  } else {
    out.categories = (item.categories || []).map((id) => catById.get(id)).filter(Boolean);
  }
  return out;
}

async function menuFromHome() {
  await sleep(DELAY);
  const html = await (await fetch(ORIGIN + "/", { headers: UA })).text();
  const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] || html;
  const nav = header.match(/<ul[^>]*(?:menu)[^>]*>[\s\S]*?<\/ul>\s*<\/nav>/i)?.[0] || header;
  // Parser simples por profundidade de <ul>
  const items = [];
  const stack = [items];
  let last = null;
  const tokRe = /<ul\b[^>]*>|<\/ul>|<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let m, depth = 0;
  for (; (m = tokRe.exec(nav)); ) {
    const t = m[0].toLowerCase();
    if (t.startsWith("<ul")) {
      depth++;
      if (depth > 1 && last) { last.children = last.children || []; stack.push(last.children); }
    } else if (t.startsWith("</ul")) {
      if (depth > 1) stack.pop();
      depth--;
    } else {
      const label = text(m[3]);
      if (!label) continue;
      let href = m[2].replace(/^(?:https?:)?\/\/(?:www\.)?sindilimpba\.org\.br/i, "") || "/";
      last = { label, href };
      stack[stack.length - 1].push(last);
    }
  }
  return { source: "home-header", items };
}

async function main() {
  await mkdir(CONTENT, { recursive: true });

  const cats = await getAll("categories");
  const categories = cats.map((c) => ({ id: c.id, slug: c.slug, name: text(c.name), count: c.count, parent: c.parent }));
  const catById = new Map(categories.map((c) => [c.id, c.slug]));

  const posts = [];
  for (const p of await getAll("posts", "&_embed")) posts.push(await mapItem(p, catById, false));
  const pages = [];
  for (const p of await getAll("pages", "&_embed")) pages.push(await mapItem(p, catById, true));

  let menu;
  try {
    const { data } = await getJson(`${API}/menu-items?per_page=100`);
    menu = { source: "api", items: data };
  } catch {
    menu = await menuFromHome();
  }

  const w = (f, d) => writeFile(join(CONTENT, f), JSON.stringify(d, null, 2) + "\n");
  await w("posts.json", posts);
  await w("pages.json", pages);
  await w("categories.json", categories);
  await w("menu.json", menu);

  console.log(`posts=${posts.length} pages=${pages.length} categories=${categories.length} menuItems=${menu.items.length} (${menu.source})`);
  console.log(`uploads referenciados=${downloaded.size} baixados agora=${downloadCount} falhas=${failures.length}`);
  for (const f of failures) console.log("  FALHA", f);
}

main().catch((e) => { console.error(e); process.exit(1); });
