// Componentes compartilhados do CapyCode (cabeçalho e rodapé).
// Injetados via JS para não repetir o mesmo HTML em todas as páginas.

const TOTAL_NIVEIS = 4;

// Para liberar um nível novo, basta preencher o nome do arquivo aqui.
const PAGINAS = {
  1: "CAPYCODE.html",
  2: "exercicio2.html",
  3: null, // ainda não existe
  4: null, // ainda não existe
};

function seta({ para, rotulo, lado }) {
  const conteudo = lado === "anterior" ? "&lt;" : "&gt;";
  if (para == null) {
    return `<a href="#" class="seta" aria-label="${rotulo}" aria-disabled="true">${conteudo}</a>`;
  }
  return `<a href="${para}" class="seta" aria-label="${rotulo}">${conteudo}</a>`;
}

function montarTopo(el) {
  const nivel = Number(el.dataset.nivel);
  el.innerHTML = `
    <h1 class="logo">CapyCode</h1>
    <nav class="niveis" aria-label="Níveis">
      ${seta({ para: PAGINAS[nivel - 1], rotulo: "Nível anterior", lado: "anterior" })}
      <p>Nível <strong>${nivel}</strong> / ${TOTAL_NIVEIS}</p>
      ${seta({ para: PAGINAS[nivel + 1], rotulo: "Próximo nível", lado: "proximo" })}
    </nav>
  `;
}

const RODAPE = `
  <p>
    Inspirado no
    <a class="link-animado" href="https://flexboxfroggy.com/" target="_blank" rel="noopener noreferrer">Flexbox Froggy</a>, de Thomas Park
    <span class="separador" aria-hidden="true">|</span>
    <a class="link-animado" href="https://github.com/thomaspark/flexboxfroggy" target="_blank" rel="noopener noreferrer">Repositório original</a>
  </p>
  <p>
    <strong>CapyCode</strong> foi criado por:
    <span class="autores"><a class="integrante" href="https://github.com/ClaraDevNeve" target="_blank" rel="noopener noreferrer">Maria Clara</a>,</span>
    <span class="autores"><a class="integrante" href="https://github.com/JORD4N-01" target="_blank" rel="noopener noreferrer">Jordan Cunha</a> e </span>
    <span class="autores"><a class="integrante" href="https://github.com/yLucasVale" target="_blank" rel="noopener noreferrer">Lucas Albuquerque</a></span>
  </p>
  <p>
    <a class="integrante github" href="https://github.com/ClaraDevNeve/CapyCode" target="_blank" rel="noopener noreferrer"
      aria-label="Repositório do CapyCode no GitHub">
      <img class="icone-github" src="img/icone-github.png" alt="" aria-hidden="true" width="20" height="20">
      Repositório do CapyCode
    </a>
  </p>
`;

document.querySelectorAll("header.topo[data-nivel]").forEach(montarTopo);
document.querySelectorAll("footer.rodape").forEach(el => { el.innerHTML = RODAPE; });
