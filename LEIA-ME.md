# Site do Espaço Renovare

Site estático, rápido e otimizado para o Google, com **painel de edição** para a própria escola mudar textos e fotos.

| | |
|---|---|
| **Tecnologia** | [Eleventy 3](https://www.11ty.dev/) (gera HTML puro) + otimização automática de fotos (AVIF/WebP) |
| **Painel de edição** | [Pages CMS](https://pagescms.org): gratuito, configurado em `.pages.yml` |
| **Hospedagem** | GitHub Pages: gratuita, com HTTPS, publica sozinha a cada alteração |
| **Domínio** | `espacorenovareinfantil.com.br`, registrado no Registro.br em nome da escola |

---

## 1. Rodar no computador

```bash
npm install
npm run dev        # abre em http://localhost:8484
npm run build      # gera a pasta _site/ pronta para publicar
```

## 2. Como está publicado (situação em 12/11/2026)

- **Repositório:** `contatoescolasantanna-afk/espaco-renovare-site` (conta GitHub da escola, e-mail contato.escolasantanna@gmail.com), branch `main`.
- **Publicação:** `.github/workflows/publicar.yml` gera o site e publica no GitHub Pages a cada push na `main` (1 a 2 minutos). Settings → Pages: Source = GitHub Actions, domínio próprio e Enforce HTTPS ligados.
- **DNS no Registro.br:** 4 registros A (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153), CNAME `www` → `contatoescolasantanna-afk.github.io` e TXT `google-site-verification` (não remover: é a verificação do Search Console).
- **Painel:** app do Pages CMS instalado só neste repositório, na conta da escola. A escola entra em app.pagescms.org com "Sign in with GitHub". Guia para a escola: [`COMO-EDITAR.md`](COMO-EDITAR.md).
- **Rascunhos:** blog e páginas extras com `rascunho: true` saem em `/previa/...`, com noindex e fora do sitemap e das listas.
- **Prévia de testes:** o repositório `marysf31-lab/marysf31-lab.github.io` (remoto `previa`) é uma cópia antiga de testes, fora do site oficial.
- **Para dar acesso a outro profissional:** Settings → Collaborators no GitHub. Documento completo de entrega e acessos no Google Drive da Mary ("Site do Espaço Renovare: entrega, acessos e manual").

## 3. Receber e contar os pedidos de visita

- **Padrão (já funciona):** o formulário monta a mensagem e abre o **WhatsApp da escola** já preenchido.
- **Recomendado:** instale a planilha de leads (`docs/planilha-de-visitas.gs`). Cada pedido vira uma linha no Google Sheets + e-mail para a escola, com a origem do contato (Instagram, Google, indicação…). É assim que a escola passa a saber **quantos contatos o site gera por mês**.
- **Métricas:** cole o ID do Google Analytics 4 e/ou do Meta Pixel em *Configurações gerais*. O site já dispara os eventos `generate_lead` (formulário), `contact` (cliques no WhatsApp/telefone) e `Lead`/`Contact` no Pixel.

## 4. Checklist antes de colocar no ar (confirmar com a escola)

- [ ] **Autorização de uso de imagem** das crianças que aparecem nas fotos (LGPD/ECA).
- [ ] Horário de funcionamento **7h às 18h30** (deduzido do quadro de pessoal do PPP).
- [ ] Faixas etárias: Berçário a partir de **4 meses**, Maternal **2 e 3 anos**, Pré **4 e 5 anos** — onde ficam as crianças de **1 a 2 anos**?
- [ ] Alimentação: a escola fornece as refeições? Se sim, vale um bloco/FAQ (é uma das dúvidas mais comuns).
- [ ] Aulas extras: estão inclusas na mensalidade ou são à parte? (ajustar o FAQ)
- [ ] Nota no Google (hoje **5,0 com 6 avaliações**) — atualizar no painel quando mudar.
- [ ] Como é a visita (dias, horários, duração) → campo *Agendar visita → Dias e duração*.
- [ ] Depoimentos: a página inicial já mostra 4 **avaliações reais do Google** (nome abreviado, texto original com acentuação corrigida). Avisar as famílias e, se possível, somar depoimentos do destaque "FEEDBACK" do Instagram (com autorização).
- [ ] Fotos novas (a escola comentou que vai refazer): ballet, cross kids, música, inglês, horta/pomar, equipe e direção.

## 5. Estrutura

```
.pages.yml                 ← configuração do painel de edição
src/_data/escola.yml       ← contatos, endereço, horário, integrações
src/_data/home.yml         ← todos os textos/fotos da página inicial
src/_data/rotina.yml       ← "Um dia no Renovare" (aparece nas páginas das turmas)
src/_data/regiao.yml       ← bairros e tempos de carro da página /regiao-atendida/
src/turmas/*.md            ← uma página por turma (Berçário, Maternal, Pré)
src/blog/*.md              ← artigos do blog
src/images/uploads/        ← fotos (o painel salva aqui)
src/_includes/             ← layout, CSS e componentes
docs/planilha-de-visitas.gs← planilha de pedidos de visita (Google Apps Script)
```

## 6. Depois de publicar (SEO local — impacto alto, custo zero)

1. **Perfil da Empresa no Google:** cadastrar o site (hoje a ficha está **sem site**), adicionar as categorias *Pré-escola* e *Escola de educação infantil* além de *Creche*, horário, fotos novas e o link de agendamento.
2. **Campanha de avaliações:** pedir avaliação às famílias atuais (meta: 50+). Entre as concorrentes que exibem estrelas, a mais avaliada tem 48.
3. **Google Search Console:** verificar o domínio e enviar `https://espacorenovareinfantil.com.br/sitemap.xml`.
4. **Link da bio do Instagram:** `https://espacorenovareinfantil.com.br/agendar-visita/` (página enxuta, feita para converter).
5. **Agenda online:** criar uma "Página de agendamento" no Google Agenda da escola e colar o link em *Configurações gerais → Agenda de visitas online*. Nenhuma escola infantil da região oferece isso.
6. **Trocar as fotos do Google Meu Negócio** pelas versões tratadas da pasta `../fotos-melhoradas-google/` (resolução aumentada com IA, luz, cor e nitidez corrigidas). No Perfil da Empresa: *Fotos → Adicionar* e depois apagar as antigas. Comece pela **01-fachada**, que ajuda os pais a reconhecer a escola na chegada.

## 7. Como as fotos dos espaços foram tratadas

1. **Super-resolução com IA** (Real-ESRGAN `realesr-general-x4v3`): amplia 4× e reduz para 2400 px. As bordas ficam mais nítidas e some a compressão do WhatsApp/Google.
2. **Correção automática:** balanço de branco medido só nas áreas neutras (paredes/piso, para não ser enganado pela grama), níveis, exposição, contraste local (CLAHE), vibração de cor, proteção das altas luzes e nitidez suave. Fotos tortas foram endireitadas.
3. **Recorte 3:2** com ponto focal para os cards do site.
4. **Sem pesar o site:** o Eleventy gera cada foto em 480/800/1200/1600 px (AVIF/WebP) e o celular baixa só o tamanho de que precisa.

Quando a escola enviar fotos novas, basta subir pelo painel: o site já otimiza o tamanho sozinho. Se quiser o mesmo tratamento de cor/resolução, peça para a Mary passar as fotos pelo mesmo processo.

## 8. SEO e conteúdo

- **Estratégia completa e personas:** `../pesquisa/Estrategia-SEO-e-Personas.md` (mapa de palavras-chave, arquitetura, calendário de artigos, SEO local, KPIs e plano de 90 dias).
- **Blog:** cada artigo tem *tema* e *turmas relacionadas*. Ele aparece sozinho na página da turma ("Para ler com calma") e nos blocos "Leia também". Perguntas rápidas no fim do artigo viram dados estruturados de FAQ para o Google.
- **Regra para não competir consigo mesmo:** cada busca principal tem uma página dona (veja o mapa no documento de estratégia). Artigos novos sempre linkam para a turma certa e para "Agendar visita".
- **Velocidade:** seções abaixo da primeira tela usam `content-visibility` (exceto as de fundo escuro, para não atrapalhar o teste de contraste). Mobile 95–99 e desktop 100 no Lighthouse.
