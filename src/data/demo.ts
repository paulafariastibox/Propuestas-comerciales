import type { Proposal } from "../types";

export const DEMO_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Montserrat,Arial,sans-serif;background:#041327;color:white;display:grid;place-items:center;background-image:radial-gradient(circle at 80% 20%,rgba(18,177,253,.24),transparent 28%)}
main{width:min(1100px,92%);display:grid;grid-template-columns:1.08fr .92fr;gap:52px;align-items:center;padding:50px 0}.ey{font-size:12px;letter-spacing:.18em;color:#FCC703;font-weight:900}.title{font-size:58px;line-height:1.02;font-weight:800;margin:14px 0}.copy{font-size:17px;line-height:1.7;color:#a8bfd2}.cta{display:inline-block;margin-top:20px;background:#FCC703;color:#0a213f;padding:13px 18px;border-radius:12px;font-weight:800;cursor:pointer}.visual{height:390px;border:1px solid rgba(255,255,255,.15);border-radius:30px;position:relative;display:grid;place-items:center;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.01));overflow:hidden}.ring{position:absolute;width:220px;height:220px;border-radius:50%;border:1px solid rgba(18,177,253,.45);animation:pulse 3s ease-in-out infinite}.ring.two{width:315px;height:315px;border-color:rgba(252,199,3,.2)}.core{font-size:28px;letter-spacing:.16em;font-weight:900}.msg{margin-top:14px;color:#64ddff;font-weight:800}@keyframes pulse{50%{transform:scale(1.05);opacity:.65}}@media(max-width:800px){main{grid-template-columns:1fr}.title{font-size:40px}.visual{height:250px}}
</style>
</head>
<body>
<main>
<section><div class="ey">PROPUESTA COMERCIAL · TIBOX</div><div class="title">Una propuesta digital que se siente como una experiencia.</div><div class="copy">Este HTML se ejecuta dentro del visor seguro del Portal de Propuestas. Puede incluir navegación, animaciones, videos, diagramas y llamadas a la acción.</div><div class="cta" onclick="document.getElementById('msg').textContent='Interacción registrada ✓'">Probar interacción</div><div id="msg" class="msg"></div></section>
<div class="visual"><div class="ring"></div><div class="ring two"></div><div class="core">TIBOX</div></div>
</main>
</body></html>`;

export const demoProposals: Proposal[] = [
  {
    id: "demo-001",
    publicToken: "demo-web",
    clientName: "Cliente Demo",
    contactName: "María González",
    contactEmail: "maria@cliente-demo.cl",
    kamName: "Paula Farias",
    opportunityNumber: "OP-2026-082",
    title: "Plan de Fortalecimiento Tecnológico",
    status: "viewed",
    accessType: "pin",
    format: "html",
    expiresAt: "2026-10-29",
    createdAt: "2026-09-29",
    views: 4,
    lastViewedAt: "2026-09-29T09:12:00-03:00",
    contentHtml: DEMO_HTML
  },
  {
    id: "demo-002",
    publicToken: "demo-pdf",
    clientName: "Empresa Portuaria Demo",
    contactName: "Juan Pérez",
    contactEmail: "juan@empresa-demo.cl",
    kamName: "Estela Astudillo",
    opportunityNumber: "OP-2026-074",
    title: "Modernización y Seguridad TI",
    status: "sent",
    accessType: "otp",
    format: "pdf",
    expiresAt: "2026-10-28",
    createdAt: "2026-09-28",
    views: 0
  }
];
