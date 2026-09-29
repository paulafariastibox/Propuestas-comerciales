const STORAGE='tibox-proposals-mvp-v2';

const ICONS={
 dashboard:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
 proposal:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>',
 clients:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M17 11a4 4 0 0 1 4 4v2"/></svg>',
 chart:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg>',
 settings:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06-2.12 2.12-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.64V21h-3v-.1a1.8 1.8 0 0 0-1.1-1.64 1.8 1.8 0 0 0-2 .36l-.06.06-2.12-2.12.06-.06a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 5.1 14.4H5v-3h.1a1.8 1.8 0 0 0 1.64-1.1 1.8 1.8 0 0 0-.36-2l-.06-.06 2.12-2.12.06.06a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 11.6 4.9V5h3v-.1a1.8 1.8 0 0 0 1.1-1.64 1.8 1.8 0 0 0 2-.36l.06-.06 2.12 2.12-.06.06a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.64 1.1h.1v3h-.1a1.8 1.8 0 0 0-1.7 1.1z"/></svg>',
 search:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 plus:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
 eye:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/></svg>',
 copy:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
 lock:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
};

const seed=[
 {id:'fundacion-demo',client:'Fundación Horizonte',rut:'76.000.000-0',contact:'María González',email:'maria.gonzalez@fundaciondemo.cl',kam:'Paula Farias',title:'Modernización y Evolución Sitio Web',opp:'OP-2026-082',created:'2026-09-29',expiry:'2026-10-29',access:'otp',format:'html',status:'viewed',views:4,last:'Hoy 09:12',first:'29/09/2026 11:08',time:'12m 34s'},
 {id:'qc-demo',client:'Empresa Portuaria Demo',rut:'77.000.000-1',contact:'Juan Pérez',email:'juan.perez@empresa.cl',kam:'Estela Astudillo',title:'Modernización y Seguridad TI',opp:'OP-2026-074',created:'2026-09-28',expiry:'2026-10-28',access:'pin',format:'html',status:'sent',views:0,last:'Ayer 17:40',first:'—',time:'—'},
 {id:'agro-demo',client:'Agroindustrial Valle Sur',rut:'78.000.000-2',contact:'Camila Soto',email:'camila.soto@agrovalle.cl',kam:'Claudio Molina',title:'Monitoreo NOC & Continuidad Operacional',opp:'OP-2026-069',created:'2026-09-25',expiry:'2026-10-25',access:'pin',format:'pdf',status:'draft',views:0,last:'25 Sep 15:31',first:'—',time:'—'}
];

function load(){try{const raw=localStorage.getItem(STORAGE);if(raw)return JSON.parse(raw)}catch(e){}localStorage.setItem(STORAGE,JSON.stringify(seed));return structuredClone(seed)}
let proposals=load();
let selectedProposal=null;
let currentSlide=0;
let currentId=null;
let searchTerm='';

function save(){localStorage.setItem(STORAGE,JSON.stringify(proposals))}
function e(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function brand(label='Portal de Propuestas'){return '<div class="brandmark"><div class="brand-word">TIBOX</div><div class="brand-cube"><span></span><span></span><span></span><span></span></div><div class="brand-label">'+label+'</div></div>'}
function statusLabel(s){return ({viewed:'Visualizada',sent:'Enviada',draft:'Borrador',expired:'Vencida'})[s]||s}
function accessLabel(a){return a==='otp'?'Email + OTP':'Link + PIN'}
function formatLabel(f){return ({html:'HTML interactivo',pdf:'PDF','html+pdf':'HTML + PDF'})[f]||f}
function toast(msg){const root=document.getElementById('toast-root');root.innerHTML='<div class="toast">'+msg+'</div>';setTimeout(()=>root.innerHTML='',2200)}
function resetDemo(){localStorage.removeItem(STORAGE);proposals=load();renderAdmin();toast('Demo restaurada')}
function sidebar(){return '<aside class="sidebar">'+brand('')+'<nav class="side-nav">'+
  nav('dashboard','Dashboard',true)+nav('proposal','Propuestas')+nav('clients','Clientes')+nav('chart','Actividad')+nav('settings','Configuración')+
  '</nav><div class="side-footer"><div class="user-chip"><div class="avatar">PF</div><div><b>Paula Farias</b><span>Mercado y Producto</span></div></div></div></aside>'}
function nav(icon,label,active=false){return '<button class="nav-item '+(active?'active':'')+'" onclick="toast(\''+label+' estará disponible en la siguiente fase\')"><span class="nav-icon">'+ICONS[icon]+'</span><span>'+label+'</span></button>'}

function renderAdmin(){
 document.body.className='';
 const filtered=proposals.filter(p=>!searchTerm||[p.client,p.title,p.contact,p.kam,p.opp].join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
 const viewed=proposals.filter(p=>p.status==='viewed').length;
 const sent=proposals.filter(p=>p.status==='sent').length;
 const totalViews=proposals.reduce((a,p)=>a+(p.views||0),0);
 document.getElementById('app').innerHTML='<div class="app-shell"><div class="admin-shell">'+sidebar()+
 '<main class="main-area"><header class="admin-top"><div class="page-title">Portal de Propuestas TIBOX <span style="color:#506c84">/ MVP</span></div><div class="top-actions"><button class="btn ghost" onclick="resetDemo()">Restaurar demo</button><button class="btn primary" onclick="openNewProposal()">'+ICONS.plus+' Nueva propuesta</button></div></header>'+
 '<div class="workspace"><div class="hero-row"><div><div class="eyebrow">Gestión comercial</div><h1>Propuestas con una mejor experiencia.</h1><p>Publica propuestas en formato web o PDF, controla el acceso y revisa cuándo un cliente interactúa con ellas.</p></div><button class="btn cyan" onclick="openGate(\'fundacion-demo\')">'+ICONS.eye+' Ver demo cliente</button></div>'+
 '<section class="kpi-grid">'+kpi('Propuestas activas',proposals.length,'En este entorno de prueba')+kpi('Visualizadas',viewed,'Clientes que ya ingresaron')+kpi('Pendientes',sent,'Enviadas sin apertura')+kpi('Visualizaciones',totalViews,'Acumuladas en el MVP')+'</section>'+
 '<div class="toolbar"><div class="search"><span>'+ICONS.search+'</span><input placeholder="Buscar cliente, propuesta, KAM..." value="'+e(searchTerm)+'" oninput="searchProposals(this.value)"></div><div class="top-actions"><button class="btn" onclick="toast(\'Filtros avanzados en próxima fase\')">Filtros</button><button class="btn" onclick="toast(\'Exportación disponible en próxima fase\')">Exportar</button></div></div>'+
 '<section class="table-card"><div class="table-head"><b>Actividad de propuestas</b><span>'+filtered.length+' resultado'+(filtered.length===1?'':'s')+'</span></div>'+
 '<table><thead><tr><th>Cliente</th><th>Propuesta</th><th>KAM</th><th>Acceso</th><th>Estado</th><th>Vistas</th><th>Última actividad</th><th></th></tr></thead><tbody>'+
 filtered.map(row).join('')+'</tbody></table><div class="mobile-cards">'+filtered.map(mobileCard).join('')+'</div></section>'+
 '</div></main></div></div>';
}
function kpi(label,value,foot){return '<div class="kpi"><div class="kpi-label">'+label+'</div><div class="kpi-value">'+value+'</div><div class="kpi-foot">'+foot+'</div></div>'}
function row(p){return '<tr><td class="client-cell"><b>'+e(p.client)+'</b><span class="subline">'+e(p.contact)+'</span></td><td class="proposal-cell"><b>'+e(p.title)+'</b><span class="subline">'+e(p.opp)+'</span></td><td>'+e(p.kam)+'</td><td>'+accessLabel(p.access)+'</td><td><span class="badge '+p.status+'">'+statusLabel(p.status)+'</span></td><td>'+p.views+'</td><td>'+e(p.last)+'</td><td><button class="more-btn" onclick="openDetails(\''+p.id+'\')">•••</button></td></tr>'}
function mobileCard(p){return '<div class="mobile-card"><div class="mobile-card-head"><div><h3>'+e(p.client)+'</h3><p>'+e(p.title)+'</p></div><span class="badge '+p.status+'">'+statusLabel(p.status)+'</span></div><div class="mobile-card-foot"><span class="subline">'+e(p.kam)+' · '+p.views+' vistas</span><button class="btn" onclick="openDetails(\''+p.id+'\')">Abrir</button></div></div>'}
function searchProposals(v){searchTerm=v;renderAdmin()}

function openNewProposal(){
 document.body.insertAdjacentHTML('beforeend','<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-header"><div><div class="eyebrow">Nueva propuesta</div><h3>Crear acceso comercial</h3></div><button class="btn icon-only" onclick="closeModal()">×</button></div>'+
 '<div class="modal-body"><div class="form-grid">'+
 field('Cliente','np-client','Ej: Empresa ABC')+field('RUT','np-rut','76.123.456-7')+field('Contacto','np-contact','Nombre y apellido')+field('Email autorizado','np-email','contacto@cliente.cl','email')+
 field('KAM','np-kam','Ej: Estela Astudillo')+field('N° oportunidad','np-opp','OP-2026-000')+field('Nombre de propuesta','np-title','Ej: Modernización y Seguridad TI','text',true)+field('Vigencia hasta','np-expiry','','date')+
 '<div class="field full"><label>Tipo de acceso</label><div class="segmented"><label class="segment"><input type="radio" name="np-access" value="pin" checked><b>Link + PIN</b><span>El cliente recibe el enlace y un PIN de acceso.</span></label><label class="segment"><input type="radio" name="np-access" value="otp"><b>Email + OTP</b><span>El acceso se valida contra un email autorizado.</span></label></div></div>'+
 '<div class="field full"><label>Formato de propuesta</label><div class="segmented three"><label class="segment"><input type="radio" name="np-format" value="html" checked><b>HTML interactivo</b><span>Experiencia web horizontal.</span></label><label class="segment"><input type="radio" name="np-format" value="pdf"><b>PDF</b><span>Documento embebido en visor.</span></label><label class="segment"><input type="radio" name="np-format" value="html+pdf"><b>HTML + PDF</b><span>Web interactiva más descarga.</span></label></div></div>'+
 '<div class="field full"><label>Archivo / contenido</label><div class="upload-box"><b>Arrastra tu PDF o paquete HTML aquí</b><span>En este MVP el archivo es demostrativo. En producción se guardará en Azure Blob Storage.</span></div></div>'+
 '</div><div class="modal-footer"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="createProposal()">'+ICONS.plus+' Crear propuesta</button></div></div></div></div>');
}
function field(label,id,placeholder='',type='text',full=false){return '<div class="field '+(full?'full':'')+'"><label>'+label+'</label><input id="'+id+'" type="'+type+'" placeholder="'+placeholder+'"></div>'}
function closeModal(){document.getElementById('modal')?.remove()}
function createProposal(){
 const v=id=>document.getElementById(id)?.value.trim()||'';
 const access=document.querySelector('input[name=np-access]:checked')?.value||'pin';
 const format=document.querySelector('input[name=np-format]:checked')?.value||'html';
 const p={id:'p-'+Date.now(),client:v('np-client')||'Nuevo cliente',rut:v('np-rut')||'—',contact:v('np-contact')||'Contacto',email:v('np-email')||'contacto@cliente.cl',kam:v('np-kam')||'KAM TIBOX',opp:v('np-opp')||'Sin oportunidad',title:v('np-title')||'Propuesta Comercial TIBOX',created:new Date().toISOString().slice(0,10),expiry:v('np-expiry')||'2026-10-29',access,format,status:'draft',views:0,last:'Recién creada',first:'—',time:'—'};
 proposals.unshift(p);save();closeModal();renderAdmin();toast('Propuesta creada')
}

function openDetails(id){
 const p=proposals.find(x=>x.id===id);if(!p)return;selectedProposal=id;
 document.body.insertAdjacentHTML('beforeend','<div class="drawer-backdrop" id="drawer" onclick="if(event.target===this)closeDrawer()"><aside class="drawer"><div class="drawer-head"><div><div class="eyebrow">Detalle de propuesta</div><h3>'+e(p.title)+'</h3><p>'+e(p.client)+' · '+e(p.opp)+'</p></div><button class="btn icon-only" onclick="closeDrawer()">×</button></div>'+
 '<div class="detail-grid">'+detail('Estado','<span class="badge '+p.status+'">'+statusLabel(p.status)+'</span>')+detail('Tipo de acceso',accessLabel(p.access))+detail('Formato',formatLabel(p.format))+detail('Vigencia',e(p.expiry))+detail('Visualizaciones',p.views)+detail('Tiempo de lectura',e(p.time||'—'))+'</div>'+
 '<div style="display:grid;gap:9px;margin-top:18px"><button class="btn cyan" onclick="closeDrawer();openGate(\''+p.id+'\')">'+ICONS.eye+' Abrir portal cliente</button><button class="btn" onclick="copyLink(\''+p.id+'\')">'+ICONS.copy+' Copiar enlace privado</button><button class="btn" onclick="toast(\'Edición disponible en próxima fase\')">Editar datos</button></div>'+
 '<div class="timeline-list">'+timeline('Apertura','Primera visualización: '+e(p.first),'↗')+timeline('Actividad','Última actividad: '+e(p.last),'•')+timeline('Creación','Creada el '+e(p.created),'✓')+'</div>'+
 '</aside></div>');
}
function detail(label,value){return '<div class="detail-card"><span>'+label+'</span><b>'+value+'</b></div>'}
function timeline(title,text,icon){return '<div class="timeline-item"><div class="timeline-icon">'+icon+'</div><div><b>'+title+'</b><span>'+text+'</span></div></div>'}
function closeDrawer(){document.getElementById('drawer')?.remove()}
function copyLink(id){
 const base=location.href.split('#')[0].split('?')[0];
 const link=base+'?proposal='+encodeURIComponent(id);
 navigator.clipboard?.writeText(link).then(()=>toast('Enlace copiado')).catch(()=>toast(link));
}

function openGate(id){
 const p=proposals.find(x=>x.id===id);if(!p)return;currentId=id;history.replaceState(null,'','?proposal='+encodeURIComponent(id));
 document.getElementById('app').innerHTML='<div class="gate-page"><section class="gate-art"><div>'+brand('Portal Cliente')+'</div><div class="gate-copy"><div class="eyebrow">Propuesta preparada para '+e(p.client)+'</div><h1>'+e(p.title)+'</h1><p>Una experiencia privada para revisar el alcance, la solución propuesta, metodología, roadmap e inversión desde cualquier dispositivo.</p></div><div class="gate-stats"><div class="gate-stat"><span>Cliente</span><b>'+e(p.client)+'</b></div><div class="gate-stat"><span>Vigencia</span><b>'+e(p.expiry)+'</b></div><div class="gate-stat"><span>Acceso</span><b>'+accessLabel(p.access)+'</b></div></div></section>'+
 '<section class="gate-panel"><div class="gate-card"><div class="secure-pill">'+ICONS.lock+' Acceso protegido</div><h2>Verifica tu acceso</h2><p>Esta propuesta contiene información comercial de uso restringido. Ingresa los datos asociados a la invitación.</p>'+
 (p.access==='otp'?'<div class="field"><label>Email autorizado</label><input id="gate-email" type="email" value="'+e(p.email)+'"></div><button class="btn cyan" style="width:100%" onclick="showOtp()">Enviar código</button><div id="otp-area" class="hidden" style="margin-top:12px"><div class="field"><label>Código OTP</label><input id="otp-code" maxlength="6" inputmode="numeric" placeholder="000000"></div><button class="btn primary" style="width:100%" onclick="verifyOtp()">Ingresar a la propuesta</button></div><div class="demo-note">Demo: utiliza el código <b>482731</b>.</div>':
 '<div class="field"><label>PIN de acceso</label><input id="pin-code" maxlength="4" inputmode="numeric" placeholder="••••"></div><button class="btn primary" style="width:100%" onclick="verifyPin()">Ingresar a la propuesta</button><div class="demo-note">Demo: utiliza el PIN <b>2468</b>.</div>')+
 '<button class="btn ghost" style="width:100%;margin-top:10px" onclick="history.replaceState(null,\'\',location.pathname);renderAdmin()">Volver al portal</button></div></section></div>';
}
function showOtp(){document.getElementById('otp-area').classList.remove('hidden');toast('Código enviado (simulación MVP)')}
function verifyOtp(){if(document.getElementById('otp-code')?.value==='482731')openViewer(currentId);else toast('Código incorrecto. Usa 482731 en la demo.')}
function verifyPin(){if(document.getElementById('pin-code')?.value==='2468')openViewer(currentId);else toast('PIN incorrecto. Usa 2468 en la demo.')}
function markViewed(p){p.views=(p.views||0)+1;p.status='viewed';p.last='Ahora';if(p.first==='—')p.first=new Date().toLocaleString('es-CL');if(p.time==='—')p.time='0m 42s';save()}

function openViewer(id){
 const p=proposals.find(x=>x.id===id);if(!p)return;currentId=id;currentSlide=0;markViewed(p);
 const slides=proposalSlides(p);
 document.getElementById('app').innerHTML='<div class="viewer-shell"><header class="viewer-top"><div class="viewer-info">'+brand('Propuesta Comercial')+'<div class="viewer-divider"></div><div class="viewer-client"><b>'+e(p.client)+'</b><span>'+e(p.opp)+' · Vigente hasta '+e(p.expiry)+'</span></div></div><div class="viewer-actions"><button class="btn" onclick="window.print()">↓ <span>Descargar PDF</span></button><button class="btn" onclick="history.replaceState(null,\'\',location.pathname);renderAdmin()">Cerrar</button></div></header>'+
 '<div class="slide-stage"><div class="slide-menu">'+slides.map((_,i)=>'<button class="'+(i===0?'active':'')+'" onclick="goSlide('+i+')">'+String(i+1).padStart(2,'0')+'</button>').join('')+'</div>'+
 slides.map((s,i)=>'<section class="slide '+(i===0?'active':'')+'" data-slide="'+i+'">'+s+'</section>').join('')+
 '<nav class="viewer-nav"><button class="nav-arrow" onclick="moveSlide(-1)">‹</button><div class="dots">'+slides.map((_,i)=>'<button class="'+(i===0?'active':'')+'" onclick="goSlide('+i+')"></button>').join('')+'</div><div class="counter"><span id="slide-number">1</span> / '+slides.length+'</div><button class="nav-arrow" onclick="moveSlide(1)">›</button></nav></div></div>';
}
function goSlide(i){
 const slides=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.dots button')],menu=[...document.querySelectorAll('.slide-menu button')];
 if(i<0||i>=slides.length)return;
 slides.forEach(x=>x.classList.remove('active'));dots.forEach(x=>x.classList.remove('active'));menu.forEach(x=>x.classList.remove('active'));
 slides[i].classList.add('active');dots[i].classList.add('active');menu[i]?.classList.add('active');currentSlide=i;
 const n=document.getElementById('slide-number');if(n)n.textContent=i+1;
}
function moveSlide(d){goSlide(currentSlide+d)}
window.addEventListener('keydown',ev=>{if(document.querySelector('.viewer-shell')){if(ev.key==='ArrowRight')moveSlide(1);if(ev.key==='ArrowLeft')moveSlide(-1)}});

function proposalSlides(p){
 return [
 '<div class="slide-inner"><div class="hero-layout"><div><div class="slide-kicker">01 · Propuesta Comercial</div><h1>Modernizamos tu experiencia digital con una solución <em>clara, segura y escalable.</em></h1><p class="lead">Una propuesta TIBOX diseñada para evolucionar la presencia digital de '+e(p.client)+', mejorar la experiencia de sus usuarios y entregar mayor autonomía al equipo interno.</p><div class="mini-pills"><span class="mini-pill">UX/UI</span><span class="mini-pill">Responsive</span><span class="mini-pill">Autogestión</span><span class="mini-pill">Seguridad</span><span class="mini-pill">Analítica</span></div></div><div class="hero-visual"><div class="orbit o1"></div><div class="orbit o2"></div><div class="orbit o3"></div><div class="core">TIBOX</div><div class="node n1">UX/UI</div><div class="node n2">CMS</div><div class="node n3">QA</div><div class="node n4">SECURITY</div></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">02 · El desafío</div><h2>Consolidar una presencia digital que represente el momento actual de la organización.</h2><p class="lead">El desafío no es solo rediseñar: es ordenar la arquitectura, simplificar la navegación, integrar contenidos y dejar una plataforma que pueda mantenerse vigente sin depender permanentemente de terceros.</p><div class="grid-3"><div class="proposal-card"><div class="num">01</div><h3>Experiencia fragmentada</h3><p>Unificar contenidos y reducir puntos de fricción para distintos públicos.</p></div><div class="proposal-card"><div class="num">02</div><h3>Identidad y coherencia</h3><p>Aplicar una experiencia visual consistente y alineada con la marca.</p></div><div class="proposal-card"><div class="num">03</div><h3>Autonomía operativa</h3><p>Facilitar que el equipo interno gestione contenidos con seguridad y control.</p></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">03 · Solución propuesta</div><h2>Un ciclo completo de diseño, implementación y puesta en marcha.</h2><p class="lead">La solución se estructura en capacidades complementarias, desde el levantamiento inicial hasta la operación post-productiva.</p><div class="grid-4"><div class="proposal-card"><div class="num">DISCOVERY</div><div class="metric-big">01</div><h3>Arquitectura</h3><p>Requerimientos, sitemap, árbol de contenidos y rutas de navegación.</p></div><div class="proposal-card"><div class="num">DESIGN</div><div class="metric-big">02</div><h3>UX/UI</h3><p>Wireframes, sistema visual, componentes, responsive y accesibilidad.</p></div><div class="proposal-card"><div class="num">BUILD</div><div class="metric-big">03</div><h3>Implementación</h3><p>Páginas, CMS, formularios, contenidos e integraciones definidas.</p></div><div class="proposal-card"><div class="num">LAUNCH</div><div class="metric-big">04</div><h3>QA + Go Live</h3><p>Pruebas, seguridad, capacitación, publicación y estabilización.</p></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">04 · Arquitectura de trabajo</div><h2>Una ejecución integrada, con responsabilidades y entregables claros.</h2><div class="arch-flow"><div class="arch-box"><b>Levantamiento</b><span>Objetivos, públicos, contenidos, requisitos y dependencias.</span></div><div class="arrow">→</div><div class="arch-box"><b>Diseño & Implementación</b><span>UX/UI, componentes reutilizables, CMS, responsive y accesibilidad.</span></div><div class="arrow">→</div><div class="arch-box"><b>Validación & Producción</b><span>QA, seguridad, UAT, capacitación, Go Live y soporte inicial.</span></div></div><div class="grid-3"><div class="proposal-card"><h3>Diseño centrado en el usuario</h3><p>Priorización de rutas y contenidos según necesidades reales.</p></div><div class="proposal-card"><h3>Validación por hitos</h3><p>Revisiones progresivas que reducen observaciones tardías.</p></div><div class="proposal-card"><h3>Gestión de cambios</h3><p>Control de impacto, esfuerzo, plazo, costo y dependencias.</p></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">05 · Roadmap</div><h2>Plan de implementación de referencia en <em>16 semanas.</em></h2><p class="lead">Las etapas pueden ejecutarse parcialmente en paralelo cuando las dependencias lo permitan.</p><div class="roadmap"><div class="road-step"><b>Sem. 1–2</b><span>Kickoff y Discovery</span></div><div class="road-step"><b>Sem. 2–6</b><span>Arquitectura, UX y diseño visual</span></div><div class="road-step"><b>Sem. 6–11</b><span>Implementación y contenidos</span></div><div class="road-step"><b>Sem. 10–14</b><span>QA, seguridad y UAT</span></div><div class="road-step"><b>Sem. 15–16</b><span>Go Live y estabilización</span></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">06 · Equipo</div><h2>Especialistas para acompañar cada etapa del proyecto.</h2><p class="lead">El modelo combina gobierno del proyecto, experiencia de usuario e implementación técnica.</p><div class="team-grid"><div class="team-card"><div class="team-icon">PM</div><span>Liderazgo</span><h3>Jefatura de Proyecto</h3><p>Planificación, coordinación, seguimiento, riesgos, entregables y relación con la contraparte.</p></div><div class="team-card"><div class="team-icon">UX</div><span>Experiencia</span><h3>Diseño UX/UI</h3><p>Arquitectura de información, wireframes, experiencia, accesibilidad y diseño responsivo.</p></div><div class="team-card"><div class="team-icon">DEV</div><span>Implementación</span><h3>Desarrollo Web</h3><p>Construcción, configuración, carga de contenidos, pruebas y ajustes previos a producción.</p></div></div></div>',
 '<div class="slide-inner"><div class="slide-kicker">07 · Inversión</div><h2>Una propuesta diseñada para avanzar con claridad comercial.</h2><div class="price-layout"><div class="price-card"><div class="label">Inversión del proyecto</div><div class="price-value">A definir</div><p>En la versión productiva, esta sección se alimentará con los valores específicos de cada oportunidad y podrá incluir alternativas, mensualidades y condiciones comerciales.</p><div class="check-list"><div class="check">Alcance y entregables definidos</div><div class="check">Hitos de aprobación y cronograma</div><div class="check">Condiciones comerciales asociadas a la propuesta</div></div></div><div class="cta-card"><div><div class="eyebrow">Próximo paso</div><h3>¿Revisamos la propuesta?</h3><p>Desde aquí el cliente puede solicitar una reunión, dejar comentarios o aceptar formalmente en una futura fase.</p></div><button class="btn primary" onclick="toast(\'Solicitud registrada — simulación MVP\')">Solicitar reunión</button></div></div></div>'
 ];
}

(function boot(){
 const params=new URLSearchParams(location.search);
 const id=params.get('proposal');
 if(id&&proposals.some(p=>p.id===id))openGate(id);else renderAdmin();
})();