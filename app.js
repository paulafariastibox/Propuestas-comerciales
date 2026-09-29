const KEY='tibox-proposals-mvp-v1';
const seed=[{
 id:'cmpc-demo',client:'Fundación CMPC',rut:'Demo',contact:'Contacto Fundación',email:'contacto@fundacioncmpc.cl',
 kam:'Paula Farias',title:'Actualización y Modernización Sitio Web',opp:'DEMO-2026-01',created:'2026-09-29',
 expiry:'2026-10-29',access:'otp',status:'viewed',views:3,last:'Hoy 09:12',first:'29/09/2026 11:08'
},{
 id:'qc-demo',client:'QC Terminales Chile',rut:'Demo',contact:'Juan Pérez',email:'juan.perez@cliente.cl',
 kam:'Estela Astudillo',title:'Modernización y Seguridad TI',opp:'DEMO-2026-02',created:'2026-09-28',
 expiry:'2026-10-28',access:'pin',status:'sent',views:0,last:'Ayer 17:40',first:'—'
}];

function load(){const x=localStorage.getItem(KEY);if(x)return JSON.parse(x);localStorage.setItem(KEY,JSON.stringify(seed));return seed.slice()}
let proposals=load(),currentSlide=0,currentId=null;
function save(){localStorage.setItem(KEY,JSON.stringify(proposals))}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function brand(extra='Portal de Propuestas'){return '<div class="brand"><div class="wordmark">TIBOX</div><div class="cube"><i></i><i></i><i></i><i></i></div><small>'+extra+'</small></div>'}
function statusLabel(s){return s==='viewed'?'Visualizada':s==='sent'?'Enviada':s==='expired'?'Vencida':'Borrador'}
function renderDashboard(){
 const viewed=proposals.filter(p=>p.status==='viewed').length,sent=proposals.filter(p=>p.status==='sent').length,expired=proposals.filter(p=>p.status==='expired').length;
 document.getElementById('app').innerHTML=
 '<div class="topbar">'+brand()+'<div class="actions"><button class="btn" onclick="resetDemo()">Restaurar demo</button><button class="btn primary" onclick="openNew()">+ Nueva propuesta</button></div></div>'+
 '<main class="wrap"><div class="headline"><div><div class="eyebrow">TIBOX • Comercial</div><h1>Propuestas comerciales</h1><p>Crea, comparte y controla propuestas privadas desde una sola experiencia.</p></div></div>'+
 '<section class="stats"><div class="stat"><span>Total</span><strong>'+proposals.length+'</strong></div><div class="stat"><span>Visualizadas</span><strong>'+viewed+'</strong></div><div class="stat"><span>Enviadas</span><strong>'+sent+'</strong></div><div class="stat"><span>Vencidas</span><strong>'+expired+'</strong></div></section>'+
 '<section class="panel"><div class="panel-head"><span>Actividad de propuestas</span><span class="muted">MVP local</span></div><table><thead><tr><th>Cliente</th><th>Propuesta</th><th>KAM</th><th>Acceso</th><th>Estado</th><th>Vistas</th><th>Última actividad</th><th></th></tr></thead><tbody>'+
 proposals.map(p=>'<tr><td><b>'+esc(p.client)+'</b><br><span class="muted">'+esc(p.contact)+'</span></td><td>'+esc(p.title)+'<br><span class="muted">'+esc(p.opp)+'</span></td><td>'+esc(p.kam)+'</td><td>'+((p.access==='otp')?'Email + OTP':'Link + PIN')+'</td><td><span class="badge '+p.status+'">'+statusLabel(p.status)+'</span></td><td>'+p.views+'</td><td>'+esc(p.last)+'</td><td><button class="btn" onclick="openGate(\''+p.id+'\')">Abrir</button></td></tr>').join('')+
 '</tbody></table></section></main>';
}
function openNew(){
 document.body.insertAdjacentHTML('beforeend','<div class="modal-bg" id="modal"><div class="modal"><div class="modal-head"><b>Nueva propuesta</b><button class="btn" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="grid">'+
 field('Cliente','client')+field('RUT','rut')+field('Contacto','contact')+field('Email autorizado','email','email')+field('KAM','kam')+field('N° oportunidad','opp')+field('Nombre de propuesta','title','text',true)+field('Vigencia hasta','expiry','date')+
 '<div class="field full"><label>Acceso</label><div class="choices"><label class="choice"><input type="radio" name="access" value="pin" checked> Link + PIN</label><label class="choice"><input type="radio" name="access" value="otp"> Email + OTP</label></div></div>'+
 '<div class="field full"><label>Formato</label><div class="choices"><label class="choice"><input type="radio" name="format" checked> HTML interactivo</label><label class="choice"><input type="radio" name="format"> PDF</label><label class="choice"><input type="radio" name="format"> HTML + PDF</label></div></div>'+
 '</div><div class="modal-foot"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="createProposal()">Crear propuesta</button></div></div></div></div>');
}
function field(label,id,type='text',full=false){return '<div class="field '+(full?'full':'')+'"><label>'+label+'</label><input id="'+id+'" type="'+type+'"></div>'}
function closeModal(){document.getElementById('modal')?.remove()}
function createProposal(){
 const get=id=>document.getElementById(id).value.trim(),access=document.querySelector('input[name=access]:checked').value;
 const p={id:'p-'+Date.now(),client:get('client')||'Nuevo cliente',rut:get('rut'),contact:get('contact'),email:get('email'),kam:get('kam')||'KAM TIBOX',title:get('title')||'Propuesta Comercial TIBOX',opp:get('opp')||'Sin oportunidad',created:new Date().toISOString().slice(0,10),expiry:get('expiry')||'2026-10-29',access,status:'draft',views:0,last:'Recién creada',first:'—'};
 proposals.unshift(p);save();closeModal();renderDashboard();
}
function resetDemo(){localStorage.removeItem(KEY);proposals=load();renderDashboard()}
function openGate(id){
 const p=proposals.find(x=>x.id===id);if(!p)return;currentId=id;
 document.getElementById('app').innerHTML='<div class="gate"><div class="gate-card">'+brand('Acceso seguro')+'<div style="margin-top:24px" class="secure">🔒 Propuesta de acceso restringido</div><h1>'+esc(p.title)+'</h1><p>Documento preparado especialmente para</p><h3>'+esc(p.client)+'</h3>'+
 (p.access==='otp'?'<p>Verificaremos el acceso usando el correo autorizado.</p><div class="gate-form"><label>Email</label><input id="gateEmail" type="email" value="'+esc(p.email)+'"><button class="btn blue" onclick="sendOtp()">Enviar código</button><div id="otpBlock" class="hidden"><label style="display:block;margin-top:14px">Código OTP</label><input id="otp" maxlength="6" placeholder="6 dígitos"><button class="btn primary" onclick="verifyOtp()">Ingresar</button></div></div><div class="demo">Demo MVP: el código es <b>482731</b>.</div>':
 '<p>Ingresa el PIN informado por tu ejecutivo TIBOX.</p><div class="gate-form"><label>PIN</label><input id="pin" maxlength="4" placeholder="••••"><button class="btn primary" onclick="verifyPin()">Ingresar</button></div><div class="demo">Demo MVP: el PIN es <b>2468</b>.</div>')+
 '<button class="btn" style="margin-top:18px" onclick="renderDashboard()">Volver al dashboard</button></div></div>';
}
function sendOtp(){document.getElementById('otpBlock').classList.remove('hidden')}
function verifyOtp(){if(document.getElementById('otp').value==='482731')openViewer(currentId);else alert('Código incorrecto. En la demo usa 482731.')}
function verifyPin(){if(document.getElementById('pin').value==='2468')openViewer(currentId);else alert('PIN incorrecto. En la demo usa 2468.')}
function markViewed(p){p.views=(p.views||0)+1;p.status='viewed';p.last='Ahora';if(p.first==='—')p.first=new Date().toLocaleString('es-CL');save()}
function openViewer(id){
 const p=proposals.find(x=>x.id===id);if(!p)return;currentId=id;currentSlide=0;markViewed(p);
 const slides=demoSlides(p);
 document.getElementById('app').innerHTML='<div class="viewer"><div class="viewer-top">'+brand('Propuesta Comercial')+'<div class="viewer-meta">'+esc(p.client)+' · Vigente hasta '+esc(p.expiry)+'</div><div class="actions"><button class="btn" onclick="window.print()">Descargar PDF</button><button class="btn" onclick="renderDashboard()">Cerrar</button></div></div><div class="slides" id="slides">'+slides.map((s,i)=>'<section class="slide '+(i===0?'active':'')+'" data-i="'+i+'">'+s+'</section>').join('')+
 '<nav class="viewer-nav"><button onclick="move(-1)">‹</button><div class="dots">'+slides.map((_,i)=>'<button class="'+(i===0?'active':'')+'" onclick="go('+i+')"></button>').join('')+'</div><div class="counter"><span id="n">1</span> / '+slides.length+'</div><button onclick="move(1)">›</button></nav></div></div>';
}
function go(i){const all=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.dots button')];if(i<0||i>=all.length)return;all.forEach(x=>x.classList.remove('active'));dots.forEach(x=>x.classList.remove('active'));all[i].classList.add('active');dots[i].classList.add('active');currentSlide=i;document.getElementById('n').textContent=i+1}
function move(d){go(currentSlide+d)}
window.addEventListener('keydown',e=>{if(document.querySelector('.viewer')){if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)}})
function demoSlides(p){return[
 '<div class="slide-inner"><div class="kicker">01 · Resumen ejecutivo</div><h2>'+esc(p.title)+'</h2><p>TIBOX presenta una propuesta orientada a modernizar la experiencia digital, ordenar la arquitectura de información y entregar una plataforma simple de administrar, segura y preparada para evolucionar.</p><div class="cards"><div class="card"><h3>Cliente</h3><div class="metric">'+esc(p.client)+'</div><p>Propuesta preparada especialmente para la organización.</p></div><div class="card"><h3>Vigencia</h3><div class="metric">30 días</div><p>Acceso privado y controlado desde el portal.</p></div><div class="card"><h3>Modalidad</h3><div class="metric">Integral</div><p>Diseño, implementación, pruebas y acompañamiento.</p></div></div></div>',
 '<div class="slide-inner"><div class="kicker">02 · Desafío</div><h2>Una experiencia digital más clara, moderna y administrable.</h2><p>El proyecto busca consolidar contenidos, mejorar la navegación, elevar el estándar visual y permitir que el equipo interno mantenga la plataforma actualizada con autonomía.</p><div class="cards"><div class="card"><h3>Arquitectura</h3><p>Organización clara de secciones, jerarquías y rutas de navegación.</p></div><div class="card"><h3>Experiencia</h3><p>Diseño responsivo, accesible y coherente con la identidad institucional.</p></div><div class="card"><h3>Autogestión</h3><p>Componentes reutilizables y administración simple de contenidos.</p></div></div></div>',
 '<div class="slide-inner"><div class="kicker">03 · Solución propuesta</div><h2>Un proyecto completo, desde discovery hasta producción.</h2><div class="cards"><div class="card"><h3>UX/UI</h3><p>Árbol de contenidos, wireframes, diseño visual y responsive.</p></div><div class="card"><h3>Implementación</h3><p>Configuración de páginas, componentes, formularios y contenido.</p></div><div class="card"><h3>QA + Seguridad</h3><p>Pruebas funcionales, compatibilidad, accesibilidad y revisión de seguridad.</p></div></div><div class="list"><div>Diseño centrado en el usuario</div><div>Publicación controlada</div><div>Capacitación y transferencia operativa</div><div>Soporte de estabilización</div></div></div>',
 '<div class="slide-inner"><div class="kicker">04 · Metodología</div><h2>Trabajo incremental, validado por hitos.</h2><p>La ejecución se organiza en etapas de definición, diseño, construcción, pruebas y puesta en marcha para reducir observaciones tardías y controlar los riesgos del proyecto.</p><div class="timeline"><div class="step"><b>01</b>Discovery</div><div class="step"><b>02</b>UX/UI</div><div class="step"><b>03</b>Implementación</div><div class="step"><b>04</b>QA y seguridad</div><div class="step"><b>05</b>Go Live</div></div></div>',
 '<div class="slide-inner"><div class="kicker">05 · Roadmap</div><h2>Plan de trabajo de referencia: 16 semanas.</h2><div class="cards"><div class="card"><h3>Semanas 1–4</h3><p>Kickoff, discovery, arquitectura y UX.</p></div><div class="card"><h3>Semanas 4–11</h3><p>Diseño UI, implementación y migración de contenidos.</p></div><div class="card"><h3>Semanas 10–16</h3><p>QA, seguridad, UAT, Go Live y estabilización.</p></div></div></div>',
 '<div class="slide-inner"><div class="kicker">06 · Equipo</div><h2>Especialistas para cada etapa.</h2><div class="cards"><div class="card"><h3>Jefatura de proyecto</h3><p>Coordinación, planificación, seguimiento y control de hitos.</p></div><div class="card"><h3>UX/UI</h3><p>Arquitectura, experiencia, componentes y accesibilidad.</p></div><div class="card"><h3>Implementación</h3><p>Configuración, desarrollo visual, responsive, carga y pruebas.</p></div></div></div>',
 '<div class="slide-inner"><div class="kicker">07 · Inversión</div><h2>Propuesta económica.</h2><div class="value-box"><div class="price"><span class="muted">Valor de demostración</span><strong>A definir</strong><p>En producción, esta sección puede leer los valores específicos de cada propuesta y ocultarse hasta que el cliente complete el acceso.</p><div class="list"><div>Implementación según alcance aprobado</div><div>Hitos y entregables definidos</div><div>Condiciones comerciales asociadas a la propuesta</div></div></div><div class="card"><h3>Próximo paso</h3><p>Revisar alcance, resolver observaciones y avanzar a la validación comercial.</p><button class="btn primary" style="margin-top:18px" onclick="alert(\'Demo: aquí podemos incorporar Aceptar propuesta / Solicitar reunión.\')">Solicitar reunión</button></div></div></div>'
]}
renderDashboard();