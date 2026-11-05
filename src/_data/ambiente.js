// SITE_PREVIEW=1 → versão de pré-visualização (escondida do Google)
// EM_CONSTRUCAO=1 → gera também a página "Em construção" (usada no domínio oficial)
export default {
  preview: process.env.SITE_PREVIEW === "1",
  emConstrucao: process.env.EM_CONSTRUCAO === "1",
};
