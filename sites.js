/*
  ALECRIM — catálogo de fontes de receitas
  ----------------------------------------
  Este é o ÚNICO lugar onde os links ficam cadastrados.
  Formato de JSON puro dentro de uma atribuição, para funcionar também
  ao abrir o index.html direto do computador (sem servidor).

  Campos de cada site:
    id          identificador único, sem espaços (ex.: "panelinha")
    name        nome exibido
    url         endereço oficial, obrigatoriamente https://
    domain      domínio oficial (o link só é aceito se pertencer a ele)
    language    "Português (BR)", "Inglês"...
    type        tipo de conteúdo
    description descrição escrita por nós (curta e honesta)
    categories  lista de ids de categorias (veja CATEGORIES abaixo)
    keywords    palavras extras para a pesquisa
    featured    true = aparece em "Fontes para começar" na página inicial
    status      "pending" (revisão pendente) ou "reviewed" (revisado)
    lastReview  data da última revisão manual, "AAAA-MM-DD", ou null
    note        observação opcional (aparece no cartão)

  REGRA: só troque status para "reviewed" e preencha lastReview depois de
  abrir o link e conferir o site de verdade (veja o README).
*/
window.RECEITAS_DATA = {
  "categories": [
    { "id": "bolos", "name": "Bolos e tortas", "hint": "Do bolo de domingo à torta de festa" },
    { "id": "doces", "name": "Doces e sobremesas", "hint": "Para fechar a refeição" },
    { "id": "massas", "name": "Massas", "hint": "Macarrão, lasanha, nhoque" },
    { "id": "almoco-jantar", "name": "Almoço e jantar", "hint": "Pratos principais e acompanhamentos" },
    { "id": "cafe-manha", "name": "Café da manhã", "hint": "Pães, panquecas, mesa posta" },
    { "id": "lanches", "name": "Lanches", "hint": "Salgados e petiscos" },
    { "id": "rapidas", "name": "Receitas rápidas", "hint": "Para os dias corridos" },
    { "id": "economicas", "name": "Receitas econômicas", "hint": "Bom, bonito e barato" },
    { "id": "brasileira", "name": "Comida brasileira", "hint": "Sabores de casa" },
    { "id": "vegetarianas", "name": "Receitas vegetarianas", "hint": "Sem carne, com sabor" },
    { "id": "ocasioes", "name": "Ocasiões especiais", "hint": "Datas, festas e visitas" },
    { "id": "a-dois", "name": "Para preparar a dois", "hint": "Jantares e receitas para fazer juntos" }
  ],
  "sites": [
    {
      "id": "panelinha",
      "name": "Panelinha",
      "url": "https://www.panelinha.com.br/",
      "domain": "panelinha.com.br",
      "language": "Português (BR)",
      "type": "Receitas, técnicas e dicas de cozinha",
      "description": "Site da chef Rita Lobo, no ar desde 2000. Receitas pensadas para o dia a dia, com explicações de técnica que ajudam a cozinhar com mais segurança.",
      "categories": ["almoco-jantar", "rapidas", "economicas", "vegetarianas", "brasileira", "cafe-manha"],
      "keywords": ["rita lobo", "dia a dia", "marmita", "tecnicas", "iniciante"],
      "featured": true,
      "status": "pending",
      "lastReview": null,
      "note": "Parte do conteúdo pode exigir cadastro ou assinatura."
    },
    {
      "id": "tudogostoso",
      "name": "TudoGostoso",
      "url": "https://www.tudogostoso.com.br/",
      "domain": "tudogostoso.com.br",
      "language": "Português (BR)",
      "type": "Grande acervo de receitas enviadas por leitores",
      "description": "Um dos maiores acervos de receitas em português. Como muitas receitas vêm de leitores, vale conferir as avaliações e os comentários antes de preparar.",
      "categories": ["bolos", "doces", "massas", "lanches", "brasileira", "economicas", "rapidas"],
      "keywords": ["bolo", "pudim", "salgados", "tradicional", "comunidade"],
      "featured": true,
      "status": "pending",
      "lastReview": null,
      "note": "O site exibe anúncios; fique atenta a botões que não pertençam à receita."
    },
    {
      "id": "receitas-globo",
      "name": "Receitas Globo",
      "url": "https://receitas.globo.com/",
      "domain": "receitas.globo.com",
      "language": "Português (BR)",
      "type": "Portal de gastronomia da Globo",
      "description": "Portal com receitas dos programas da emissora, guias por data comemorativa e vídeos passo a passo.",
      "categories": ["ocasioes", "doces", "bolos", "almoco-jantar", "brasileira", "lanches"],
      "keywords": ["datas comemorativas", "natal", "pascoa", "mais voce", "videos"],
      "featured": true,
      "status": "pending",
      "lastReview": null,
      "note": ""
    },
    {
      "id": "bbc-good-food",
      "name": "BBC Good Food",
      "url": "https://www.bbcgoodfood.com/",
      "domain": "bbcgoodfood.com",
      "language": "Inglês",
      "type": "Revista culinária britânica com receitas testadas",
      "description": "Receitas bem organizadas por tempo de preparo e dieta, com fotos e passo a passo. Ótima para jantares a dois e opções vegetarianas.",
      "categories": ["almoco-jantar", "vegetarianas", "rapidas", "ocasioes", "a-dois", "doces"],
      "keywords": ["inglês", "english", "dinner", "vegetarian", "date night", "quick"],
      "featured": true,
      "status": "pending",
      "lastReview": null,
      "note": "Em inglês; medidas costumam estar em gramas e xícaras britânicas, converta com cuidado."
    },
    {
      "id": "receitas-nestle",
      "name": "Receitas Nestlé",
      "url": "https://www.receitasnestle.com.br/",
      "domain": "receitasnestle.com.br",
      "language": "Português (BR)",
      "type": "Site de uma marca de alimentos",
      "description": "Receitas publicadas por uma fabricante, muito usadas para sobremesas com leite condensado, creme de leite e chocolate.",
      "categories": ["doces", "bolos", "lanches", "economicas"],
      "keywords": ["leite condensado", "brigadeiro", "sobremesa", "chocolate"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": "Site de marca: as receitas normalmente usam produtos da própria empresa."
    },
    {
      "id": "cybercook",
      "name": "CyberCook",
      "url": "https://cybercook.com.br/",
      "domain": "cybercook.com.br",
      "language": "Português (BR)",
      "type": "Acervo de receitas e vídeos",
      "description": "Portal brasileiro com receitas do cotidiano, de pratos de panela a sobremesas, com busca por ingrediente.",
      "categories": ["brasileira", "almoco-jantar", "rapidas", "lanches", "doces"],
      "keywords": ["ingrediente", "panela", "caseiro"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": ""
    },
    {
      "id": "serious-eats",
      "name": "Serious Eats",
      "url": "https://www.seriouseats.com/",
      "domain": "seriouseats.com",
      "language": "Inglês",
      "type": "Receitas com testes e explicações científicas",
      "description": "Receitas testadas várias vezes, com explicação do porquê de cada passo. Boa para quem gosta de entender a técnica por trás do prato.",
      "categories": ["massas", "almoco-jantar", "ocasioes", "a-dois"],
      "keywords": ["technique", "pasta", "testado", "ciência", "english"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": "Em inglês."
    },
    {
      "id": "king-arthur-baking",
      "name": "King Arthur Baking",
      "url": "https://www.kingarthurbaking.com/",
      "domain": "kingarthurbaking.com",
      "language": "Inglês",
      "type": "Receitas e guias de panificação e confeitaria",
      "description": "Foco em pães, bolos, biscoitos e tortas, com guias detalhados e dicas para resolver problemas de massa.",
      "categories": ["bolos", "doces", "cafe-manha", "ocasioes"],
      "keywords": ["pão", "bread", "baking", "biscoitos", "cookies", "english"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": "Em inglês; o site também vende produtos."
    },
    {
      "id": "minimalist-baker",
      "name": "Minimalist Baker",
      "url": "https://minimalistbaker.com/",
      "domain": "minimalistbaker.com",
      "language": "Inglês",
      "type": "Blog de receitas simples, em geral vegetarianas e veganas",
      "description": "Receitas com poucos ingredientes e preparo curto, muitas sem carne. Útil para dias leves e para quem quer variar.",
      "categories": ["vegetarianas", "rapidas", "almoco-jantar", "doces"],
      "keywords": ["vegano", "vegan", "simples", "poucos ingredientes", "english"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": "Em inglês."
    },
    {
      "id": "smitten-kitchen",
      "name": "Smitten Kitchen",
      "url": "https://smittenkitchen.com/",
      "domain": "smittenkitchen.com",
      "language": "Inglês",
      "type": "Blog de culinária caseira",
      "description": "Blog de cozinha caseira com receitas cuidadosas e texto pessoal. Boa fonte para jantares tranquilos e sobremesas para dividir.",
      "categories": ["a-dois", "ocasioes", "doces", "almoco-jantar"],
      "keywords": ["blog", "jantar", "dividir", "english"],
      "featured": false,
      "status": "pending",
      "lastReview": null,
      "note": "Em inglês."
    }
  ]
};
