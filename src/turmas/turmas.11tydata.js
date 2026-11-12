export default {
  layout: "layouts/turma.njk",
  permalink: (data) => `/turmas/${data.page.fileSlug}/`,
  eleventyComputed: {
    schemaExtra: (data) => {
      const base = data.escola?.url || "";
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: base + "/" },
          { "@type": "ListItem", position: 2, name: "Turmas", item: base + "/#turmas" },
          { "@type": "ListItem", position: 3, name: data.titulo, item: base + data.page.url },
        ],
      };
    },
  },
};
