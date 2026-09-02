const views = [...document.querySelectorAll("[data-view]")];
const viewButtons = [...document.querySelectorAll("[data-view-target]")];
const toast = document.getElementById("toast");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function switchView(name) {
  views.forEach((view) => view.classList.toggle("is-active", view.dataset.view === name));
  viewButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.viewTarget === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

viewButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewTarget)));

function openModal(markup) {
  modalContent.innerHTML = markup;
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

document.getElementById("searchButton").addEventListener("click", () => {
  openModal(`
    <span class="kicker">Быстрый поиск</span>
    <h2 id="modalTitle">Что нужно найти?</h2>
    <p>В рабочей версии здесь будут павильоны, помещения, документы, сотрудники и инструкции.</p>
    <div class="modal-summary">
      <div><span>Популярное</span><strong>Павильон · пропуск · разгрузка</strong></div>
      <div><span>По проекту</span><strong>Северный ветер</strong></div>
    </div>
    <button class="primary full" onclick="document.getElementById('modalClose').click()">Понятно</button>
  `);
});

document.getElementById("notificationButton").addEventListener("click", () => {
  showToast("2 срока требуют внимания: список группы и транспорт");
});

document.getElementById("profileButton").addEventListener("click", () => showToast("Профиль демонстрационный"));

// Navigation prototype
const routeData = {
  stage: {
    count: 4,
    points: [[150,370],[305,370],[465,370],[607,235]],
    path: "150,370 305,370 465,370 607,288 607,235",
    mobilePoints: [[180,466],[180,400],[180,266],[278,154]],
    mobilePath: "180,466 180,400 180,266 278,154",
    steps: [
      ["Прибыть по адресу", "Валдайский проезд, 16"],
      ["Войти через КПП", "Старт маршрута на карте"],
      ["Подтвердить позицию", "QR-якорь в главной галерее"],
      ["Дойти до павильона", "Назначение отмечено красным"]
    ]
  },
  makeup: {
    count: 4,
    points: [[150,370],[305,370],[465,370],[607,513]],
    path: "150,370 305,370 465,370 607,370 607,452 607,513",
    mobilePoints: [[180,466],[180,400],[180,266],[82,378]],
    mobilePath: "180,466 180,400 180,266 180,378 82,378",
    steps: [
      ["Прибыть по адресу", "Валдайский проезд, 16"],
      ["Войти через КПП", "Старт маршрута на карте"],
      ["Пройти главную галерею", "Ориентируйтесь по QR-точкам"],
      ["Дойти до гримёрных", "Назначение отмечено красным"]
    ]
  },
  cafe: {
    count: 4,
    points: [[150,370],[305,370],[465,370],[776,513]],
    path: "150,370 305,370 465,370 776,370 776,452 776,513",
    mobilePoints: [[180,466],[180,400],[180,266],[278,378]],
    mobilePath: "180,466 180,400 180,266 180,378 278,378",
    steps: [
      ["Прибыть по адресу", "Валдайский проезд, 16"],
      ["Войти через КПП", "Старт маршрута на карте"],
      ["Пройти главную галерею", "Ориентируйтесь по QR-точкам"],
      ["Дойти до кафе", "Назначение отмечено красным"]
    ]
  }
};

let currentRoute = "stage";
let currentRouteStep = -1;
const routePath = document.getElementById("routePath");
const routeDots = document.getElementById("routeDots");
const currentPin = document.getElementById("currentPin");
const mobileRoutePath = document.getElementById("mobileRoutePath");
const mobileRouteDots = document.getElementById("mobileRouteDots");
const mobileCurrentPin = document.getElementById("mobileCurrentPin");
const routeSteps = document.getElementById("routeSteps");
const routeNextButton = document.getElementById("routeNextButton");

function renderRoute(key) {
  currentRoute = key;
  currentRouteStep = -1;
  const route = routeData[key];
  document.getElementById("routeStepCount").textContent = route.count;
  routePath.setAttribute("points", route.path);
  routeDots.innerHTML = route.points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" />`).join("");
  mobileRoutePath.setAttribute("points", route.mobilePath);
  mobileRouteDots.innerHTML = route.mobilePoints.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" />`).join("");
  routeSteps.innerHTML = route.steps.map((step, index) => `
    <li class="${index === 0 ? "is-current" : ""}"><i>${index + 1}</i><span><strong>${step[0]}</strong><small>${step[1]}</small></span></li>
  `).join("");
  currentPin.setAttribute("transform", `translate(${route.points[0][0]} ${route.points[0][1]})`);
  mobileCurrentPin.setAttribute("transform", `translate(${route.mobilePoints[0][0]} ${route.mobilePoints[0][1]})`);
  routeNextButton.textContent = "Начать маршрут";
}

document.getElementById("routeDestination").addEventListener("change", (event) => renderRoute(event.target.value));

routeNextButton.addEventListener("click", () => {
  const route = routeData[currentRoute];
  if (currentRouteStep >= route.steps.length - 1) {
    currentRouteStep = -1;
    renderRoute(currentRoute);
    return;
  }
  currentRouteStep += 1;
  const items = [...routeSteps.querySelectorAll("li")];
  items.forEach((item, index) => {
    item.classList.toggle("is-done", index < currentRouteStep);
    item.classList.toggle("is-current", index === currentRouteStep);
  });
  const point = route.points[Math.min(currentRouteStep, route.points.length - 1)];
  const mobilePoint = route.mobilePoints[Math.min(currentRouteStep, route.mobilePoints.length - 1)];
  currentPin.setAttribute("transform", `translate(${point[0]} ${point[1]})`);
  mobileCurrentPin.setAttribute("transform", `translate(${mobilePoint[0]} ${mobilePoint[1]})`);
  routeNextButton.textContent = currentRouteStep === route.steps.length - 1 ? "Маршрут завершён · начать заново" : "Следующий шаг";
  if (currentRouteStep === route.steps.length - 1) showToast("Вы у цели. Точка подтверждена.");
});

document.getElementById("shareRouteButton").addEventListener("click", async () => {
  const demoLink = "https://demo.gorky.local/route/approved-destination";
  try {
    await navigator.clipboard.writeText(demoLink);
    showToast("Демонстрационная ссылка скопирована");
  } catch {
    showToast("Ссылка: demo.gorky.local/route/approved-destination");
  }
});

let mapZoom = 1;
const mapViewport = document.getElementById("mapViewport");
const mapZoomLabel = document.getElementById("mapZoomLabel");

function setMapZoom(nextZoom) {
  mapZoom = Math.min(1.3, Math.max(0.8, nextZoom));
  mapViewport.style.transform = `scale(${mapZoom})`;
  mapZoomLabel.textContent = `${Math.round(mapZoom * 100)}%`;
}

document.getElementById("mapZoomIn").addEventListener("click", () => setMapZoom(mapZoom + 0.1));
document.getElementById("mapZoomOut").addEventListener("click", () => setMapZoom(mapZoom - 0.1));

document.getElementById("rescanButton").addEventListener("click", () => {
  const cells = Array.from({ length: 49 }, (_, index) => `<i style="opacity:${[0,1,2,6,7,8,12,14,16,20,21,22,24,26,28,30,32,34,36,40,42,43,44,48].includes(index) ? 1 : 0}"></i>`).join("");
  openModal(`
    <span class="kicker">Подтверждение позиции</span>
    <h2 id="modalTitle">QR-якорь у КПП</h2>
    <p>В прототипе сканирование имитируется. В рабочей версии камера подтвердит точную стартовую точку.</p>
    <div class="qr-demo">${cells}</div>
    <button class="primary full" id="confirmQrButton">Подтвердить точку</button>
  `);
  document.getElementById("confirmQrButton").addEventListener("click", () => {
    closeModal();
    showToast("Позиция подтверждена: КПП");
  });
});

// Pavilion booking prototype
const pavilionCards = [...document.querySelectorAll(".pavilion-card")];
document.querySelectorAll("[data-pavilion-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-pavilion-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.pavilionFilter;
    pavilionCards.forEach((card) => card.hidden = filter !== "all" && card.dataset.type !== filter);
  });
});

pavilionCards.forEach((card) => {
  card.addEventListener("click", () => {
    pavilionCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    document.getElementById("selectedPavilionName").textContent = card.dataset.pavilion;
    showToast(`Выбран: ${card.dataset.pavilion}`);
  });
});

const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
let calendarDate = new Date(2026, 9, 1);
let selectedDays = [];
const busyDates = new Set([2,3,4,8,9,15,21,22,23,27]);

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById("calendarMonth").textContent = `${monthNames[month]} ${year}`;
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let index = 0; index < firstWeekday; index += 1) cells.push(`<button class="is-empty" disabled aria-hidden="true"></button>`);
  for (let day = 1; day <= totalDays; day += 1) {
    const isDemoMonth = year === 2026 && month === 9;
    const isBusy = isDemoMonth && busyDates.has(day);
    const key = `${year}-${month}-${day}`;
    const selected = selectedDays.includes(key);
    cells.push(`<button data-calendar-day="${key}" ${isBusy ? "disabled" : ""} class="${isBusy ? "is-busy" : ""} ${selected ? "is-selected" : ""}" aria-label="${day} ${monthNames[month].toLowerCase()}">${day}</button>`);
  }
  document.getElementById("calendarGrid").innerHTML = cells.join("");
  document.querySelectorAll("[data-calendar-day]").forEach((button) => {
    button.addEventListener("click", () => toggleDate(button.dataset.calendarDay));
  });
}

function toggleDate(key) {
  if (selectedDays.includes(key)) {
    selectedDays = selectedDays.filter((day) => day !== key);
  } else if (selectedDays.length < 3) {
    selectedDays.push(key);
  } else {
    selectedDays = [key];
  }
  selectedDays.sort();
  const formatted = selectedDays.map((item) => {
    const [year, month, day] = item.split("-").map(Number);
    return `${day} ${monthNames[month].toLowerCase().slice(0, 3)}`;
  });
  document.getElementById("selectedDatesText").textContent = formatted.length ? formatted.join(", ") : "Выберите даты";
  document.getElementById("bookingRequestButton").disabled = formatted.length === 0;
  renderCalendar();
}

document.getElementById("previousMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  selectedDays = [];
  renderCalendar();
  toggleDateSummary();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  selectedDays = [];
  renderCalendar();
  toggleDateSummary();
});

function toggleDateSummary() {
  document.getElementById("selectedDatesText").textContent = "Выберите даты";
  document.getElementById("bookingRequestButton").disabled = true;
}

document.getElementById("bookingRequestButton").addEventListener("click", () => {
  const pavilion = document.getElementById("selectedPavilionName").textContent;
  const dates = document.getElementById("selectedDatesText").textContent;
  openModal(`
    <span class="kicker">Черновик запроса</span>
    <h2 id="modalTitle">Проверим задачу</h2>
    <p>Слот не бронируется автоматически. Сначала студия проверит даты, характер съёмки и технические требования.</p>
    <div class="modal-summary">
      <div><span>Павильон</span><strong>${pavilion}</strong></div>
      <div><span>Даты</span><strong>${dates}</strong></div>
      <div><span>Проект</span><strong>Северный ветер</strong></div>
      <div><span>Следующий шаг</span><strong>Заполнить техническую задачу</strong></div>
    </div>
    <div class="modal-actions">
      <button class="secondary" id="saveBookingDraft">Сохранить</button>
      <button class="primary" id="continueBooking">Продолжить</button>
    </div>
  `);
  document.getElementById("saveBookingDraft").addEventListener("click", () => {
    localStorage.setItem("gorkyBookingDraft", JSON.stringify({ pavilion, dates }));
    closeModal();
    showToast("Черновик запроса сохранён локально");
  });
  document.getElementById("continueBooking").addEventListener("click", () => {
    closeModal();
    switchView("prep");
    showToast("Даты переданы в демонстрационный план подготовки");
  });
});

renderCalendar();

// Production preparation prototype
const statusOrder = ["todo", "review", "done"];

function updateReadiness() {
  const rows = [...document.querySelectorAll(".requirement-row")];
  const weighted = rows.reduce((sum, row) => sum + (row.dataset.docStatus === "done" ? 1 : row.dataset.docStatus === "review" ? 0.5 : 0), 0);
  const ready = Math.round((weighted / rows.length) * 100);
  const active = rows.filter((row) => row.dataset.docStatus !== "todo").length;
  const todo = rows.length - active;
  document.getElementById("prepScore").textContent = `${ready}%`;
  document.getElementById("readinessScore").textContent = `${ready}%`;
  document.getElementById("scoreRing").style.setProperty("--score", `${ready}%`);
  document.getElementById("sidebarProgress").style.width = `${ready}%`;
  document.getElementById("trackProgress").style.width = `${ready}%`;
  document.getElementById("stripDocs").textContent = `${active} из ${rows.length}`;
  document.getElementById("navPrepCount").textContent = todo;
  document.getElementById("prepSummary").textContent = `${active} из ${rows.length} требований закрыты или находятся на проверке.`;
  document.querySelector(".score-copy h2").textContent = todo ? `До передачи на проверку — ${todo} ${todo === 1 ? "шаг" : todo < 5 ? "шага" : "шагов"}` : "Пакет готов к передаче";
}

function applyStatus(row, status) {
  row.dataset.docStatus = status;
  const check = row.querySelector(".status-check");
  const badge = row.querySelector(".date-status");
  check.className = `status-check ${status === "done" ? "is-done" : status === "review" ? "is-review" : ""}`;
  if (status === "done") {
    badge.className = "date-status done";
    badge.textContent = "Готово";
  } else if (status === "review") {
    badge.className = "date-status review";
    badge.textContent = "На проверке";
  } else {
    badge.className = "date-status urgent";
    badge.textContent = "Нужно сделать";
  }
  updateReadiness();
  localStorage.setItem("gorkyDocStatuses", JSON.stringify([...document.querySelectorAll(".requirement-row")].map((item) => item.dataset.docStatus)));
}

document.querySelectorAll(".status-check").forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".requirement-row");
    const next = statusOrder[(statusOrder.indexOf(row.dataset.docStatus) + 1) % statusOrder.length];
    applyStatus(row, next);
  });
});

const savedStatuses = JSON.parse(localStorage.getItem("gorkyDocStatuses") || "null");
if (Array.isArray(savedStatuses)) {
  [...document.querySelectorAll(".requirement-row")].forEach((row, index) => {
    if (savedStatuses[index]) applyStatus(row, savedStatuses[index]);
  });
}

document.querySelectorAll("[data-doc-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-doc-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.docFilter;
    document.querySelectorAll(".requirement-row").forEach((row) => row.classList.toggle("is-hidden", filter !== "all" && row.dataset.docStatus !== filter));
  });
});

document.getElementById("addRequirementButton").addEventListener("click", () => {
  const list = document.getElementById("requirementList");
  const row = document.createElement("article");
  row.className = "requirement-row";
  row.dataset.docStatus = "todo";
  row.innerHTML = `
    <button class="status-check" aria-label="Изменить статус"></button>
    <div class="requirement-copy"><span class="category">Дополнительно</span><strong>Согласование реквизита</strong><small>Добавлено из шаблона проекта</small></div>
    <span class="owner-chip">АП</span><span class="date-status urgent">Нужно сделать</span><button class="row-menu" aria-label="Меню требования">•••</button>
  `;
  list.appendChild(row);
  row.querySelector(".status-check").addEventListener("click", () => {
    const next = statusOrder[(statusOrder.indexOf(row.dataset.docStatus) + 1) % statusOrder.length];
    applyStatus(row, next);
  });
  row.querySelector(".row-menu").addEventListener("click", () => showToast("Действия с требованием: Согласование реквизита"));
  updateReadiness();
  showToast("Требование добавлено из демонстрационного шаблона");
});

document.getElementById("packageButton").addEventListener("click", () => {
  const rows = [...document.querySelectorAll(".requirement-row")];
  const ready = rows.filter((row) => row.dataset.docStatus === "done");
  const pending = rows.filter((row) => row.dataset.docStatus !== "done");
  const files = ready.map((row) => `<div class="package-file"><span>${row.querySelector("strong").textContent}</span><small>включён</small></div>`).join("");
  openModal(`
    <span class="kicker">Предварительная сборка</span>
    <h2 id="modalTitle">Пакет готов не полностью</h2>
    <p>${ready.length} документов можно включить сейчас. Ещё ${pending.length} требуют действий или проверки.</p>
    <div class="package-files">${files}</div>
    <div class="modal-actions">
      <button class="secondary" id="downloadManifest">Скачать опись</button>
      <button class="primary" id="markSent">Передать на проверку</button>
    </div>
  `);
  document.getElementById("downloadManifest").addEventListener("click", () => {
    const manifest = `ПАКЕТ СЪЁМКИ — ДЕМО\nПроект: Северный ветер\n\nГотовые документы:\n${ready.map((row, index) => `${index + 1}. ${row.querySelector("strong").textContent}`).join("\n")}\n\nТребуют внимания:\n${pending.map((row, index) => `${index + 1}. ${row.querySelector("strong").textContent}`).join("\n")}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([manifest], { type: "text/plain;charset=utf-8" }));
    link.download = "gorky-demo-package-manifest.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Опись пакета скачана");
  });
  document.getElementById("markSent").addEventListener("click", () => {
    closeModal();
    showToast("В прототипе пакет отмечен как переданный");
  });
});

const assistantAnswers = {
  risk: "Два ближайших риска: список группы и номера транспорта. Они блокируют допуск людей и машин. Запросите данные сегодня, проверку поставьте на 9 октября.",
  missing: "Не хватает паспортных данных 12 участников, двух госномеров и подтверждения инструктажа от 8 человек. В техрайдере нужно уточнить параметры электропитания.",
  plan: "Сегодня: запросить персональные данные и транспорт. До 8 октября: закрыть список группы. До 11 октября: подтвердить въезд и разгрузку. До 15 октября: собрать подтверждения инструктажа. 16 октября: отправить маршрут команде."
};

function answerAssistant(text, key) {
  const answer = key ? assistantAnswers[key] : `Я могу разобрать вопрос «${text}» по чек-листу. В рабочей версии ответ будет основан на актуальных требованиях студии и данных проекта.`;
  document.getElementById("assistantAnswer").innerHTML = `<span>Разбор · сейчас</span><p>${answer}</p>`;
}

document.querySelectorAll("[data-assistant-query]").forEach((button) => button.addEventListener("click", () => answerAssistant(button.textContent, button.dataset.assistantQuery)));
document.getElementById("assistantSend").addEventListener("click", () => {
  const input = document.getElementById("assistantInput");
  if (!input.value.trim()) return;
  answerAssistant(input.value.trim());
  input.value = "";
});
document.getElementById("assistantInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") document.getElementById("assistantSend").click();
});

document.querySelectorAll(".row-menu").forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.closest(".requirement-row").querySelector("strong").textContent;
    showToast(`Действия с требованием: ${title}`);
  });
});

updateReadiness();
