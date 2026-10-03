(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====== Ubah bagian ini saja ====== */
  var NAMA='hafshah nuriza danis';
  var UMUR='20';
  var UCAPAN=[                    /* ucapan yang sudah dipasang di halaman */
    /* {nama:'Nama Pengucap', pesan:'Isi ucapannya'}, */
  ];
  /* ================================== */

  function all(s){return [].slice.call(document.querySelectorAll(s));}
  function clean(v){return (v||'').replace(/\s+/g,' ').trim();}

  all('.js-nama').forEach(function(e){e.textContent=NAMA;});
  all('.js-umur').forEach(function(e){e.textContent=UMUR;});
  document.title='Happy Birthday, '+NAMA;
  all('.js-untuk').forEach(function(e){e.textContent='Untuk '+NAMA;});
  all('.js-cap').forEach(function(e){e.textContent=NAMA+', sweet '+UMUR;});

  /* sampul: harus disentuh dulu sebelum masuk */
  var html=document.documentElement;
  html.classList.add('ready');
  var cover=document.getElementById('cover'), amplop=document.getElementById('amplop');
  amplop.setAttribute('aria-label','Buka amplop ucapan untuk '+NAMA);
  var kunci=[].slice.call(document.querySelectorAll('header.hero,main,footer'));
  function kuncikan(on){ kunci.forEach(function(e){ e.inert=on; }); }
  function masuk(){
    html.classList.add('opened');
    cover.hidden=true;
    kuncikan(false);
    window.scrollTo(0,0);
    var t=document.querySelector('.title');
    if(t){ t.setAttribute('tabindex','-1'); try{ t.focus({preventScroll:true}); }catch(e){} }
  }
  if(html.classList.contains('gated')){
    kuncikan(true);
    try{ amplop.focus({preventScroll:true}); }catch(e){}
    var membuka=false;
    cover.addEventListener('click',function(){
      if(membuka) return; membuka=true;
      cover.classList.add('open');
      if(reduce){ masuk(); return; }
      setTimeout(function(){ burst(amplop); },480);
      setTimeout(function(){ cover.classList.add('leave'); html.classList.add('opened'); },1450);
      setTimeout(masuk,2350);
    });
  } else {
    html.classList.add('opened'); cover.hidden=true;
  }

  /* foto polaroid bergoyang saat disentuh */
  var pol=document.getElementById('polaroid');
  if(pol && !reduce){
    pol.addEventListener('click',function(){
      pol.classList.remove('wiggle'); void pol.offsetWidth; pol.classList.add('wiggle');
    });
    pol.addEventListener('animationend',function(){ pol.classList.remove('wiggle'); });
  }

  /* hati dan bunga melayang */
  if(!reduce){
    var box=document.getElementById('floaters'), NS='http://www.w3.org/2000/svg';
    var kinds=[['#heart','#FF8DB8'],['#heart','#FFFFFF'],['#daisy',null],['#heart','#FFC2D9'],['#star','#FFD34D']];
    for(var i=0;i<16;i++){
      var k=kinds[i%kinds.length], d=document.createElement('div');
      d.className='fl';
      d.style.left=(Math.random()*96)+'%';
      d.style.setProperty('--s',(16+Math.random()*24)+'px');
      d.style.setProperty('--t',(14+Math.random()*14)+'s');
      d.style.setProperty('--dl',(-Math.random()*24)+'s');
      d.style.setProperty('--dx',((Math.random()-.5)*120)+'px');
      d.style.setProperty('--rot',((Math.random()-.5)*160)+'deg');
      d.style.setProperty('--o',(.35+Math.random()*.35).toFixed(2));
      var svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox',k[0]==='#daisy'?'0 0 80 80':(k[0]==='#star'?'0 0 24 24':'0 0 24 22'));
      if(k[1]) svg.setAttribute('fill',k[1]);
      var u=document.createElementNS(NS,'use'); u.setAttribute('href',k[0]);
      svg.appendChild(u); d.appendChild(svg); box.appendChild(d);
    }
  }

  /* muncul saat digulir */
  var rv=all('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12});
    rv.forEach(function(e){io.observe(e);});
  } else { rv.forEach(function(e){e.classList.add('in');}); }

  /* konfeti */
  var cv=document.getElementById('confetti'), ctx=cv.getContext('2d'), parts=[], raf=0;
  function fit(){var d=window.devicePixelRatio||1;cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);ctx.setTransform(d,0,0,d,0,0);}
  function burst(src){
    if(reduce) return;
    fit();
    var r=src.getBoundingClientRect(), ox=r.left+r.width/2, oy=r.top+r.height/2;
    var cols=['#FF8DB8','#C9336E','#FFD34D','#FFFFFF','#FFC2D9','#FFB3CF'];
    for(var i=0;i<180;i++){
      var a=-Math.PI/2+(Math.random()-.5)*2.4, v=6+Math.random()*10;
      parts.push({x:ox,y:oy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:6+Math.random()*6,h:4+Math.random()*5,rot:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[i%cols.length],life:0,heart:i%4===0});
    }
    if(!raf) raf=requestAnimationFrame(step);
  }
  function step(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    parts=parts.filter(function(p){return p.y<innerHeight+30&&p.life<300;});
    parts.forEach(function(p){
      p.life++;p.vy+=.22;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.c;
      if(p.heart){ctx.font=(p.w*2)+'px serif';ctx.textAlign='center';ctx.fillText('\u2665',0,0);}
      else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
      ctx.restore();
    });
    if(parts.length){raf=requestAnimationFrame(step);}else{raf=0;ctx.clearRect(0,0,innerWidth,innerHeight);}
  }
  var rb=document.getElementById('rayakan');
  rb.addEventListener('click',function(){burst(rb);});

  /* dinding ucapan */
  var notes=document.getElementById('notes'), empty=document.getElementById('empty'), NS2='http://www.w3.org/2000/svg';
  var jumlah=document.getElementById('jumlah'), jml=document.getElementById('jml');
  function heartSvg(){
    var sv=document.createElementNS(NS2,'svg'); sv.setAttribute('viewBox','0 0 24 22'); sv.setAttribute('aria-hidden','true');
    var us=document.createElementNS(NS2,'use'); us.setAttribute('href','#heart'); sv.appendChild(us); return sv;
  }
  UCAPAN.forEach(function(u,i){
    var d=document.createElement('article'); d.className='note'; d.style.setProperty('--i',i);
    var who=document.createElement('div'); who.className='who';
    var av=document.createElement('span'); av.className='av'; av.setAttribute('aria-hidden','true');
    av.textContent=(clean(u.nama).charAt(0)||'?').toUpperCase();
    var nm=document.createElement('span'); nm.className='from'; nm.textContent=u.nama;
    who.appendChild(av); who.appendChild(nm);
    var q=document.createElement('blockquote'); q.textContent=u.pesan;
    var b=document.createElement('button'); b.type='button'; b.className='love';
    b.setAttribute('aria-pressed','false'); b.setAttribute('aria-label','Suka ucapan dari '+u.nama);
    b.appendChild(heartSvg());
    b.addEventListener('click',function(){
      var on=b.getAttribute('aria-pressed')!=='true';
      b.setAttribute('aria-pressed',on?'true':'false');
      if(on && !reduce){
        for(var k=0;k<7;k++){
          var h=document.createElement('span'); h.className='pop-h'; h.appendChild(heartSvg());
          h.style.setProperty('--x',((Math.random()-.5)*70)+'px');
          h.style.setProperty('--y',(-(24+Math.random()*40))+'px');
          b.appendChild(h);
          (function(el){setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },900);})(h);
        }
      }
    });
    d.appendChild(who); d.appendChild(q); d.appendChild(b); notes.appendChild(d);
  });
  empty.hidden=UCAPAN.length>0;
  jumlah.hidden=UCAPAN.length===0;
  jml.textContent=UCAPAN.length+' orang sudah mengucapkan';

  /* salin ucapan */
  var un=document.getElementById('un'), up=document.getElementById('up'), kk=document.getElementById('kirim');
  var err=document.getElementById('err'), hasil=document.getElementById('hasil'), ok=document.getElementById('ok');
  var info=document.getElementById('info'), sal=document.getElementById('salinan');

  function salin(t){
    function cadangan(){
      sal.value=t; sal.focus(); sal.select();
      try{ sal.setSelectionRange(0,t.length); }catch(e){}
      var r=false; try{ r=document.execCommand('copy'); }catch(e){}
      return r;
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(t).then(function(){return true;},function(){return cadangan();});
    }
    return Promise.resolve(cadangan());
  }
  kk.addEventListener('click',function(){
    if(!clean(un.value)||!up.value.trim()){
      err.hidden=false; (clean(un.value)?up:un).focus(); return;
    }
    err.hidden=true;
    var t='Ucapan ulang tahun untuk '+NAMA+' dari '+clean(un.value)+':\n\n'+up.value.trim();
    hasil.hidden=false; sal.value=t;
    salin(t).then(function(done){
      ok.textContent = done
        ? 'Sudah disalin! Kirim ke pemilik halaman supaya dipasang di sini.'
        : 'Salin teks di bawah ini, lalu kirim ke pemilik halaman supaya dipasang di sini.';
      info.hidden=true;
      burst(kk);
    });
  });
  function hide(){ err.hidden=true; }
  un.addEventListener('input',hide); up.addEventListener('input',hide);
})();