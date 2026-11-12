// Páginas extras criadas pela escola no painel (menu "📄 Páginas extras").
// Endereço: espacorenovareinfantil.com.br/<nome-do-arquivo>/
export default {
  layout: "layouts/pagina.njk",
  eleventyComputed: {
    permalink: (data) => (data.rascunho ? false : `/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => !!data.rascunho,
  },
};
