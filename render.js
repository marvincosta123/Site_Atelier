function money(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

// placeholder degradê enquanto não há foto real; some sozinho quando a imagem carrega
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(150deg,#E4D3BE,#B9A38F)',
  'linear-gradient(150deg,#DCC7AE,#C9A099)',
  'linear-gradient(150deg,#C9A099,#8FA283)',
  'linear-gradient(150deg,#8FA283,#DCC7AE)'
];

function imgFrame(src, i, extraClass){
  const g = PLACEHOLDER_GRADIENTS[i % PLACEHOLDER_GRADIENTS.length];
  return `<div class="img-frame ${extraClass||''}" style="background:${g}">
    <img src="${src}" alt="" onerror="this.remove()">
  </div>`;
}

function truncate(text, max){
  if(!text) return '';
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
}

// ---------- Grid da página inicial ----------
function renderProductGrid(){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML = PRODUCTS.map((p,i)=>`
    <div class="product-card">
      <div class="carousel">
        ${p.images.map((src,si)=>`
          <div class="carousel-slide ${si===0?'active':''}">${imgFrame(src, si)}</div>
        `).join('')}
        ${p.badge?`<span class="tag">${p.badge}</span>`:''}
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="card-desc">${truncate(p.description, 70)}</p>
        <p class="price">${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}${money(p.price)}</p>
        <a href="produto.html?id=${p.id}" class="btn btn-primary btn-sm">Ver peça</a>
      </div>
    </div>
  `).join('');
  startCardCarousels();
}

// troca a foto ativa de cada card a cada 3 segundos
function startCardCarousels(){
  document.querySelectorAll('.product-card .carousel').forEach(carousel=>{
    const slides = carousel.querySelectorAll('.carousel-slide');
    if(slides.length < 2) return;
    let current = 0;
    setInterval(()=>{
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 3000);
  });
}

// ---------- Página de produto ----------
function renderProductPage(){
  const wrap = document.getElementById('product-detail');
  if(!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || PRODUCTS[0].id;
  const p = PRODUCTS.find(x=>x.id===id) || PRODUCTS[0];

  document.title = `${p.name} — Jaqueline Alves Atelier`;
  document.getElementById('breadcrumb-name').textContent = p.name;
  document.getElementById('p-name').textContent = p.name;
  document.getElementById('p-desc').textContent = p.description;
  document.getElementById('p-price').textContent = money(p.price);

  document.getElementById('gallery-main').innerHTML = p.images.map((src,i)=>
    `<div class="carousel-slide ${i===0?'active':''}" data-i="${i}">${imgFrame(src,i)}</div>`
  ).join('');
  document.getElementById('gallery-thumbs').innerHTML = p.images.map((src,i)=>
    `<div class="${i===0?'active':''}" data-src="${src}" data-i="${i}">${imgFrame(src,i)}</div>`
  ).join('');
  startMainCarousel(p.images.length);

  document.getElementById('swatches').innerHTML = p.colors.map((c,i)=>
    `<div class="swatch ${i===0?'active':''}" style="background:${c}"></div>`
  ).join('');

  document.getElementById('size-options').innerHTML = p.sizes.map((s,i)=>
    `<button class="${i===0?'active':''}">${s}</button>`
  ).join('');

  // guarda o produto atual pra o cart.js usar ao "adicionar à sacola"
  window.CURRENT_PRODUCT = p;
  attachProductPageEvents();
}

let mainCarouselTimer = null;
let mainCarouselIndex = 0;

function showMainSlide(i){
  const slides = document.querySelectorAll('#gallery-main .carousel-slide');
  const thumbs = document.querySelectorAll('#gallery-thumbs > div');
  slides.forEach(s=>s.classList.remove('active'));
  thumbs.forEach(t=>t.classList.remove('active'));
  slides[i]?.classList.add('active');
  thumbs[i]?.classList.add('active');
  mainCarouselIndex = i;
}

function startMainCarousel(count){
  clearInterval(mainCarouselTimer);
  mainCarouselIndex = 0;
  if(count < 2) return;
  mainCarouselTimer = setInterval(()=>{
    showMainSlide((mainCarouselIndex + 1) % count);
  }, 3000);
}

function attachProductPageEvents(){
  const total = document.querySelectorAll('#gallery-thumbs > div').length;
  document.querySelectorAll('#gallery-thumbs > div').forEach(thumb=>{
    thumb.addEventListener('click',()=>{
      const i = Number(thumb.dataset.i);
      showMainSlide(i);
      startMainCarousel(total); // reinicia a contagem de 3s a partir da escolha manual
    });
  });
  document.querySelectorAll('#swatches .swatch').forEach(sw=>{
    sw.addEventListener('click',()=>{
      sw.parentElement.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
      sw.classList.add('active');
    });
  });
  document.querySelectorAll('#size-options button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  renderProductGrid();
  renderProductPage();
});
