// ======= CONFIGURAÇÃO =======
// Troque pelo endereço do feed do seu Substack (é sempre /feed no final):
const SUBSTACK_FEED_URL = "https://atelierdajaque.substack.com/feed";

// Opcional: crie uma chave grátis em https://rss2json.com/ pra ter um limite
// maior de requisições por dia (o serviço funciona sem chave também, com limite menor).
const RSS2JSON_API_KEY = ""; // ex: "abcd1234..."

function stripHtml(html){
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || div.innerText || '';
}
function truncateText(text, max){
  text = text.trim();
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
}
function formatPostDate(d){
  return new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
}
function firstImageFrom(item){
  if(item.thumbnail) return item.thumbnail;
  const match = (item.description || '').match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function loadSubstackPosts(){
  if(SUBSTACK_FEED_URL.includes('SEUBLOG')){
    console.warn('Configure SUBSTACK_FEED_URL em substack.js com o endereço real do seu Substack.');
    return; // mantém os posts de exemplo que já estão no HTML
  }
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED_URL)}${RSS2JSON_API_KEY ? '&api_key='+RSS2JSON_API_KEY : ''}`;
  try{
    const res = await fetch(endpoint);
    const data = await res.json();
    if(data.status !== 'ok' || !data.items || !data.items.length) return;
    renderFeatured(data.items[0]);
    renderGrid(data.items.slice(1, 4));
  }catch(err){
    console.warn('Não foi possível carregar os posts do Substack agora:', err);
    // a página continua funcionando com os posts de exemplo do HTML
  }
}

function renderFeatured(item){
  const img = document.getElementById('bf-img');
  const thumb = firstImageFrom(item);
  if(img && thumb) img.style.background = `url('${thumb}') center/cover`;
  document.getElementById('bf-tag').textContent = 'Substack · ' + formatPostDate(item.pubDate);
  document.getElementById('bf-title').textContent = item.title;
  document.getElementById('bf-desc').textContent = truncateText(stripHtml(item.description), 170);
  const link = document.getElementById('bf-link');
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Ler no Substack';
}

function renderGrid(items){
  const grid = document.getElementById('blog-grid');
  if(!grid || !items.length) return;
  grid.innerHTML = items.map(item=>{
    const thumb = firstImageFrom(item);
    return `
      <article class="blog-card">
        <div class="img" ${thumb?`style="background:url('${thumb}') center/cover"`:''}></div>
        <div class="body">
          <p class="meta">Substack · ${formatPostDate(item.pubDate)}</p>
          <h3>${item.title}</h3>
          <p>${truncateText(stripHtml(item.description), 95)}</p>
          <a href="${item.link}" target="_blank" rel="noopener" class="link">Ler no Substack</a>
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', loadSubstackPosts);
