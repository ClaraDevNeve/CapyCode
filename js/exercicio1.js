// CapyCode – Exercício 1: "O bando bagunçado"
const NOMES = ["Filó", "Cacau", "Lolo", "Nina", "Rex"];
const INICIAL = ["Filó", "Lolo", "Cacau", "Rex", "Nina"];
const OBJETIVO = [...NOMES];

const editor = document.getElementById("editor");
const codigo = document.getElementById("codigo");
const resultado = document.getElementById("resultado");
const bandoEl = document.getElementById("bando");
const legenda = document.getElementById("legenda");
const cena = document.querySelector(".cena");

function listaComAspas(lista) {
  return `[${lista.map(nome => `"${nome}"`).join(", ")}]`;
}

// Converte um argumento que deve ser um nome (string entre aspas).
function lerNome(texto) {
  const s = texto.trim();
  const m = s.match(/^(["'])(.*)\1$/);
  if (!m) {
    if (/^-?\d+$/.test(s)) {
      throw new Error(
        `Valor inválido: ${s}. Use um nome entre aspas: ${NOMES.map(n => `"${n}"`).join(", ")}.`
      );
    }
    throw new Error(`${s} é um nome (string): use aspas, assim: "${s}"`);
  }
  const nome = m[2];
  if (!NOMES.includes(nome)) {
    throw new Error(
      `Nome desconhecido: "${nome}". Use ${NOMES.map(n => `"${n}"`).join(", ")}.`
    );
  }
  return nome;
}

// Converte um argumento que deve ser uma posição (número, sem aspas).
function lerPosicao(texto) {
  const s = texto.trim();
  if (!/^-?\d+$/.test(s)) {
    const semAspas = s.replace(/^(["'])(.*)\1$/, "$2");
    if (/^-?\d+$/.test(semAspas)) {
      throw new Error(`A posição é um número, sem aspas: ${semAspas}`);
    }
    throw new Error(`Posição inválida: ${s}. Use um número inteiro.`);
  }
  return Number(s);
}

// Separa os argumentos por vírgula, respeitando o que está entre aspas.
function separarArgumentos(texto) {
  const partes = [];
  let atual = "";
  let aspas = null;
  for (const ch of texto) {
    if (aspas) {
      atual += ch;
      if (ch === aspas) aspas = null;
    } else if (ch === '"' || ch === "'") {
      aspas = ch;
      atual += ch;
    } else if (ch === ",") {
      partes.push(atual.trim());
      atual = "";
    } else {
      atual += ch;
    }
  }
  if (aspas) throw new Error("Faltou fechar as aspas.");
  const ultimo = atual.trim();
  if (ultimo) partes.push(ultimo);
  return partes.filter(p => p !== "");
}

// Lê um comando por linha, ex.: insert(0, "Filó") | pop(2) | remove("Lolo") | append("Rex")
function executar(texto) {
  const lista = [...INICIAL];
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);

  for (const linha of linhas) {
    const m = linha.match(/^(?:bando\.)?(insert|pop|remove|append)\s*\((.*)\)\s*;?$/);
    if (!m) throw new Error(`Comando não reconhecido: ${linha}`);

    const [, cmd, bruto] = m;
    const args = separarArgumentos(bruto);

    switch (cmd) {
      case "insert": {
        if (args.length !== 2) throw new Error('insert precisa de (i, "nome")');
        lista.splice(lerPosicao(args[0]), 0, lerNome(args[1]));
        break;
      }
      case "pop": {
        if (args.length > 1) throw new Error("pop recebe só a posição: pop(i)");
        const i = args.length === 0 ? lista.length - 1 : lerPosicao(args[0]);
        if (i >= lista.length || i < -lista.length) throw new Error(`pop(${i}): não existe essa posição`);
        lista.splice(i, 1);
        break;
      }
      case "remove": {
        if (args.length !== 1) throw new Error('remove recebe só o nome: remove("nome")');
        const nome = lerNome(args[0]);
        const i = lista.indexOf(nome);
        if (i === -1) throw new Error(`remove("${nome}"): esse nome não está no bando`);
        lista.splice(i, 1);
        break;
      }
      case "append": {
        if (args.length !== 1) throw new Error('append recebe só o nome: append("nome")');
        lista.push(lerNome(args[0]));
        break;
      }
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
      `<span class="avatar"><img src="../img/capycode.webp" alt="" draggable="false"></span>` +
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
    resultado.textContent = `# ${listaComAspas(lista)}`;
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
    legenda.textContent = `Ainda não… confira a ordem: ${listaComAspas(OBJETIVO).slice(1, -1)}.`;
  }
});

desenhar(INICIAL);
