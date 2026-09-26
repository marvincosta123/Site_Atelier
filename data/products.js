// CATÁLOGO DE PRODUTOS
// Para ADICIONAR um produto: copie um bloco { ... } e edite os campos.
// Para REMOVER um produto: apague o bloco inteiro (com a vírgula).
// Para trocar FOTOS: coloque os arquivos em /images/products/ e liste os nomes em "images".
//    Pode usar quantas quiser; a primeira da lista é a foto principal.
// "id" precisa ser único e sem espaço (usado na URL: produto.html?id=SEU-ID)

const PRODUCTS = [
  {
    id: "cardigan-aurora",
    name: "Cardigan Aurora",
    price: 399.90,
    oldPrice: null,
    category: "vestuario",
    badge: null,
    images: [
      "images/products/cardigan-aurora-1.jpg",
      "images/products/cardigan-aurora-2.jpg",
      "images/products/cardigan-aurora-3.jpg"
    ],
    description: "Cardigan em crochê de lã pastel, ponto trama fechada e caimento solto. Cada peça leva cerca de 12 horas de trabalho manual e é feita sob medida.",
    colors: ["#C9A099", "#8FA283", "#D8C3AE", "#6B5F51"],
    sizes: ["P", "M", "G", "GG"]
  },
  {
    id: "top-brisa",
    name: "Top Brisa",
    price: 149.90,
    oldPrice: null,
    category: "vestuario",
    badge: null,
    images: ["images/products/top-brisa-1.jpg", "images/products/top-brisa-2.jpg"],
    description: "Top em algodão fio fino, trançado leve, ideal para o verão. Feito sob medida.",
    colors: ["#EFE2D0", "#C9A099"],
    sizes: ["P", "M", "G"]
  },
  {
    id: "bolsa-renda",
    name: "Bolsa Renda",
    price: 189.90,
    oldPrice: null,
    category: "acessorios",
    badge: null,
    images: ["images/products/bolsa-renda-1.jpg", "images/products/bolsa-renda-2.jpg"],
    description: "Bolsa de algodão natural com ponto vazado, forro interno e alça reforçada.",
    colors: ["#EFE2D0"],
    sizes: ["Único"]
  },
  {
    id: "manta-trama",
    name: "Manta Trama",
    price: 349.90,
    oldPrice: null,
    category: "decoracao",
    badge: "Encomenda",
    images: ["images/products/manta-trama-1.jpg", "images/products/manta-trama-2.jpg"],
    description: "Manta em ponto clássico, ótima para decoração e para os dias frios. Tamanho e cor sob encomenda.",
    colors: ["#8FA283", "#6B5F51"],
    sizes: ["90x120cm", "120x150cm"]
  }
];
