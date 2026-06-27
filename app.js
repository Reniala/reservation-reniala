const RESERVE = {
  name: "RESERVE RENIALA",
  details: "R.C N A00263, Stat 01299512000000018, NIF: 2000642034",
  bank: "BFV - SG Tulear, 00710/05001-005825-60",
  address: "BP 58 Tulear Mangily 601 Madagascar",
  email: "info@reniala-madagascar.com",
  salesTerms: [
    "La reservation pourra etre annulee jusqu'a 15 jours avant la date de la prestation.",
    "De 10 a 14 jours avant l'arrivee : 50% des prestations restent dues.",
    "De 9 jours ou moins avant l'arrivee : 100% des prestations restent dues.",
    "Aucune entree ne sera renegociee ni revue en termes de tarification pour des raisons climatiques ou en raison de l'annulation d'une prestation."
  ]
};

const NAV = [
  ["dashboard", "Tableau de bord"],
  ["pipeline", "Pipeline"],
  ["clients", "Clients"],
  ["products", "Produits"],
  ["orders", "Commandes"],
  ["billing", "Facturation"],
  ["calendar", "Calendrier"]
];

const PRODUCTS = [
  { name: "Premier circuit", price: 40000, category: "Circuit" },
  { name: "Groupe premier circuit", price: 35000, category: "Circuit" },
  { name: "Second circuit", price: 45000, category: "Circuit" },
  { name: "Groupe second circuit", price: 40000, category: "Circuit" },
  { name: "Village des tortues", price: 40000, category: "Activite" },
  { name: "Visite nocturne", price: 65000, category: "Activite" },
  { name: "Ornithologie Reserve Reniala", price: 65000, category: "Activite" },
  { name: "Ornithologie Anakao/Tsinjoriaky/Saint-Augustin", price: 145000, category: "Activite" },
  { name: "Animation Folklorique", price: 175000, category: "Activite" },
  { name: "Activite plantation de Baobab", price: 25000, category: "Activite" },
  { name: "Massage Bien etre", price: 80000, category: "Activite" },
  { name: "Baobab Party droit d'entree", price: 35000, category: "Activite" },
  { name: "Baobab Party droit d'entree Tarif groupe", price: 40000, category: "Activite" },
  { name: "Conference Plantes Medicinales et Cosmetiques", price: 80000, category: "Activite" },
  { name: "Journee d'Impregnation Reserve Reniala", price: 155000, category: "Activite" },
  { name: "Balade snorkeling", price: 110000, category: "Activite" },
  { name: "Location masque tuba palme", price: 27000, category: "Activite" },
  { name: "Balade pique-nique langouste", price: 85000, category: "Activite" },
  { name: "Balade pique-nique poisson", price: 75000, category: "Activite" },
  { name: "Balade pique-nique poulet", price: 75000, category: "Activite" },
  { name: "Aeroport - Reniala", price: 200000, category: "Activite" },
  { name: "Tulear - Reniala", price: 180000, category: "Activite" },
  { name: "Transferts hotel - Reniala - hotel", price: 0, category: "Activite" },
  { name: "Transferts en charrette", price: 25000, category: "Activite" },
  { name: "Chambres rez-de-chaussee", price: 70000, category: "Hebergement" },
  { name: "Chambres mezzanine", price: 55000, category: "Hebergement" },
  { name: "Lit supplementaire", price: 10000, category: "Hebergement" },
  { name: "Bungalow", price: 80000, category: "Hebergement" },
  { name: "Petit dejeuner continental", price: 17500, category: "Restaurant" },
  { name: "Petit dejeuner americain", price: 20000, category: "Restaurant" },
  { name: "Menu", price: 45000, category: "Restaurant" },
  { name: "Cocktail de bienvenue", price: 8000, category: "Restaurant" },
  { name: "Baobab Party Menu", price: 65000, category: "Restaurant" }
];

const seed = {
  user: null,
  clients: [
    { id: uid(), name: "Tropic Tours", address: "Tulear, Madagascar", rc: "RC-247", nif: "300145", stat: "STAT-TOUR", email: "booking@tropictours.mg", phone: "+261 34 00 000 01" },
    { id: uid(), name: "Famille Martin", address: "12 rue des Acacias, Lyon", rc: "", nif: "", stat: "", email: "martin@example.com", phone: "+33 6 22 44 55 11" }
  ],
  products: PRODUCTS.map((p, index) => ({ id: `P${index + 1}`, ...p })),
  mails: [
    { id: uid(), from: "booking@tropictours.mg", subject: "Demande reservation groupe premier circuit", received: today(-1), status: "en attente", body: "Bonjour, nous souhaitons reserver pour 12 visiteurs le groupe premier circuit le mois prochain. Merci de nous envoyer un devis.", clientId: null },
    { id: uid(), from: "martin@example.com", subject: "Reservation bungalow et visite nocturne", received: today(-3), status: "traite", body: "Bonjour, deux adultes souhaitent une nuit en bungalow et une visite nocturne.", clientId: null }
  ],
  orders: []
};

let state = loadState();
let currentView = "dashboard";
let calendarYear = new Date().getFullYear();
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !byId("modalRoot").classList.contains("hidden")) closeModal();
  });
  buildNav();
  if (state.user) enterApp();
});

function loadState() {
  const saved = localStorage.getItem("renialaAppState");
  return saved ? JSON.parse(saved) : structuredClone(seed);
}
function saveState() { localStorage.setItem("renialaAppState", JSON.stringify(state)); }
function uid() { return Math.random().toString(36).slice(2, 9); }
function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
function fmtMoney(value) { return `${Number(value || 0).toLocaleString("fr-FR")} Ar`; }
function byId(id) { return document.getElementById(id); }
function clientName(id) { return state.clients.find(c => c.id === id)?.name || "Client a completer"; }
function product(id) { return state.products.find(p => p.id === id); }
function orderTotal(order) { return order.items.reduce((sum, item) => sum + item.qty * item.price, 0); }
function orderPaid(order) { return (order.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0); }
function cancellationRate(order) {
  const days = daysBetween(today(), order.serviceDate);
  if (order.status !== "Annulee") return 1;
  if (days >= 15) return 0;
  if (days >= 10) return 0.5;
  return 1;
}
function billableTotal(order) {
  return order.status === "Annulee" ? Math.round(orderTotal(order) * cancellationRate(order)) : orderTotal(order);
}
function orderBalance(order) { return Math.max(billableTotal(order) - orderPaid(order), 0); }
function orderCredit(order) { return Math.max(orderPaid(order) - billableTotal(order), 0); }
function paymentStatus(order) {
  if (order.status === "Annulee" && orderCredit(order) > 0) return "avoir a emettre";
  if (order.status === "Annulee" && billableTotal(order) === 0) return "rien a facturer";
  if (orderBalance(order) <= 0 && billableTotal(order) > 0) return "payee";
  if (orderPaid(order) > 0) return "acompte";
  return "a payer";
}
function syncBilling(order) {
  order.invoiceStatus = paymentStatus(order);
  order.billingSummary = order.status === "Annulee" && billableTotal(order) === 0 ? "Rien a facturer" : (order.invoiceStatus === "payee" ? "Entierement facture" : "A facturer");
  return order;
}

function login(event) {
  event.preventDefault();
  const email = byId("loginEmail").value.trim().toLowerCase();
  const code = byId("loginCode").value.trim();
  if (email === "admin@reniala-madagascar.com" && code === "2026") {
    state.user = { email, role: "Administrateur principal" };
  } else if (email === "equipe@reniala-madagascar.com" && code === "601") {
    state.user = { email, role: "Employe calendrier" };
    currentView = "calendar";
  } else {
    alert("Adresse mail ou code incorrect.");
    return;
  }
  saveState();
  enterApp();
}

function logout() {
  state.user = null;
  saveState();
  byId("appView").classList.add("hidden");
  byId("loginView").classList.remove("hidden");
}

function enterApp() {
  byId("loginView").classList.add("hidden");
  byId("appView").classList.remove("hidden");
  byId("roleBadge").textContent = state.user.role;
  buildNav();
  render();
}

function buildNav() {
  const nav = byId("mainNav");
  if (!nav) return;
  const employee = state.user?.role === "Employe calendrier";
  nav.innerHTML = NAV.filter(([id]) => !employee || id === "calendar").map(([id, label]) => `
    <button class="${id === currentView ? "active" : ""}" data-view="${id}">
      <span>${label}</span><span>${countFor(id)}</span>
    </button>
  `).join("");
  nav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    currentView = btn.dataset.view;
    render();
  }));
}

function countFor(id) {
  if (id === "pipeline") return state.mails.filter(m => m.status !== "regle").length;
  if (id === "clients") return state.clients.length;
  if (id === "orders") return state.orders.length;
  if (id === "billing") return state.orders.filter(o => paymentStatus(o) !== "payee").length;
  return "";
}

function render() {
  NAV.forEach(([id]) => byId(id).classList.toggle("hidden", id !== currentView));
  const label = NAV.find(([id]) => id === currentView)?.[1] || "";
  byId("sectionKicker").textContent = label;
  byId("sectionTitle").textContent = titles[currentView];
  buildNav();
  renderers[currentView]();
}

const titles = {
  dashboard: "Pilotage reservations",
  pipeline: "Mails, devis et confirmations",
  clients: "Fichier clients",
  products: "Prestations et tarifs",
  orders: "Reservations et commandes",
  billing: "Factures et paiements",
  calendar: "Calendrier des prestations"
};

const renderers = { dashboard: renderDashboard, pipeline: renderPipeline, clients: renderClients, products: renderProducts, orders: renderOrders, billing: renderBilling, calendar: renderCalendar };

function renderDashboard() {
  const weekOrders = state.orders.filter(o => daysBetween(o.orderDate, today()) <= 7);
  const monthOrders = state.orders.filter(o => new Date(o.orderDate).getMonth() === new Date().getMonth());
  const revenue = state.orders.filter(o => o.status !== "Annulee").reduce((s, o) => s + orderTotal(o), 0);
  const topProducts = {};
  state.orders.forEach(o => o.items.forEach(i => topProducts[product(i.productId)?.name || "Produit"] = (topProducts[product(i.productId)?.name || "Produit"] || 0) + i.qty));
  const rows = Object.entries(topProducts).sort((a,b) => b[1]-a[1]).slice(0,5);
  byId("dashboard").innerHTML = `
    <div class="grid cols-4">
      ${metric("Commandes semaine", weekOrders.length)}
      ${metric("Commandes mois", monthOrders.length)}
      ${metric("CA confirme", fmtMoney(revenue))}
      ${metric("Mails en attente", state.mails.filter(m => m.status === "en attente").length)}
    </div>
    <div class="grid cols-2" style="margin-top:16px">
      <div class="card card-pad"><h3>Produits les plus demandes</h3>${rows.length ? table(["Produit","Quantite"], rows) : empty("Aucune commande encore.")}</div>
      <div class="card card-pad"><h3>Suivi facturation</h3>${table(["Statut","Nombre"], [
        ["Entierement facture", state.orders.filter(o => paymentStatus(o) === "payee").length],
        ["Acompte recu", state.orders.filter(o => paymentStatus(o) === "acompte").length],
        ["A payer", state.orders.filter(o => paymentStatus(o) === "a payer").length],
        ["Rien a facturer", state.orders.filter(o => o.status === "Annulee").length]
      ])}</div>
    </div>`;
}

function metric(label, value) {
  return `<div class="card card-pad metric"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderPipeline() {
  byId("pipeline").innerHTML = `
    <div class="toolbar">
      <div class="filters">
        <button id="newMailBtn">Ajouter un mail recu</button>
      </div>
      <button class="secondary" id="resetDemoBtn">Reinitialiser demo</button>
    </div>
    <div class="split">
      <div class="list">${state.mails.map(mailCard).join("")}</div>
      <div class="card card-pad">
        <h3>Modele de reponse</h3>
        <p class="muted">Chaque document reprend le numero de commande et peut etre imprime en PDF depuis la fenetre document.</p>
        <div class="notice">${responseTemplate("proforma", "CMD-EXEMPLE")}</div>
      </div>
    </div>`;
  byId("newMailBtn").addEventListener("click", () => openMailModal());
  byId("resetDemoBtn").addEventListener("click", () => { if (confirm("Remettre les donnees de demonstration ?")) { state = structuredClone(seed); saveState(); render(); } });
  document.querySelectorAll("[data-mail-action]").forEach(btn => btn.addEventListener("click", handleMailAction));
}

function mailCard(mail) {
  return `<article class="card mail-card">
    <div class="row space">
      <strong>${mail.subject}</strong>
      ${statusPill(mail.status)}
    </div>
    <div class="muted">${mail.from} - recu le ${mail.received}</div>
    <p>${mail.body}</p>
    <div class="row">
      <button class="small" data-mail-action="quote" data-id="${mail.id}">Etablir devis</button>
      <button class="small secondary" data-mail-action="proforma" data-id="${mail.id}">Proforma</button>
      <button class="small secondary" data-mail-action="reply" data-id="${mail.id}">Repondre</button>
      <button class="small warning" data-mail-action="waiting" data-id="${mail.id}">En attente</button>
      <button class="small" data-mail-action="paid" data-id="${mail.id}">Regle</button>
    </div>
  </article>`;
}

function handleMailAction(event) {
  const mail = state.mails.find(m => m.id === event.currentTarget.dataset.id);
  const action = event.currentTarget.dataset.mailAction;
  if (action === "quote" || action === "proforma") return openOrderModal({ mail, docType: action === "quote" ? "devis" : "proforma" });
  if (action === "reply") return openReplyModal(mail, "devis", null);
  mail.status = action === "paid" ? "regle" : "en attente";
  saveState();
  render();
}

function renderClients() {
  byId("clients").innerHTML = `
    <div class="toolbar"><button id="newClientBtn">Nouveau client</button></div>
    <div class="card">${table(["Nom","Mail","Telephone","RC","NIF","Stat",""], state.clients.map(c => [
      c.name, c.email, c.phone, c.rc || "-", c.nif || "-", c.stat || "-",
      `<button class="small secondary" data-client="${c.id}">Modifier</button>`
    ]))}</div>`;
  byId("newClientBtn").addEventListener("click", () => openClientModal());
  document.querySelectorAll("[data-client]").forEach(btn => btn.addEventListener("click", () => openClientModal(state.clients.find(c => c.id === btn.dataset.client))));
}

function renderProducts() {
  byId("products").innerHTML = `
    <div class="toolbar"><button id="newProductBtn">Nouvelle prestation</button></div>
    <div class="card">${table(["Categorie","Intitule","Prix Ariary",""], state.products.map(p => [
      p.category, p.name, fmtMoney(p.price), `<button class="small secondary" data-product="${p.id}">Modifier</button>`
    ]))}</div>`;
  byId("newProductBtn").addEventListener("click", () => openProductModal());
  document.querySelectorAll("[data-product]").forEach(btn => btn.addEventListener("click", () => openProductModal(state.products.find(p => p.id === btn.dataset.product))));
}

function renderOrders() {
  byId("orders").innerHTML = `
    <div class="toolbar"><button id="newOrderBtn">Nouvelle commande</button></div>
    <div class="grid cols-3">
      ${orderColumn("Reservee")}
      ${orderColumn("Annulee")}
      ${orderColumn("Retournee")}
    </div>`;
  byId("newOrderBtn").addEventListener("click", () => openOrderModal({}));
  document.querySelectorAll("[data-order-doc]").forEach(btn => btn.addEventListener("click", () => openDocumentModal(state.orders.find(o => o.id === btn.dataset.orderDoc), btn.dataset.type)));
  document.querySelectorAll("[data-order-edit]").forEach(btn => btn.addEventListener("click", () => openOrderModal({ order: state.orders.find(o => o.id === btn.dataset.orderEdit) })));
  document.querySelectorAll("[data-order-payment]").forEach(btn => btn.addEventListener("click", () => openPaymentModal(state.orders.find(o => o.id === btn.dataset.orderPayment))));
  document.querySelectorAll("[data-order-status]").forEach(btn => btn.addEventListener("change", e => updateOrderStatus(btn.dataset.orderStatus, e.target.value)));
}

function orderColumn(status) {
  const orders = state.orders.filter(o => o.status === status);
  return `<div class="card card-pad"><h3>${status}</h3><div class="list">${orders.map(orderCard).join("") || empty("Aucune commande.")}</div></div>`;
}

function orderCard(order) {
  return `<article class="order-card card">
    <div class="row space"><strong>${order.number}</strong>${statusPill(order.status)}</div>
    <div>${clientName(order.clientId)} - ${order.tourName || "Tour non renseigne"}</div>
    <div class="muted">Prestation: ${order.serviceDate} - Total ${fmtMoney(orderTotal(order))}</div>
    <div class="muted">${order.status === "Annulee" ? `Frais annulation ${Math.round(cancellationRate(order) * 100)}%: ${fmtMoney(billableTotal(order))} - ` : ""}Paye ${fmtMoney(orderPaid(order))} - Reste ${fmtMoney(orderBalance(order))}${orderCredit(order) ? ` - Avoir ${fmtMoney(orderCredit(order))}` : ""}</div>
    <label>Statut commande
      <select data-order-status="${order.id}">
        ${["Reservee","Annulee","Retournee"].map(s => `<option ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
      </select>
    </label>
    <div class="row">
      <button class="small secondary" data-order-edit="${order.id}">Modifier</button>
      <button class="small secondary" data-order-payment="${order.id}">Paiement</button>
      <button class="small" data-order-doc="${order.id}" data-type="proforma">Proforma</button>
      <button class="small" data-order-doc="${order.id}" data-type="facture">Facture</button>
      ${order.status === "Annulee" ? `<button class="small warning" data-order-doc="${order.id}" data-type="annulation">Facture annulation</button>${orderCredit(order) ? `<button class="small secondary" data-order-doc="${order.id}" data-type="avoir">Avoir</button>` : ""}` : ""}
    </div>
  </article>`;
}

function renderBilling() {
  state.orders.forEach(syncBilling);
  const rows = state.orders.map(o => [
    o.number,
    clientName(o.clientId),
    fmtMoney(orderTotal(o)),
    o.status === "Annulee" ? fmtMoney(billableTotal(o)) : "-",
    fmtMoney(orderPaid(o)),
    fmtMoney(orderBalance(o)),
    orderCredit(o) ? fmtMoney(orderCredit(o)) : "-",
    paymentStatus(o),
    o.billingSummary,
    `<button class="small secondary" data-payment="${o.id}">Paiement / acompte</button> <button class="small" data-invoice="${o.id}" data-type="facture">Facture</button>${o.status === "Annulee" ? ` <button class="small warning" data-invoice="${o.id}" data-type="annulation">Facture annulation</button>${orderCredit(o) ? ` <button class="small secondary" data-invoice="${o.id}" data-type="avoir">Avoir</button>` : ""}` : ""}`
  ]);
  saveState();
  byId("billing").innerHTML = `<div class="card">${table(["Commande","Client","Montant initial","Frais annulation","Paye","Reste","Avoir","Paiement","Facturation",""], rows)}</div>`;
  document.querySelectorAll("[data-invoice]").forEach(btn => btn.addEventListener("click", () => openDocumentModal(state.orders.find(o => o.id === btn.dataset.invoice), btn.dataset.type || "facture")));
  document.querySelectorAll("[data-payment]").forEach(btn => btn.addEventListener("click", () => openPaymentModal(state.orders.find(o => o.id === btn.dataset.payment))));
}

function renderCalendar() {
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1);
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
  byId("calendar").innerHTML = `
    <div class="toolbar">
      <div class="filters">
        <span class="pill">Employes: consultation reservation + arrivee / retour</span>
      </div>
    </div>
    <div class="calendar-grid">${days.map(day => calendarDay(day)).join("")}</div>`;
  document.querySelectorAll("[data-calendar-detail]").forEach(btn => btn.addEventListener("click", () => openReservationDetailModal(state.orders.find(o => o.id === btn.dataset.calendarDetail))));
  document.querySelectorAll("[data-arrival]").forEach(btn => btn.addEventListener("click", () => updateVisitState(btn.dataset.arrival, "visiteurs arrives")));
  document.querySelectorAll("[data-return]").forEach(btn => btn.addEventListener("click", () => updateVisitState(btn.dataset.return, "retour")));
}

function calendarDay(day) {
  const events = state.orders.filter(o => o.status === "Reservee" && orderOccursOnDay(o, day));
  return `<div class="day">
    <strong>${new Date(day + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" })}</strong>
    ${events.map(o => `<div class="event ${o.visitState === "retour" ? "done" : ""}">
      <strong>${clientName(o.clientId)}</strong><br>${o.tourName || "Reservation"}<br>${firstScheduleForDay(o, day)}<br>${statusPill(o.visitState || "attendu")}
      <div class="row" style="margin-top:6px">
        <button class="small secondary" data-calendar-detail="${o.id}">Voir details</button>
        <button class="small secondary" data-arrival="${o.id}">Enleves</button>
        <button class="small secondary" data-return="${o.id}">Retour</button>
      </div>
    </div>`).join("")}
  </div>`;
}

function openReservationDetailModal(order) {
  if (!order) return;
  const client = state.clients.find(c => c.id === order.clientId) || {};
  modal(`<div class="row space">
      <h3>Reservation ${order.number}</h3>
      <button type="button" class="secondary" data-close>Fermer</button>
    </div>
    <div class="reservation-detail">
      <div class="detail-grid">
        <section class="card card-pad">
          <h3>Client</h3>
          <strong>${client.name || clientName(order.clientId)}</strong><br>
          ${client.phone || ""}<br>
          ${client.email || ""}<br>
          ${client.address || ""}
        </section>
        <section class="card card-pad">
          <h3>Reservation</h3>
          <strong>${order.tourName || "Tour non renseigne"}</strong><br>
          Representant: ${order.representative || "-"}<br>
          Reference client: ${order.clientRef || "-"}<br>
          Statut: ${order.status} / ${order.visitState || "attendu"}
        </section>
      </div>
      <section class="card card-pad">
        <h3>Prestations reservees</h3>
        <div class="list">
          ${(order.items || []).map(item => readonlyServiceHtml(item)).join("") || empty("Aucune prestation renseignee.")}
        </div>
      </section>
      ${specialInfoHtml(order.specialInfo)}
      <div class="notice">Consultation en lecture seule. Les employes peuvent seulement marquer les visiteurs enleves ou retournes depuis le calendrier.</div>
    </div>`);
}

function readonlyServiceHtml(item) {
  return `<div class="readonly-service">
    <strong>${product(item.productId)?.name || "Prestation"}</strong>
    <span>${formatFrenchDate(item.date)} ${formatTimeSeconds(item.startTime) || "heure debut ?"} au ${formatTimeSeconds(item.endTime) || "heure fin ?"}</span><br>
    Quantite: ${item.qty || 0}
  </div>`;
}

function orderOccursOnDay(order, day) {
  return order.serviceDate === day || (order.items || []).some(item => item.date === day);
}

function firstScheduleForDay(order, day) {
  const item = (order.items || []).find(line => line.date === day) || (order.items || [])[0];
  return item ? `${formatTimeSeconds(item.startTime) || "heure ?"} - ${formatTimeSeconds(item.endTime) || "heure ?"}` : "horaire a confirmer";
}

function openMailModal(mail = {}) {
  modal(`<h3>Nouveau mail recu</h3>
    <form id="mailForm" class="form-grid">
      <label>Expediteur<input name="from" type="email" value="${mail.from || ""}" required></label>
      <label>Date reception<input name="received" type="date" value="${mail.received || today()}" required></label>
      <label class="wide">Objet<input name="subject" value="${mail.subject || ""}" required></label>
      <label class="wide">Message<textarea name="body" required>${mail.body || ""}</textarea></label>
      <div class="row wide"><button>Enregistrer</button><button type="button" class="secondary" data-close>Fermer</button></div>
    </form>`);
  byId("mailForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    state.mails.unshift({ id: uid(), status: "en attente", clientId: null, ...data });
    saveState();
    closeModal();
    render();
  });
}

function openClientModal(client = {}) {
  modal(`<h3>${client.id ? "Modifier" : "Nouveau"} client</h3>
    <form id="clientForm" class="form-grid">
      ${input("name", "Nom", client.name, true)}
      ${input("email", "Mail", client.email, true, "email")}
      ${input("phone", "Telephone", client.phone)}
      ${input("address", "Adresse postale", client.address)}
      ${input("rc", "RC", client.rc)}
      ${input("nif", "NIF", client.nif)}
      ${input("stat", "N statistique", client.stat)}
      <div class="row wide"><button>Enregistrer</button><button type="button" class="secondary" data-close>Fermer</button></div>
    </form>`);
  byId("clientForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (client.id) Object.assign(client, data);
    else state.clients.push({ id: uid(), ...data });
    saveState();
    closeModal();
    render();
  });
}

function openProductModal(p = {}) {
  modal(`<h3>${p.id ? "Modifier" : "Nouvelle"} prestation</h3>
    <form id="productForm" class="form-grid">
      ${input("name", "Intitule", p.name, true)}
      ${input("category", "Categorie", p.category || "Activite", true)}
      ${input("price", "Prix Ariary", p.price || 0, true, "number")}
      <div class="row wide"><button>Enregistrer</button><button type="button" class="secondary" data-close>Fermer</button></div>
    </form>`);
  byId("productForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = Number(data.price);
    if (p.id) Object.assign(p, data);
    else state.products.push({ id: uid(), ...data });
    saveState();
    closeModal();
    render();
  });
}

function openOrderModal({ mail = null, order = null, docType = "devis" }) {
  const o = order || {
    id: uid(),
    number: `CMD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(4, "0")}`,
    clientId: state.clients[0]?.id,
    representative: "",
    clientRef: "",
    tourName: "",
    orderDate: today(),
    serviceDate: today(14),
    specialInfo: "",
    status: "Reservee",
    invoiceStatus: "a payer",
    billingSummary: "A facturer",
    paymentTerms: "Immediat",
    payments: [],
    visitState: "attendu",
    sourceMailId: mail?.id || null,
    items: [{ productId: state.products[0]?.id, qty: 1, price: state.products[0]?.price || 0, date: today(14), startTime: "08:00", endTime: "10:00" }]
  };
  modal(`<h3>${order ? "Modifier commande" : "Creer " + docType}</h3>
    <form id="orderForm" class="grid">
      <div class="form-grid">
        <label>Client<select name="clientId">${state.clients.map(c => `<option value="${c.id}" ${c.id === o.clientId ? "selected" : ""}>${c.name}</option>`).join("")}</select></label>
        ${input("representative", "Representant", o.representative)}
        ${input("clientRef", "Reference client", o.clientRef)}
        ${input("tourName", "Nom du tour", o.tourName)}
        ${input("orderDate", "Date commande", o.orderDate, true, "date")}
        ${input("serviceDate", "Date prestation", o.serviceDate, true, "date")}
        <label>Statut commande<select name="status">${["Reservee","Annulee","Retournee"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Conditions de paiement<select name="paymentTerms">${["Immediat","Acompte puis solde","Paiement a l'arrivee","Paiement apres la prestation","Virement avant prestation","Par virement bancaire"].map(s => `<option ${s === (o.paymentTerms || "Immediat") ? "selected" : ""}>${s}</option>`).join("")}</select></label>
        <div class="wide">
          <div class="row space" style="margin-bottom:6px">
            <label style="flex:1">Informations particulieres</label>
            <button type="button" class="secondary small" id="insertNotesTemplateBtn">Inserer modele notes</button>
          </div>
          <textarea name="specialInfo" style="min-height:210px;width:100%">${o.specialInfo || ""}</textarea>
        </div>
      </div>
      <div>
        <div class="row space"><h3>Produits</h3><button type="button" class="secondary small" id="addLineBtn">Ajouter ligne</button></div>
        <div id="lineItems" class="line-items"></div>
      </div>
      <div class="notice" id="cancelNotice"></div>
      <div class="row"><button>Enregistrer</button><button type="button" class="secondary" id="previewDocBtn">Apercu document</button><button type="button" class="secondary" data-close>Fermer</button></div>
    </form>`);
  let items = structuredClone(o.items);
  const renderLines = () => {
    byId("lineItems").innerHTML = items.map((it, index) => lineItemHtml(it, index)).join("");
    byId("cancelNotice").innerHTML = cancellationText(byId("orderForm").elements.serviceDate.value);
    document.querySelectorAll("[data-line-product]").forEach(sel => sel.addEventListener("change", e => {
      const index = Number(e.target.dataset.lineProduct);
      items[index].productId = e.target.value;
      items[index].price = product(e.target.value)?.price || 0;
      renderLines();
    }));
    document.querySelectorAll("[data-line-qty]").forEach(inputEl => inputEl.addEventListener("input", e => items[Number(e.target.dataset.lineQty)].qty = Number(e.target.value || 0)));
    document.querySelectorAll("[data-line-price]").forEach(inputEl => inputEl.addEventListener("input", e => items[Number(e.target.dataset.linePrice)].price = Number(e.target.value || 0)));
    document.querySelectorAll("[data-line-date]").forEach(inputEl => inputEl.addEventListener("input", e => items[Number(e.target.dataset.lineDate)].date = e.target.value));
    document.querySelectorAll("[data-line-start]").forEach(inputEl => inputEl.addEventListener("input", e => items[Number(e.target.dataset.lineStart)].startTime = e.target.value));
    document.querySelectorAll("[data-line-end]").forEach(inputEl => inputEl.addEventListener("input", e => items[Number(e.target.dataset.lineEnd)].endTime = e.target.value));
    document.querySelectorAll("[data-line-remove]").forEach(btn => btn.addEventListener("click", () => { items.splice(Number(btn.dataset.lineRemove), 1); renderLines(); }));
  };
  renderLines();
  byId("insertNotesTemplateBtn").addEventListener("click", () => {
    const field = byId("orderForm").elements.specialInfo;
    const template = internalNotesTemplate();
    field.value = field.value.trim() ? `${field.value.trim()}\n\n${template}` : template;
    field.focus();
  });
  byId("addLineBtn").addEventListener("click", () => { items.push({ productId: state.products[0]?.id, qty: 1, price: state.products[0]?.price || 0, date: byId("orderForm").elements.serviceDate.value || today(), startTime: "08:00", endTime: "10:00" }); renderLines(); });
  byId("orderForm").elements.serviceDate.addEventListener("change", renderLines);
  byId("previewDocBtn").addEventListener("click", () => openDocumentModal(readOrderForm(o, items), docType, false));
  byId("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    const saved = readOrderForm(o, items);
    syncBilling(saved);
    if (mail) mail.status = "traite";
    if (!state.orders.find(existing => existing.id === saved.id)) state.orders.push(saved);
    else Object.assign(state.orders.find(existing => existing.id === saved.id), saved);
    saveState();
    closeModal();
    render();
  });
}

function readOrderForm(base, items) {
  const data = Object.fromEntries(new FormData(byId("orderForm")));
  return { ...base, ...data, items: structuredClone(items).filter(i => i.productId && i.qty > 0) };
}

function openPaymentModal(order) {
  order.payments = order.payments || [];
  syncBilling(order);
  modal(`<h3>Paiement / acompte - ${order.number}</h3>
    <div class="grid cols-4">
      ${metric("Total commande", fmtMoney(orderTotal(order)))}
      ${metric("Deja paye", fmtMoney(orderPaid(order)))}
      ${metric("Reste a payer", fmtMoney(orderBalance(order)))}
      ${metric("Statut", paymentStatus(order))}
    </div>
    <form id="paymentForm" class="form-grid" style="margin-top:16px">
      <label>Type<select name="type"><option>Acompte</option><option>Solde</option><option>Paiement complet</option></select></label>
      ${input("amount", "Montant Ariary", orderBalance(order), true, "number")}
      ${input("date", "Date paiement", today(), true, "date")}
      <label>Mode<select name="method"><option>Virement bancaire</option><option>Especes</option><option>Carte bancaire</option><option>Mobile money</option><option>Cheque</option></select></label>
      ${input("reference", "Reference paiement", "")}
      <label class="wide">Note<textarea name="note"></textarea></label>
      <div class="row wide"><button>Enregistrer le paiement</button><button type="button" class="secondary" data-close>Fermer</button></div>
    </form>
    <div class="card" style="margin-top:16px">${paymentTable(order)}</div>`);
  byId("paymentForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.id = uid();
    data.amount = Number(data.amount || 0);
    if (data.amount <= 0) {
      alert("Le montant doit etre superieur a zero.");
      return;
    }
    order.payments.push(data);
    syncBilling(order);
    saveState();
    closeModal();
    render();
  });
}

function paymentTable(order) {
  const payments = order.payments || [];
  if (!payments.length) return empty("Aucun paiement enregistre.");
  return table(["Date","Type","Mode","Reference","Montant"], payments.map(p => [p.date, p.type, p.method, p.reference || "-", fmtMoney(p.amount)]));
}

function lineItemHtml(item, index) {
  item.date = item.date || byId("orderForm")?.elements.serviceDate?.value || today();
  item.startTime = item.startTime || "";
  item.endTime = item.endTime || "";
  return `<div class="line-item">
    <div class="line-main">
      <label>Produit<select data-line-product="${index}">${state.products.map(p => `<option value="${p.id}" ${p.id === item.productId ? "selected" : ""}>${p.name}</option>`).join("")}</select></label>
      <label>Qte<input type="number" min="0" data-line-qty="${index}" value="${item.qty}"></label>
      <label>Prix<input type="number" min="0" data-line-price="${index}" value="${item.price}"></label>
      <button type="button" class="danger small" data-line-remove="${index}">X</button>
    </div>
    <div class="line-times">
      <label>Date prestation<input type="date" data-line-date="${index}" value="${item.date}"></label>
      <label>Heure debut<select data-line-start="${index}">${timeOptions(item.startTime)}</select></label>
      <label>Heure fin<select data-line-end="${index}">${timeOptions(item.endTime)}</select></label>
    </div>
  </div>`;
}

function openReplyModal(mail, type, order) {
  const body = responseTemplate(type, order?.number || "CMD-A-COMPLETER");
  modal(`<h3>Reponse mail</h3>
    <p class="muted">A envoyer a ${mail.from}</p>
    <textarea id="replyText" style="width:100%;min-height:180px">${body}</textarea>
    <div class="notice" style="margin-top:12px">Le PDF doit etre joint depuis la fenetre de votre messagerie apres l'avoir enregistre avec le bouton Imprimer / PDF.</div>
    <div class="row" style="margin-top:12px">
      <button id="openMailBtn" type="button">Ouvrir le mail</button>
      <button id="copyReplyBtn" type="button" class="secondary">Copier le texte</button>
      <button class="secondary" data-close>Fermer</button>
    </div>`);
  byId("openMailBtn").addEventListener("click", () => openMailClient(mail.from, `Reserve Reniala - ${labelDoc(type)} ${order?.number || ""}`.trim(), byId("replyText").value));
  byId("copyReplyBtn").addEventListener("click", () => copyText(byId("replyText").value));
}

function openDocumentModal(order, type = "devis", closable = true) {
  const doc = documentHtml(order, type);
  const client = state.clients.find(c => c.id === order.clientId) || {};
  const visibleNumber = documentNumber(order, type);
  modal(`<div class="row space modal-actions"><h3>${labelDoc(type)} ${visibleNumber}</h3><div class="row"><button id="printBtn">Imprimer / PDF</button><button id="sendDocBtn" class="secondary">Envoyer par mail</button><button class="secondary" data-close>Fermer</button></div></div>${doc}`);
  byId("printBtn").addEventListener("click", () => window.print());
  byId("sendDocBtn").addEventListener("click", () => {
    if (!client.email) {
      alert("Ce client n'a pas d'adresse mail renseignee.");
      return;
    }
    const subject = `Reserve Reniala - ${labelDoc(type)} ${visibleNumber}`;
    const body = `${responseTemplate(type, visibleNumber)}\n\nNote: le document PDF doit etre joint au mail apres l'avoir enregistre avec le bouton Imprimer / PDF.`;
    openMailClient(client.email, subject, body);
  });
}

function documentHtml(order, type) {
  const client = state.clients.find(c => c.id === order.clientId) || {};
  const visibleNumber = documentNumber(order, type);
  const totalLabel = type === "avoir" ? "Montant de l'avoir" : type === "annulation" ? "Frais d'annulation facturables" : "Total";
  const totalAmount = type === "avoir" ? orderCredit(order) : type === "annulation" ? billableTotal(order) : orderTotal(order);
  const noticeText = type === "avoir"
    ? "Avoir client emis suite a l'annulation de la reservation et aux paiements deja recus."
    : type === "annulation"
      ? `Facture d'annulation calculee selon les conditions generales de vente (${Math.round(cancellationRate(order) * 100)}% des prestations).`
      : type === "facture" ? "Facture definitive payable selon les conditions convenues." : "Ce document devient une reservation ferme apres confirmation du devis en facture proforma.";
  return `<div class="document-preview">
    <div class="doc-head">
      <div class="doc-logo-block">
        <img class="doc-logo" src="assets/logo-reniala.png" alt="Logo Reserve Reniala">
        <div><strong>${RESERVE.name}</strong><br>${RESERVE.details}<br>${RESERVE.bank}<br>${RESERVE.address}<br>${RESERVE.email}</div>
      </div>
      <div class="doc-client-block">
        <h3>Client :</h3>
        <strong>${client.name || ""}</strong><br>${client.address || ""}<br>${client.email || ""}<br>${client.phone || ""}<br>RC: ${client.rc || "-"}<br>NIF: ${client.nif || "-"}<br>Stat: ${client.stat || "-"}
      </div>
    </div>
    <div class="doc-title">${labelDoc(type)} ${visibleNumber}</div>
    <div class="doc-info-grid">
      <div><strong>Representant:</strong>${order.representative || "-"}</div>
      <div><strong>Reference client:</strong>${order.clientRef || "-"}</div>
      <div><strong>Nom du tour:</strong>${order.tourName || "-"}</div>
    </div>
    <div class="doc-meta">
      <div><h3 class="orange">${type === "facture" ? "Date de la facture" : "Date de la commande"} :</h3>${order.orderDate}</div>
      <div><h3 class="orange">Date d'echeance :</h3>${order.dueDate || order.orderDate}</div>
      <div><h3 class="orange">Origine :</h3>${order.number}</div>
      <div><h3>Vendeur</h3>Reserve Reniala</div>
      <div><h3>Date de prestation</h3>${order.serviceDate}</div>
      <div><h3>Option de paiement</h3>${order.paymentTerms || "Immediat"}</div>
    </div>
    ${table(["Description","Quantite","Prix unitaire","Total"], order.items.map(i => [`${product(i.productId)?.name || "Produit"}${lineScheduleHtml(i)}`, i.qty, fmtMoney(i.price), fmtMoney(i.qty * i.price)]))}
    <div class="doc-payment-communication"><strong>Communication de paiement :</strong> <strong>${visibleNumber}</strong></div>
    ${order.status === "Annulee" ? `<p style="text-align:right"><strong>Montant initial:</strong> ${fmtMoney(orderTotal(order))}<br><strong>Taux applique:</strong> ${Math.round(cancellationRate(order) * 100)}%</p>` : ""}
    <div class="doc-lower-grid">
      <div>${specialInfoHtml(order.specialInfo)}</div>
      <div class="doc-total-panel">
        <div><span>Montant hors taxes</span><strong>${fmtMoney(totalAmount)}</strong></div>
        <div class="total"><span>${totalLabel}</span><strong>${fmtMoney(totalAmount)}</strong></div>
        <div><span>Acompte / paiements recus</span><strong>${fmtMoney(orderPaid(order))}</strong></div>
        ${orderCredit(order) ? `<div><span>Avoir client</span><strong>${fmtMoney(orderCredit(order))}</strong></div>` : ""}
        <div><span>Montant du</span><strong>${fmtMoney(orderBalance(order))}</strong></div>
      </div>
    </div>
    <div class="notice">${noticeText}</div>
    <h3>Conditions generales de vente</h3>
    <ul>
      ${RESERVE.salesTerms.map(term => `<li>${term}</li>`).join("")}
    </ul>
    <p class="muted">${cancellationText(order.serviceDate)}</p>
    <p class="doc-thanks">Nous vous remercions de votre confiance !</p>
    <div class="doc-footer">
      <span>+(261) 034 03 790 40</span>
      <a href="mailto:info@reniala-madagascar.com">info@reniala-madagascar.com</a>
      <a href="https://reniala-ecotourisme.jimdofree.com/">https://reniala-ecotourisme.jimdofree.com/</a>
    </div>
  </div>`;
}

function responseTemplate(type, number) {
  const label = labelDoc(type).toLowerCase();
  return `Bonjour,\n\nVeuillez trouver ci-joint votre ${label} correspondant a la commande ${number}.\n\nNous restons a votre disposition pour toute modification ou information complementaire.\n\nCordialement,\nReserve Reniala`;
}

function internalNotesTemplate() {
  return `Resa faite par : Niry
Client(s) : 6 pax + 1 guide
Guide accompagnateur : Mika - tel :
Informations particulieres :
Attention : 2 vegetariens / 1 allergie banane-amande
Petit dejeuner americain ; extras a regler sur place`;
}

function specialInfoHtml(text) {
  const cleaned = normalizeSpecialInfo(text || "");
  if (!cleaned.trim()) {
    return `<section class="doc-special"><h3>Informations clients et remarques</h3><p>-</p></section>`;
  }
  const rows = cleaned.split("\n").map(line => line.trim()).filter(Boolean);
  const html = rows.map(line => {
    const escaped = escapeHtml(line);
    if (/^\d+\s*[\.-]\s*/.test(line)) {
      return `<h4>${escaped.replace(/^(\d+)\s*[\.-]\s*/, "$1. ")}</h4>`;
    }
    if (/^(notes internes|informations particulieres|remarques complementaires)$/i.test(line.replace(/\s*:\s*$/, ""))) {
      return `<h4>${escaped.replace(/\s*:\s*$/, "")}</h4>`;
    }
    if (/^attention\s*:|^informations particulieres\s*:/i.test(line)) {
      return `<p class="attention"><strong>${escaped}</strong></p>`;
    }
    if (/^(resa faite|resa faite par|client\(s\)|guide accompagnateur|telephone guide|pour le guide|option de paiement)\s*:/i.test(line)) {
      const parts = escaped.split(":");
      return `<p><strong>${parts.shift()}:</strong>${parts.length ? " " + parts.join(":").trim() : ""}</p>`;
    }
    if (/^-/.test(line)) {
      return `<p>${escaped}</p>`;
    }
    return `<p>${escaped}</p>`;
  }).join("");
  return `<section class="doc-special"><h3>Informations clients et remarques</h3>${html}</section>`;
}

function lineScheduleHtml(item) {
  if (!item.date && !item.startTime && !item.endTime) return "";
  const date = formatFrenchDate(item.date);
  const start = formatTimeSeconds(item.startTime);
  const end = formatTimeSeconds(item.endTime);
  if (date && start && end) return `<span class="line-schedule">${date} ${start} au ${end}</span>`;
  if (date && start) return `<span class="line-schedule">${date} ${start}</span>`;
  if (date) return `<span class="line-schedule">${date}</span>`;
  return `<span class="line-schedule">${start || ""}${end ? " au " + end : ""}</span>`;
}

function timeOptions(selected) {
  const normalized = selected ? selected.slice(0, 5) : "";
  const options = ['<option value="">Choisir</option>'];
  for (let hour = 4; hour <= 22; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      if (hour === 22 && minute > 0) continue;
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push(`<option value="${value}" ${value === normalized ? "selected" : ""}>${value}</option>`);
    }
  }
  return options.join("");
}

function formatFrenchDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function formatTimeSeconds(value) {
  if (!value) return "";
  return value.length === 5 ? `${value}:00` : value;
}

function normalizeSpecialInfo(text) {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\s+(Notes internes)/gi, "\n$1")
    .replace(/\s+(Resa faite par\s*:)/gi, "\n$1")
    .replace(/\s+(Guide accompagnateur\s*:)/gi, "\n$1")
    .replace(/\s+(Telephone guide\s*:)/gi, "\n$1")
    .replace(/\s+(Informations particulieres\s*:)/gi, "\n$1")
    .replace(/\s+(Remarques complementaires\s*:)/gi, "\n$1")
    .replace(/\s*(1\s*[\.-]\s*REMARQUES CLIENTS)\s*[-:]\s*/i, "\n$1\n- ")
    .replace(/\s*(2\s*[-.]?\s*Pour le Guide\s*:)\s*/i, "\n$1\n")
    .replace(/\s+(Attention\s*:)/gi, "\n$1")
    .replace(/\s+(\d+\s*[\.-]\s*[A-ZÀ-Ÿ])/g, "\n$1")
    .replace(/\s+(Pour le Guide\s*:)/gi, "\n$1")
    .replace(/\s+(Client\(s\)\s*:)/gi, "\n$1")
    .replace(/\s+(Option de paiement\s*:)/gi, "\n$1")
    .replace(/\s+(Nous vous remercions de votre confiance\s*!?)/gi, "\n$1")
    .replace(/\s+-\s+(Le petit|Les boissons|Les repas)/gi, "\n- $1")
    .replace(/\s+(-\s*\d+\s*clients?\s*:)/gi, "\n$1")
    .replace(/\s+(-\s*1\s*Client\s*:)/gi, "\n$1");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cancellationText(serviceDate) {
  const days = daysBetween(today(), serviceDate);
  if (days >= 15) return "Annulation possible jusqu'a 15 jours avant la prestation.";
  if (days >= 10) return "";
  if (days >= 0) return "Annulation tardive: 100% des prestations restent dues.";
  return "Prestation passee: appliquer les conditions contractuelles.";
}

function daysBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / 86400000);
}

function updateOrderStatus(id, status) {
  const order = state.orders.find(o => o.id === id);
  order.status = status;
  syncBilling(order);
  saveState();
  render();
}
function updateVisitState(id, visitState) {
  const order = state.orders.find(o => o.id === id);
  order.visitState = visitState;
  if (visitState === "retour") order.status = "Retournee";
  saveState();
  render();
}

function statusPill(status) {
  const cls = /payee|regle|retour|arrives|Reservee/i.test(status) ? "ok" : /attente|payer|non|acompte|avoir/i.test(status) ? "warn" : /Annulee/i.test(status) ? "danger" : "";
  return `<span class="pill ${cls}">${status}</span>`;
}
function documentNumber(order, type) {
  const year = (order.orderDate || today()).slice(0, 4);
  const raw = String(order.number || "").match(/(\d+)$/)?.[1] || "1";
  const sequence = raw.padStart(5, "0");
  if (type === "facture") return order.invoiceNumber || `INV/${year}/${sequence}`;
  if (type === "annulation") return order.cancelInvoiceNumber || `INV/${year}/${sequence}-ANN`;
  if (type === "avoir") return order.creditNoteNumber || `AV/${year}/${sequence}`;
  if (type === "proforma") return order.proformaNumber || `PRO/${year}/${sequence}`;
  return order.quoteNumber || order.number;
}
function labelDoc(type) {
  return type === "avoir" ? "Avoir client" : type === "annulation" ? "Facture d'annulation" : type === "facture" ? "Facture" : type === "proforma" ? "Facture proforma" : "Devis";
}
function table(headers, rows) {
  return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}
function empty(text) { return `<p class="muted">${text}</p>`; }
function input(name, labelText, value = "", required = false, type = "text") {
  return `<label>${labelText}<input name="${name}" type="${type}" value="${String(value || "").replaceAll('"', "&quot;")}" ${required ? "required" : ""}></label>`;
}
function openMailClient(to, subject, body) {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const opened = window.open(gmailUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = gmailUrl;
  }
  alert("Gmail va s'ouvrir avec le message prepare. Pensez a joindre le PDF enregistre avant d'envoyer.");
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Texte copie.");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    alert("Texte copie.");
  }
}
function modal(content) {
  byId("modalRoot").innerHTML = `<div class="modal">${content}</div>`;
  byId("modalRoot").classList.remove("hidden");
  byId("modalRoot").onclick = event => {
    if (event.target === byId("modalRoot")) closeModal();
  };
  document.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", closeModal));
}
function closeModal() {
  byId("modalRoot").classList.add("hidden");
  byId("modalRoot").innerHTML = "";
}

