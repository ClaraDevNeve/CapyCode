// CapyCode – Exercício 2: "A uva escondida"
// Três pilhas: cacau (a pilha do Cacau), prato (espera) e Filó (a da capivara).
// Em todos os arrays, o índice 0 é a base e o último item é o topo.

const INICIAL = ["laranja", "uva", "maçã"];
const FILO_ESPERADO = ["uva"];
const CACAU_ESPERADO = ["laranja", "maçã"];

const SPRITE = {
  "maçã": "img/maca_transparente.png",
  "laranja": "img/laranja_transparente.png",
  "uva": "img/uva_transparente.png",
};

const PILHAS = ["cacau", "prato", "Filó"];

const NOMES_AMIGAVEIS = {
  cacau: "Pilha do Cacau",
  prato: "Prato de espera",
  "Filó": "Pilha da Filó",
};

const editor = document.getElementById("editor");
const codigo = document.getElementById("codigo");
const resultado = document.getElementById("resultado");
const legenda = document.getElementById("legenda");
const cena = document.querySelector(".cena");

const elementos = {
  cacau: document.getElementById("pilha-cacau"),
  prato: document.getElementById("pilha-prato"),
  "Filó": document.getElementById("pilha-filo"),
};

function listaComAspas(lista) {
  return `[${lista.map(nome => `"${nome}"`).join(", ")}]`;
}

function desenharPilha(nome, lista) {
  const el = elementos[nome];
  if (!el) return;

  const nomeAmigavel = NOMES_AMIGAVEIS[nome];
  el.innerHTML = "";
  el.classList.toggle("vazia", lista.length === 0);

  if (lista.length === 0) {
    el.innerHTML = `<span aria-hidden="true">vazia</span>`;
    el.setAttribute("aria-label", `${nomeAmigavel} sem frutas`);
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
  el.setAttribute("aria-label", `${nomeAmigavel}: base ${lista[0]}, topo ${topo}`);
}

function desenhar(pilhas) {
  for (const nome of PILHAS) desenharPilha(nome, pilhas[nome]);
}

// Aceita só movimentos entre pilhas: Filó.append(cacau.pop())
const MOVER = /^(cacau|prato|Filó)\.append\(\s*(cacau|prato|Filó)\.pop\(\s*\)\s*\)\s*;?$/;
const APPEND_LITERAL = /^(cacau|prato|Filó)\.append\s*\(/;
const POP_SOLTO = /^(cacau|prato|Filó)\.pop\s*\(\s*\)\s*;?$/;

function executar(texto) {
  const pilhas = { cacau: [...INICIAL], prato: [], "Filó": [] };
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);

  for (const linha of linhas) {
    const m = linha.match(MOVER);

    if (!m) {
      if (APPEND_LITERAL.test(linha)) {
        throw new Error(
          "Neste nível as frutas só se movem entre pilhas: use Filó.append(cacau.pop())."
        );
      }
      if (POP_SOLTO.test(linha)) {
        throw new Error("Use pop() dentro de um append: Filó.append(cacau.pop()).");
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
    pilhas.cacau.length === CACAU_ESPERADO.length &&
    pilhas.cacau.every((fruta, i) => fruta === CACAU_ESPERADO[i]) &&
    pilhas.prato.length === 0 &&
    pilhas["Filó"].length === FILO_ESPERADO.length &&
    pilhas["Filó"].every((fruta, i) => fruta === FILO_ESPERADO[i])
  );
}

function atualizar() {
  editor.classList.remove("ok");
  cena.classList.remove("vitoria");
  resultado.classList.remove("erro");

  try {
    const pilhas = executar(codigo.value);
    resultado.textContent = `# ${listaComAspas(pilhas["Filó"])}`;
    desenhar(pilhas);

    const ganhou = venceu(pilhas);
    legenda.textContent = ganhou
      ? "A Filó comeu a uva! 🎉"
      : "A Filó está esperando a uva…";
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
    legenda.textContent = "Ainda não… entregue a uva à Filó e devolva a maçã e a laranja ao Cacau.";
  }
});

desenhar({ cacau: [...INICIAL], prato: [], "Filó": [] });
