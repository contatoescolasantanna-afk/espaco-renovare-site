// Páginas extras criadas pela escola no painel (menu "Páginas extras").
// Endereço: espacorenovareinfantil.com.br/<nome-da-pagina>/
// Rascunho: espacorenovareinfantil.com.br/previa/<nome-da-pagina>/ (só a escola vê)

// Nomes que já são usados pelo site. Se a escola criar uma página com um deles,
// ela vai para /paginas/<nome>/ em vez de quebrar a atualização do site.
const RESERVADOS = new Set([
  "blog", "turmas", "quem-somos", "agendar-visita", "obrigado", "politica-de-privacidade",
  "regiao-atendida", "em-construcao", "previa", "paginas", "images", "img", "fonts", "js",
  "videos", "admin", "404",
]);

export default {
  layout: "layouts/pagina.njk",
  eleventyComputed: {
    permalink: (data) => {
      const slug = data.page.fileSlug;
      if (data.rascunho) return `/previa/${slug}/`;
      return RESERVADOS.has(slug) ? `/paginas/${slug}/` : `/${slug}/`;
    },
    semIndexar: (data) => !!(data.rascunho || data.semIndexar),
  },
};
