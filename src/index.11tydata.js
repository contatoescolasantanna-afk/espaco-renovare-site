// Dados extras da página inicial: FAQ em formato estruturado para o Google
export default {
  eleventyComputed: {
    schemaExtra: (data) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (data.home?.faq?.itens || []).map((f) => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    }),
  },
};
