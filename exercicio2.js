// CapyCode – Exercício 2: "A torre de frutas"
// Duas pilhas: frutas (onde as frutas chegam bagunçadas) e auxiliar (a pilha da Filó).
// Em todos os arrays, o índice 0 é a base e o último item é o topo.

const MODELO = ["maçã", "laranja", "uva"];
const INICIAL = ["uva", "laranja", "maçã"];

const SPRITE = {
  "maçã": "img/maca_transparente.png",
  "laranja": "img/laranja_transparente.png",
  "uva": "img/uva_transparente.png",
};

const PILHAS = ["frutas", "auxiliar"];

const editor = document.getElementById("editor");
const codigo = document.getElementById("codigo");
const resultado = document.getElementById("resultado");
const legenda = document.getElementById("legenda");
const cena = document.querySelector(".cena");

const elementos = {
  frutas: document.getElementById("pilha-frutas"),
  auxiliar: document.getElementById("pilha-auxiliar"),
};

function listaComAspas(lista) {
  return `[${lista.map(nome => `"${nome}"`).join(", ")}]`;
}

function desenharPilha(nome, lista) {
  const el = elementos[nome];
  if (!el) return;

  el.innerHTML = "";
  el.classList.toggle("vazia", lista.length === 0);

  if (lista.length === 0) {
    el.innerHTML = `<span aria-hidden="true">vazia</span>`;
    el.setAttribute("aria-label", `Pilha ${nome} vazia`);
    return;
  }

  for (const fruta of lista) {
    const img = document.createElement("img");
    img.className = "fruta";
    img.src = SPRITE[fruta];
    img.alt = "";
    el.appendChild(img);
  }

  const topo = lista[lista.length - 1];
  el.setAttribute("aria-label", `Pilha ${nome}: base ${lista[0]}, topo ${topo}`);
}

function desenhar(pilhas) {
  for (const nome of PILHAS) desenharPilha(nome, pilhas[nome]);
}

// Aceita só movimentos entre pilhas: auxiliar.append(frutas.pop())
const MOVER = /^(frutas|auxiliar)\.append\(\s*(frutas|auxiliar)\.pop\(\s*\)\s*\)\s*;?$/;
const APPEND_LITERAL = /^(frutas|auxiliar)\.append\s*\(/;
const POP_SOLTO = /^(frutas|auxiliar)\.pop\s*\(\s*\)\s*;?$/;

function executar(texto) {
  const pilhas = { frutas: [...INICIAL], auxiliar: [] };
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);

  for (const linha of linhas) {
    const m = linha.match(MOVER);

    if (!m) {
      if (APPEND_LITERAL.test(linha)) {
        throw new Error(
          "Neste nível as frutas só se movem entre pilhas: use auxiliar.append(frutas.pop())."
        );
      }
      if (POP_SOLTO.test(linha)) {
        throw new Error("Use pop() dentro de um append: auxiliar.append(frutas.pop()).");
      }
      throw new Error(`Comando não reconhecido: ${linha}`);
    }

    const [, destino, origem] = m;
    if (destino === origem) {
      throw new Error(`Você está movendo ${origem} para ela mesma.`);
    }
    if (pilhas[origem].length === 0) {
      throw new Error(`A pilha ${origem} está vazia: não há nada para retirar.`);
    }
    pilhas[destino].push(pilhas[origem].pop());
  }

  return pilhas;
}

function venceu(pilhas) {
  return (
    pilhas.frutas.length === 0 &&
    pilhas.auxiliar.length === MODELO.length &&
    pilhas.auxiliar.every((fruta, i) => fruta === MODELO[i])
  );
}

function atualizar() {
  editor.classList.remove("ok");
  cena.classList.remove("vitoria");
  resultado.classList.remove("erro");

  try {
    const pilhas = executar(codigo.value);
    resultado.textContent = `# ${listaComAspas(pilhas.auxiliar)}`;
    desenhar(pilhas);

    const ganhou = venceu(pilhas);
    legenda.textContent = ganhou
      ? "A Filó agradece: a torre está pronta! 🎉"
      : "A Filó está esperando a torre de frutas ficar pronta…";
    return ganhou;
  } catch (e) {
    resultado.textContent = e.message;
    resultado.classList.add("erro");
    return false;
  }
}

codigo.addEventListener("input", atualizar);

editor.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (atualizar()) {
    editor.classList.add("ok");
    cena.classList.add("vitoria");
  } else {
    legenda.textContent = `Ainda não… a pilha da Filó precisa ficar ${MODELO.join(", ")} (da base para o topo).`;
  }
});

desenhar({ frutas: [...INICIAL], auxiliar: [] });
