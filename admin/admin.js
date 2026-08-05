const elements = {
  loginCard: document.querySelector('#login-card'),
  loginForm: document.querySelector('#login-form'),
  password: document.querySelector('#admin-password'),
  loginMessage: document.querySelector('#login-message'),
  dashboard: document.querySelector('#dashboard'),
  dashboardMessage: document.querySelector('#dashboard-message'),
  logout: document.querySelector('#logout-button'),
  refresh: document.querySelector('#refresh-button'),
  export: document.querySelector('#export-button'),
  search: document.querySelector('#search-input'),
  body: document.querySelector('#confirmations-body'),
  empty: document.querySelector('#empty-state'),
  lastUpdate: document.querySelector('#last-update'),
  stats: {
    confirmations: document.querySelector('#stat-confirmations'),
    adults: document.querySelector('#stat-adults'),
    children: document.querySelector('#stat-children'),
    total: document.querySelector('#stat-total'),
    declined: document.querySelector('#stat-declined'),
  },
};

let confirmations = [];
let adminPassword = sessionStorage.getItem('mafe-admin-password') || '';

elements.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  adminPassword = elements.password.value;
  await loadConfirmations({ firstLogin: true });
});

elements.logout.addEventListener('click', () => {
  adminPassword = '';
  confirmations = [];
  sessionStorage.removeItem('mafe-admin-password');
  elements.dashboard.hidden = true;
  elements.logout.hidden = true;
  elements.loginCard.hidden = false;
  elements.password.value = '';
  elements.password.focus();
});

elements.refresh.addEventListener('click', () => loadConfirmations());
elements.search.addEventListener('input', renderTable);
elements.export.addEventListener('click', exportCsv);

if (adminPassword) loadConfirmations({ silent: true });

async function loadConfirmations({ firstLogin = false, silent = false } = {}) {
  setLoading(true);
  setMessage(silent ? '' : 'Consultando confirmaciones…');

  try {
    const response = await fetch('/api/admin', {
      headers: { Authorization: `Bearer ${adminPassword}` },
      cache: 'no-store',
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'No fue posible consultar las confirmaciones.');
    }

    confirmations = Array.isArray(result.confirmations) ? result.confirmations : [];
    sessionStorage.setItem('mafe-admin-password', adminPassword);
    elements.loginCard.hidden = true;
    elements.dashboard.hidden = false;
    elements.logout.hidden = false;
    elements.loginMessage.textContent = '';
    const updateTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    setMessage(`Datos actualizados a las ${updateTime}.`);
    if (elements.lastUpdate) {
      elements.lastUpdate.textContent = `${confirmations.length} respuesta${confirmations.length === 1 ? '' : 's'} registrada${confirmations.length === 1 ? '' : 's'} · ${updateTime}`;
    }
    renderStats();
    renderTable();
  } catch (error) {
    if (firstLogin || elements.dashboard.hidden) {
      elements.loginMessage.textContent = error.message;
      elements.password.select();
    } else {
      setMessage(error.message, true);
    }
  } finally {
    setLoading(false);
  }
}

function renderStats() {
  const attending = confirmations.filter((item) => item.attending);
  const adults = sum(attending, 'adults');
  const children = sum(attending, 'children');

  elements.stats.confirmations.textContent = String(attending.length);
  elements.stats.adults.textContent = String(adults);
  elements.stats.children.textContent = String(children);
  elements.stats.total.textContent = String(adults + children);
  elements.stats.declined.textContent = String(confirmations.length - attending.length);
}

function renderTable() {
  const term = elements.search.value.trim().toLocaleLowerCase('es');
  const filtered = confirmations.filter((item) =>
    item.name.toLocaleLowerCase('es').includes(term),
  );

  elements.body.replaceChildren(...filtered.map(buildRow));
  elements.empty.hidden = filtered.length > 0;
}

function buildRow(item) {
  const row = document.createElement('tr');
  const total = item.attending ? item.adults + item.children : 0;
  const values = [
    item.name,
    item.attending ? 'Asistirá' : 'No asistirá',
    item.attending ? item.adults : '—',
    item.attending ? item.children : '—',
    item.attending ? total : '—',
    item.note || '—',
    formatDate(item.created_at),
  ];

  values.forEach((value, index) => {
    const cell = document.createElement('td');

    if (index === 1) {
      const status = document.createElement('span');
      status.className = `status status--${item.attending ? 'yes' : 'no'}`;
      status.textContent = value;
      cell.append(status);
    } else {
      cell.textContent = value;
    }

    if (index === 5) cell.className = 'note-cell';
    row.append(cell);
  });

  return row;
}

function exportCsv() {
  if (!confirmations.length) return;

  const header = ['Nombre', 'Asistirá', 'Adultos', 'Niños', 'Total', 'Mensaje', 'Fecha'];
  const rows = confirmations.map((item) => [
    item.name,
    item.attending ? 'Sí' : 'No',
    item.adults,
    item.children,
    item.adults + item.children,
    item.note || '',
    formatDate(item.created_at),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(toCsvCell).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = `confirmaciones-mafe-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function sum(items, property) {
  return items.reduce((total, item) => total + Number(item[property] || 0), 0);
}

function toCsvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function setLoading(loading) {
  elements.refresh.disabled = loading;
  elements.export.disabled = loading;
  const submit = elements.loginForm.querySelector('button[type="submit"]');
  submit.disabled = loading;
}

function setMessage(message, error = false) {
  elements.dashboardMessage.textContent = message;
  elements.dashboardMessage.style.color = error ? '#a2273f' : '';
}
