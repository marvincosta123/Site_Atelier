// ======= CONFIGURAÇÃO =======
// Troque pelo número real do WhatsApp do ateliê, com DDI+DDD, só números:
const WHATSAPP_NUMBER = "5511999999999";

const SHIPPING_OPTIONS = [
  { id: "retirada", label: "Retirar no ateliê — grátis", price: 0 },
  { id: "local", label: "Entrega local combinada — R$ 15,00", price: 15 },
  { id: "correios", label: "Correios (todo o Brasil) — valor a combinar", price: null }
];

// ======= ESTADO (localStorage) =======
function getCart(){
  try{ return JSON.parse(localStorage.getItem('atelier-cart')) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem('atelier-cart', JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(item){
  const cart = getCart();
  // mesmo produto + cor + tamanho soma quantidade em vez de duplicar linha
  const existing = cart.find(i=>i.id===item.id && i.color===item.color && i.size===item.size);
  if(existing){ existing.qty += item.qty; }
  else{ cart.push(item); }
  saveCart(cart);
  openCartPanel();
}
function removeFromCart(index){
  const cart = getCart();
  cart.splice(index,1);
  saveCart(cart);
  renderCartPanel();
}
function setQty(index, qty){
  const cart = getCart();
  if(qty<1) return;
  cart[index].qty = qty;
  saveCart(cart);
  renderCartPanel();
}
function cartTotal(){
  return getCart().reduce((sum,i)=>sum + i.price*i.qty, 0);
}
function updateCartBadge(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count);
}

// ======= PAINEL DO CARRINHO =======
function buildCartPanel(){
  if(document.getElementById('cart-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'cart-panel';
  panel.innerHTML = `
    <div class="cart-overlay" id="cart-overlay"></div>
    <aside class="cart-drawer" id="cart-drawer">
      <div class="cart-head">
        <h3>Sua sacola</h3>
        <button id="cart-close" aria-label="Fechar">✕</button>
      </div>
      <div id="cart-items"></div>
      <div class="cart-shipping">
        <label class="name">Entrega</label>
        <select id="cart-shipping-select">
          ${SHIPPING_OPTIONS.map(o=>`<option value="${o.id}">${o.label}</option>`).join('')}
        </select>
      </div>
      <div class="cart-total-row">
        <span>Total</span>
        <span id="cart-total-value">R$ 0,00</span>
      </div>
      <button id="cart-checkout" class="btn btn-primary" style="width:100%">Finalizar pelo WhatsApp</button>
      <p class="cart-note">O pagamento é combinado e confirmado no WhatsApp com a Jaque.</p>
    </aside>
  `;
  document.body.appendChild(panel);
  document.getElementById('cart-overlay').addEventListener('click', closeCartPanel);
  document.getElementById('cart-close').addEventListener('click', closeCartPanel);
  document.getElementById('cart-checkout').addEventListener('click', checkoutViaWhatsapp);
  document.getElementById('cart-shipping-select').addEventListener('change', renderCartPanel);
  document.querySelectorAll('[data-open-cart]').forEach(btn=>btn.addEventListener('click', openCartPanel));
}

function money(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

function renderCartPanel(){
  const cart = getCart();
  const itemsEl = document.getElementById('cart-items');
  if(!itemsEl) return;
  itemsEl.innerHTML = cart.length ? cart.map((item,i)=>`
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${item.color?item.color+' · ':''}${item.size||''}</span>
        <div class="qty-control qty-control-sm">
          <button onclick="setQty(${i}, ${item.qty-1})">–</button>
          <span>${item.qty}</span>
          <button onclick="setQty(${i}, ${item.qty+1})">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span>${money(item.price*item.qty)}</span>
        <button class="cart-remove" onclick="removeFromCart(${i})">remover</button>
      </div>
    </div>
  `).join('') : `<p class="cart-empty">Sua sacola está vazia.</p>`;

  const shippingId = document.getElementById('cart-shipping-select')?.value || 'retirada';
  const shipping = SHIPPING_OPTIONS.find(o=>o.id===shippingId);
  const shippingCost = shipping.price || 0;
  const total = cartTotal() + shippingCost;
  document.getElementById('cart-total-value').textContent =
    shipping.price===null ? `${money(cartTotal())} + frete a combinar` : money(total);
}

function openCartPanel(){
  buildCartPanel();
  renderCartPanel();
  document.getElementById('cart-panel').classList.add('open');
}
function closeCartPanel(){
  document.getElementById('cart-panel')?.classList.remove('open');
}

function checkoutViaWhatsapp(){
  const cart = getCart();
  if(!cart.length){ return; }
  const shippingId = document.getElementById('cart-shipping-select').value;
  const shipping = SHIPPING_OPTIONS.find(o=>o.id===shippingId);
  let msg = "Olá! Quero fechar este pedido no Jaqueline Alves Atelier:\n\n";
  cart.forEach(i=>{
    msg += `• ${i.name} (${i.color?i.color+', ':''}${i.size||''}) x${i.qty} — ${money(i.price*i.qty)}\n`;
  });
  msg += `\nEntrega: ${shipping.label}`;
  msg += `\nTotal: ${shipping.price===null? money(cartTotal())+' + frete a combinar' : money(cartTotal()+shipping.price)}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ======= BOTÃO FLUTUANTE WHATSAPP (dúvidas gerais) =======
function buildWhatsappFloat(){
  if(document.getElementById('wa-float')) return;
  const a = document.createElement('a');
  a.id = 'wa-float';
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim do site e tenho uma dúvida.')}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label','Falar no WhatsApp');
  a.innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.6.8 5 2.1 7L3 29l6.7-2.3c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1.4 1.3-3.9-.3-.4A10.1 10.1 0 015.9 15.5C5.9 9.9 10.4 5.4 16 5.4s10.1 4.5 10.1 10.1S21.6 25.7 16 25.7zm5.5-7.6c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-.9 1.1-.3.2-.6 0a8.3 8.3 0 01-4-3.5c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>`;
  document.body.appendChild(a);
}

document.addEventListener('DOMContentLoaded',()=>{
  buildCartPanel();
  buildWhatsappFloat();
  updateCartBadge();
  document.querySelectorAll('[data-add-cart]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const p = window.CURRENT_PRODUCT;
      if(p){
        e.preventDefault();
        const size = document.querySelector('#size-options button.active')?.textContent;
        const colorEl = document.querySelector('#swatches .swatch.active');
        const color = colorEl ? colorEl.style.background : null;
        const qty = Number(document.querySelector('.qty-control span')?.textContent || 1);
        addToCart({ id:p.id, name:p.name, price:p.price, size, color, qty });
      } else {
        addToCart({ id:'item', name:'Item', price:0, qty:1 });
      }
    });
  });
});
