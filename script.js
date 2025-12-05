const apiKey = "https://api.themoviedb.org/3/search/multi?api_key=84683d75e36df75f26a1e5e9a4496f49&query=";

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const menu = document.getElementById("menu");
const juego = document.getElementById("juego");
const categoriaSelect = document.getElementById("categoriaSelect");
const dificultadSelect = document.getElementById("dificultadSelect");
const startBtn = document.getElementById("startBtn");
const finalizarBtn = document.getElementById("finalizarBtn");
const contenedor = document.getElementById("contenedorLetras");
const timerDisplay = document.getElementById("timer");
const tituloCategoria = document.getElementById("tituloCategoria");

let tiempo;
let intervalo;

startBtn.onclick = () => {
  menu.classList.add("oculto");
  juego.classList.remove("oculto");

  tiempo = parseInt(dificultadSelect.value);
  tituloCategoria.textContent = categoriaSelect.options[categoriaSelect.selectedIndex].text;

  generarCampos();
  iniciarTemporizador();
};

function generarCampos() {
  contenedor.innerHTML = "";
  letras.forEach(letra => {
    const div = document.createElement("div");
    div.className = "celda";
    div.innerHTML = `
      <h3>${letra}</h3>
      <input id="input-${letra}" placeholder="Escribe..." />
    `;
    contenedor.appendChild(div);
  });
}

function iniciarTemporizador() {
  timerDisplay.textContent = `Tiempo: ${tiempo}`;
  intervalo = setInterval(() => {
    tiempo--;
    timerDisplay.textContent = `Tiempo: ${tiempo}`;
    if (tiempo <= 0) finalizarJuego();
  }, 1000);
}

async function validar(letra, valor) {
  if (valor.length < 2) return false;
  if (valor[0].toUpperCase() !== letra) return false;

  const response = await fetch(apiKey + valor);
  const data = await response.json();

  return data.results && data.results.length > 0;
}

finalizarBtn.onclick = finalizarJuego;

async function finalizarJuego() {
  clearInterval(intervalo);

  for (let letra of letras) {
    const input = document.getElementById("input-" + letra);
    if (!input) continue;

    const valido = await validar(letra, input.value.trim());

    if (valido) input.classList.add("correcto");
    else input.classList.add("incorrecto");
  }
}
