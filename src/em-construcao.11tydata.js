// Só gera a página "Em construção" quando EM_CONSTRUCAO=1 (ver .github/workflows/publicar.yml)
export default {
  permalink: (data) => (data.ambiente?.emConstrucao ? "/em-construcao/index.html" : false),
};
