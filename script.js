// API Keys opcionales si las quieres personalizar
const OMDB_KEY = "your_key_here"; // si no tienes key funciona igual pero limitado
const TMDB_KEY = "84683d75e36df75f26a1e5e9a4496f49";

// ENDPOINTS según categoría
const endpoints = {
  peliculas: (q) =>
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&type=movie&s=${encodeURIComponent(q)}`,

  series: (q) =>
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=tvShow`,

  libros: (q) =>
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`,

  actores: (q) =>
    `https://api.themoviedb.org/3/search/person?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`,

  cantantes: (q) =>
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=musicArtist`,

  grupos: (q) =>
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=musicArtist`,

  canciones: (q) =>
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song`
};

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

// INICIAR JUEGO
startBtn.onclick = () => {
  menu.classList.add("oculto");
  juego.classList.remove("oculto");

  tiempo = parseInt(dificultadSelect.value);
  tituloCategoria.textContent =
    categoriaSelect.options[categoriaSelect.selectedIndex].text;

  generarCampos();
  iniciarTemporizador();
};

// GENERA 26 CELDAS A–Z
function generarCampos() {
  contenedor.innerHTML = "";
  letras.forEach((letra) => {
    const div = document.createElement("div");
    div.className = "celda";
    div.innerHTML = `
      <h3>${letra}</h3>
      <input id="input-${letra}" placeholder="Escribe..." />
    `;
    contenedor.appendChild(div);
  });
}

// TEMPORIZADOR
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

  const categoria = categoriaSelect.value;
  const url = endpoints[categoria](valor);

  try {
    const resp = await fetch(url);
    const data = await resp.json();

    // Detectamos formato según API usada
    switch (categoria) {
      case "peliculas":
        return data.Search && data.Search.length > 0;

      case "series":
      case "cantantes":
      case "grupos":
      case "canciones":
        return data.results && data.results.length > 0;

      case "libros":
        return data.items && data.items.length > 0;

      case "actores":
        return data.results && data.results.length > 0;

      default:
        return false;
    }
  } catch (e) {
    console.error("Error API:", e);
    return false;
  }
}


finalizarBtn.onclick = finalizarJuego;

// FINAL DE PARTIDA
async function finalizarJuego() {
  clearInterval(intervalo);

  for (let letra of letras) {
    const input = document.getElementById("input-" + letra);
    if (!input) continue;

    const texto = input.value.trim();
    const valido = await validar(letra, texto);

    if (valido) {
      input.classList.remove("incorrecto");
      input.classList.add("correcto");
    } else {
      input.classList.remove("correcto");
      input.classList.add("incorrecto");
    }
  }
}
