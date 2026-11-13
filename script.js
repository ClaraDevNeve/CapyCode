// CapyCode – Exercício 1: "O bando bagunçado"
const INICIAL = [1, 3, 2, 5, 4];
const OBJETIVO = [1, 2, 3, 4, 5];

const editor = document.getElementById("editor");
const codigo = document.getElementById("codigo");
const resultado = document.getElementById("resultado");
const bandoEl = document.getElementById("bando");
const legenda = document.getElementById("legenda");
const cena = document.querySelector(".cena");

// Lê um comando por linha, ex.: insert(0, 1) | pop(2) | remove(3) | append(4)
function executar(texto) {
  const lista = [...INICIAL];
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);

  for (const linha of linhas) {
    const m = linha.match(/^(?:bando\.)?(insert|pop|remove|append)\s*\(\s*(-?\d+)?\s*(?:,\s*(-?\d+)\s*)?\)\s*;?$/);
    if (!m) throw new Error(`Comando não reconhecido: ${linha}`);

    const [, cmd, a, b] = m;
    const n1 = a !== undefined ? Number(a) : undefined;
    const n2 = b !== undefined ? Number(b) : undefined;

    switch (cmd) {
      case "insert":
        if (n1 === undefined || n2 === undefined) throw new Error("insert precisa de (i, valor)");
        lista.splice(n1, 0, n2);
        break;
      case "pop": {
        if (n2 !== undefined) throw new Error("pop recebe só a posição: pop(i)");
        const i = n1 === undefined ? lista.length - 1 : n1;
        if (i >= lista.length || i < -lista.length) throw new Error(`pop(${i}): não existe essa posição`);
        lista.splice(i, 1);
        break;
      }
      case "remove": {
        if (n1 === undefined || n2 !== undefined) throw new Error("remove recebe só o valor: remove(valor)");
        const i = lista.indexOf(n1);
        if (i === -1) throw new Error(`remove(${n1}): esse valor não está no bando`);
        lista.splice(i, 1);
        break;
      }
      case "append":
        if (n1 === undefined || n2 !== undefined) throw new Error("append recebe só o valor: append(valor)");
        lista.push(n1);
        break;
    }
  }
  return lista;
}

function desenhar(lista) {
  bandoEl.innerHTML = "";
  lista.forEach((valor, i) => {
    const li = document.createElement("li");
    li.className = "capivara" + (OBJETIVO[i] === valor ? " certa" : "");
    li.innerHTML =
      `<span class="cabeca"><span class="olho"></span></span>` +
      `<span class="patas"></span>` +
      `<span class="valor">${valor}</span>` +
      `<span class="indice">[${i}]</span>`;
    li.setAttribute("aria-label", `Capivara ${valor} na posição ${i}`);
    bandoEl.appendChild(li);
  });
}

function atualizar() {
  editor.classList.remove("ok");
  cena.classList.remove("vitoria");
  resultado.classList.remove("erro");
  try {
    const lista = executar(codigo.value);
    resultado.textContent = `# [${lista.join(", ")}]`;
    desenhar(lista);
    const venceu = lista.length === OBJETIVO.length && lista.every((v, i) => v === OBJETIVO[i]);
    legenda.textContent = venceu
      ? "A Filó agradece: o bando está organizado! 🎉"
      : "A Filó está esperando o bando se organizar…";
    return venceu;
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
    legenda.textContent = "Ainda não… confira a ordem: 1, 2, 3, 4, 5.";
  }
});

desenhar(INICIAL);
