export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    // Rascunho: publicado só em /previa/..., escondido do Google e das listas
    permalink: (data) => {
      if (!String(data.page?.inputPath || "").endsWith(".md")) return data.permalink;
      return data.rascunho ? `/previa/blog/${data.page.fileSlug}/` : `/blog/${data.page.fileSlug}/`;
    },
    semIndexar: (data) => !!(data.rascunho || data.semIndexar),
    schemaExtra: (data) => {
      if (!String(data.page?.inputPath || "").endsWith(".md")) return undefined;
      const base = data.escola?.url || "";
      const artigo = {
        "@type": "BlogPosting",
        headline: data.titulo,
        description: data.seo_descricao || data.resumo,
        datePublished: data.page.date.toISOString().slice(0, 10),
        image: data.imagem ? base + data.imagem : undefined,
        mainEntityOfPage: base + data.page.url,
        author: { "@type": "Organization", name: data.escola?.nome },
        publisher: { "@id": base + "/#escola" },
      };
      const grafo = [artigo];
      if (Array.isArray(data.faq) && data.faq.length) {
        grafo.push({
          "@type": "FAQPage",
          mainEntity: data.faq.map((f) => ({
            "@type": "Question",
            name: f.pergunta,
            acceptedAnswer: { "@type": "Answer", text: f.resposta },
          })),
        });
      }
      return { "@context": "https://schema.org", "@graph": grafo };
    },
  },
};
