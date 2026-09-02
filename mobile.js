const mobileRoutes = {
  stage: {
    title: "Павильон 03",
    eta: "4 мин",
    distance: "210 м",
    path: "227,593 227,551 227,492 227,418 227,345 307,345 307,281",
    points: [[227,593],[227,551],[227,418],[307,281]],
    instructions: [
      ["↑", "Войдите через главный КПП", "40 м"],
      ["↑", "Пройдите через ресепшен", "55 м"],
      ["→", "Поверните направо в главной галерее", "80 м"],
      ["◆", "Павильон 03 справа от вас", "0 м"]
    ]
  },
  makeup: {
    title: "Гримёрные",
    eta: "3 мин",
    distance: "145 м",
    path: "227,593 227,551 227,492 184,492 171,492 132,492",
    points: [[227,593],[227,551],[184,492],[132,492]],
    instructions: [
      ["↑", "Войдите через главный КПП", "40 м"],
      ["↑", "Пройдите через ресепшен", "45 м"],
      ["←", "Поверните налево после охраны", "60 м"],
      ["◆", "Гримёрные слева от вас", "0 м"]
    ]
  },
  cafe: {
    title: "Кафе",
    eta: "3 мин",
    distance: "170 м",
    path: "227,593 227,551 227,492 274,492 287,492 327,492",
    points: [[227,593],[227,551],[274,492],[327,492]],
    instructions: [
      ["↑", "Войдите через главный КПП", "40 м"],
      ["↑", "Пройдите через ресепшен", "45 м"],
      ["→", "Поверните направо после охраны", "85 м"],
      ["◆", "Кафе справа от вас", "0 м"]
    ]
  }
};

const routePath = document.getElementById("activeRoutePath");
const routeDots = document.getElementById("activeRouteDots");
const userPosition = document.getElementById("userPosition");
const destinationPin = document.getElementById("destinationPin");
const routeButtons = [...document.querySelectorAll("[data-mobile-route]")];
const toast = document.getElementById("mobileToast");
let toastTimer;
let activeRoute = "stage";
let activeStep = -1;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderInstruction(route, index) {
  const step = route.instructions[Math.max(0, index)];
  document.getElementById("turnIcon").textContent = step[0];
  document.getElementById("nextInstruction").textContent = step[1];
  document.getElementById("stepDistance").textContent = step[2];
}

function renderRoute(key) {
  activeRoute = key;
  activeStep = -1;
  const route = mobileRoutes[key];
  routeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.mobileRoute === key));
  routePath.setAttribute("points", route.path);
  routeDots.innerHTML = route.points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" />`).join("");
  userPosition.setAttribute("transform", `translate(${route.points[0][0]} ${route.points[0][1]})`);
  const destination = route.points[route.points.length - 1];
  destinationPin.setAttribute("transform", `translate(${destination[0]} ${destination[1]})`);
  document.getElementById("searchDestination").textContent = route.title;
  document.getElementById("sheetDestination").textContent = route.title;
  document.getElementById("routeEta").textContent = route.eta;
  document.getElementById("routeDistance").textContent = route.distance;
  document.getElementById("startRouteButton").textContent = "Начать маршрут";
  renderInstruction(route, 0);
}

routeButtons.forEach((button) => button.addEventListener("click", () => renderRoute(button.dataset.mobileRoute)));

document.getElementById("startRouteButton").addEventListener("click", () => {
  const route = mobileRoutes[activeRoute];
  activeStep += 1;
  if (activeStep >= route.points.length) {
    renderRoute(activeRoute);
    return;
  }
  const [x, y] = route.points[activeStep];
  userPosition.setAttribute("transform", `translate(${x} ${y})`);
  renderInstruction(route, activeStep);
  document.getElementById("startRouteButton").textContent = activeStep === route.points.length - 1 ? "Маршрут завершён · начать заново" : "Следующий шаг";
  if (activeStep === route.points.length - 1) showToast("Вы у цели");
});

document.getElementById("locateControl").addEventListener("click", () => {
  renderRoute(activeRoute);
  showToast("Позиция обновлена по ближайшему QR-якорю");
});

document.getElementById("floorControl").addEventListener("click", () => showToast("В демо доступен первый этаж"));
document.getElementById("destinationSearch").addEventListener("click", () => showToast("Выберите назначение под строкой поиска"));
document.querySelectorAll("[data-mobile-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.mobileToast)));

renderRoute("stage");
