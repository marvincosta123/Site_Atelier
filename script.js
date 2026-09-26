// Galeria de miniaturas (fallback estático — a página de produto usa render.js/cart.js)
document.querySelectorAll('.gallery-thumbs div').forEach(thumb=>{
  thumb.addEventListener('click',()=>{
    document.querySelectorAll('.gallery-thumbs div').forEach(t=>t.classList.remove('active'));
    thumb.classList.add('active');
    const main=document.querySelector('.gallery-main');
    if(main) main.style.background=thumb.style.background;
  });
});

// Seleção de cor
document.querySelectorAll('.swatch').forEach(sw=>{
  sw.addEventListener('click',()=>{
    sw.parentElement.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
  });
});

// Seleção de tamanho
document.querySelectorAll('.size-options button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Controle de quantidade
document.querySelectorAll('.qty-control').forEach(control=>{
  const span=control.querySelector('span');
  let qty=1;
  control.querySelector('.qty-minus').addEventListener('click',()=>{
    qty=Math.max(1,qty-1);
    span.textContent=qty;
  });
  control.querySelector('.qty-plus').addEventListener('click',()=>{
    qty++;
    span.textContent=qty;
  });
});

// Formulário de pedido de encomenda
const encomendaForm=document.getElementById('encomenda-form');
if(encomendaForm){
  encomendaForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=document.getElementById('encomenda-msg');
    msg.textContent='Pedido enviado! A Jaque vai confirmar prazo e detalhes com você em breve.';
    msg.classList.add('show');
    encomendaForm.reset();
  });
}

// Newsletter
document.querySelectorAll('.newsletter-form').forEach(form=>{
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const btn=form.querySelector('button');
    const original=btn.textContent;
    btn.textContent='Inscrito!';
    setTimeout(()=>btn.textContent=original,2200);
    form.reset();
  });
});
