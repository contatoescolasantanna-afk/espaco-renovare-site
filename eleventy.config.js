import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Dados editáveis pelo painel ficam em YAML (src/_data/*.yml)
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Arquivos copiados sem processamento
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/videos");
  eleventyConfig.addPassthroughCopy("src/js");

  // Todas as <img> do site viram AVIF/WebP responsivos automaticamente
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 640, 800, 1200, 1600],
    urlPath: "/img/",
    // grava dentro da pasta de saída usada no build (padrão: _site/img)
    outputDir: path.join(eleventyConfig.directories.output, "img"),
    failOnError: false,
    sharpAvifOptions: { quality: 45 },
    sharpWebpOptions: { quality: 70 },
    sharpJpegOptions: { quality: 76, mozjpeg: true },
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 1100px) 560px, 92vw",
      },
      pictureAttributes: {},
    },
  });

  // ---------- Filtros ----------
  // Ponto de foco de cada foto (rosto centralizado, sem cortar). Ver src/_data/focos.json.
  // Uso: <img src="{{ x }}"{{ x | foco | safe }}>  ou  {{ x | foco(manual) | safe }}
  // No painel a escola escolhe "rosto no alto", "centro" ou "parte de baixo".
  const FOCOS_PAINEL = { "rosto no alto": "50% 0%", alto: "50% 0%", centro: "50% 50%", "parte de baixo": "50% 100%", baixo: "50% 100%", automatico: "" };
  eleventyConfig.addFilter("foco", (src, manual) => {
    const chave = String(manual || "").trim().toLowerCase();
    let pos = chave in FOCOS_PAINEL ? FOCOS_PAINEL[chave] : manual;
    if (!pos && src) {
      try {
        const mapa = JSON.parse(fs.readFileSync("src/_data/focos.json", "utf8"));
        pos = mapa[String(src).split("/").pop()];
      } catch (e) { /* sem mapa: usa o padrão do CSS */ }
    }
    return pos ? ` style="object-position:${pos}"` : "";
  });

  eleventyConfig.addFilter("digits", (v) => String(v || "").replace(/\D/g, ""));

  eleventyConfig.addFilter("whatsLink", (numero, mensagem) => {
    const n = String(numero || "").replace(/\D/g, "");
    const t = mensagem ? `?text=${encodeURIComponent(mensagem)}` : "";
    return `https://wa.me/${n}${t}`;
  });

  eleventyConfig.addFilter("dataBR", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.addFilter("isoDate", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("anosDesde", (ano) => new Date().getFullYear() - Number(ano));

  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  eleventyConfig.addFilter("anoAtual", () => new Date().getFullYear());

  // Tempo de leitura (200 palavras/min)
  eleventyConfig.addFilter("minutosLeitura", (html) => {
    const palavras = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.round(palavras / 200));
  });

  // Artigos relacionados: mesmo tema primeiro, depois os mais recentes
  eleventyConfig.addFilter("relacionados", (posts, atual, n = 3) => {
    const outros = (posts || []).filter((p) => p.url !== atual.url);
    const mesmo = outros.filter((p) => p.data.tema && p.data.tema === atual.data?.tema);
    const resto = outros.filter((p) => !mesmo.includes(p));
    return [...mesmo, ...resto].slice(0, n);
  });

  eleventyConfig.addFilter("turmasPorSlug", (turmas, slugs) =>
    (turmas || []).filter((t) => (slugs || []).includes(t.page.fileSlug))
  );

  // Artigos ligados a uma turma (campo "turmas" do artigo)
  eleventyConfig.addFilter("postsDaTurma", (posts, slug, n = 3) =>
    (posts || []).filter((p) => (p.data.turmas || []).includes(slug)).slice(0, n)
  );

  // Texto do painel -> parágrafos HTML (linha em branco separa parágrafos; *itálico* e **negrito**)
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  eleventyConfig.addFilter("paras", (texto) => {
    if (!texto) return "";
    return String(texto)
      .split(/\n\s*\n/)
      .map((p) => esc(p.trim()).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>"))
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("");
  });

  // ---------- Coleções ----------
  eleventyConfig.addCollection("turmas", (api) =>
    api.getFilteredByGlob("src/turmas/*.md").sort((a, b) => (a.data.ordem || 0) - (b.data.ordem || 0))
  );
  // Páginas extras criadas pela escola no painel (src/paginas)
  eleventyConfig.addCollection("paginas", (api) =>
    api
      .getFilteredByGlob("src/paginas/*.md")
      .filter((p) => !p.data.rascunho)
      .sort((a, b) => (a.data.ordem || 0) - (b.data.ordem || 0) || String(a.data.titulo).localeCompare(String(b.data.titulo)))
  );
  // Rascunhos (blog e páginas extras) ficam visíveis só em /previa/, sem Google
  eleventyConfig.addCollection("rascunhos", (api) =>
    api.getAll().filter((p) => p.data.rascunho && p.url).sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("blog", (api) =>
    api
      .getFilteredByGlob("src/blog/*.md")
      .filter((p) => !p.data.rascunho)
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
