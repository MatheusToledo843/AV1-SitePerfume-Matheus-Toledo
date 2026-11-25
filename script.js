const perfumes = [
  {
    id: 1,
    nome: "Rayhaan Obsidian",
    categoria: "Amadeirado",
    preco: 280.00,
    ml: "100ml",
    notas: "Notas de cedro escuro, cardamomo e couro suave",
    imagem: "IMG/obsidian.png"
  },
  {
    id: 2,
    nome: "Versace Pour Homme",
    categoria: "Cítrico",
    preco: 500.00,
    ml: "100ml",
    notas: "Notas de limão siciliano, bergamota e almíscar",
    imagem: "IMG/versace.png"
  },
  {
    id: 3,
    nome: "Muharib",
    categoria: "Oriental",
    preco: 350.00,
    ml: "100ml",
    notas: "Notas de âmbar quente, especiarias e baunilha",
    imagem: "IMG/muharib.png"
  },
  {
    id: 4,
    nome: "Homem Cor.Agio Natura",
    categoria: "Amadeirado",
    preco: 230.00,
    ml: "100ml",
    notas: "Notas de madeiras nobres, pimenta rosa e cumaru",
    imagem: "IMG/coragio.png"
  },
  {
    id: 5,
    nome: "Lattafa Breeze",
    categoria: "Cítrico",
    preco: 250.00,
    ml: "100ml",
    notas: "Notas de mandarina fresca, chá verde e sândalo leve",
    imagem: "IMG/breeze.png"
  },
  {
    id: 6,
    nome: "Asad Elixir",
    categoria: "Oriental",
    preco: 225.00,
    ml: "100ml",
    notas: "Notas de pimenta preta, tabaco doce e baunilha intensa",
    imagem: "IMG/asad.png"
  }
];

let carrinho = JSON.parse(localStorage.getItem("leParfumCarrinho")) || [];
let nomeCliente = localStorage.getItem("leParfumCliente") || "";

function salvarDados() {
  localStorage.setItem("leParfumCarrinho", JSON.stringify(carrinho));
  localStorage.setItem("leParfumCliente", nomeCliente);
  atualizarContador();
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarContador() {
  const contador = document.getElementById("contador-topo");
  if (!contador) return;

  contador.textContent = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
}

function mostrarAviso(id, texto, tipo = "success") {
  const area = document.getElementById(id);
  if (!area) return;

  area.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show mb-0" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function mostrarPerfumes(categoria = "Todos") {
  const lista = document.getElementById("lista-perfumes");
  if (!lista) return;

  const filtrados = categoria === "Todos"
    ? perfumes
    : perfumes.filter(p => p.categoria === categoria);

  lista.innerHTML = filtrados.map(perfume => `
    <div class="col-sm-6 col-lg-4">
      <article class="card h-100 border-0 shadow-sm rounded-4 card-perfume">
        <div class="vitrine-imagem">
          <img
            src="${perfume.imagem}"
            alt="${perfume.nome}"
            class="img-perfume"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          >
          <div class="sem-imagem" style="display: none;">Adicione ${perfume.imagem}</div>
        </div>
        <div class="card-body d-flex flex-column justify-content-between p-4">
          <div>
            <span class="badge rounded-pill text-bg-light border mb-2">${perfume.categoria} • ${perfume.ml}</span>
            <h3>${perfume.nome}</h3>
            <p class="notas-texto">${perfume.notas}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <span class="preco-destaque">${formatarPreco(perfume.preco)}</span>
            <button type="button" class="btn btn-dark btn-sm px-3" onclick="adicionarRapido(${perfume.id})">
              Adicionar
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

function configurarFiltros() {
  const botoes = document.querySelectorAll(".filtro-btn");
  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      botoes.forEach(b => b.classList.replace("btn-dark", "btn-outline-dark") || b.classList.remove("active"));
      botao.classList.replace("btn-outline-dark", "btn-dark");
      botao.classList.add("active");

      const categoria = botao.dataset.categoria;
      mostrarPerfumes(categoria);
      mostrarAviso("feedback-catalogo", `Mostrando categoria: <strong>${categoria}</strong>.`, "secondary");
    });
  });
}

function adicionarRapido(idPerfume) {
  const perfume = perfumes.find(p => p.id === idPerfume);
  if (!perfume) return;

  const existente = carrinho.find(item => item.id === idPerfume);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ id: perfume.id, nome: perfume.nome, preco: perfume.preco, quantidade: 1 });
  }

  salvarDados();
  mostrarAviso("feedback-catalogo", `<strong>${perfume.nome}</strong> adicionado ao carrinho!`);
}

function validarPedido(idPerfume, quantidade, cliente) {
  if (!perfumes.some(p => p.id === Number(idPerfume))) return "Escolha um perfume válido.";
  const qtd = Number(quantidade);
  if (!Number.isInteger(qtd) || qtd < 1 || qtd > 10) return "Digite uma quantidade entre 1 e 10.";
  if (cliente.trim().length < 2) return "Digite o nome do cliente.";
  return "";
}

function preencherSelect() {
  const select = document.getElementById("select-perfume");
  if (!select) return;

  perfumes.forEach(perfume => {
    select.innerHTML += `<option value="${perfume.id}">${perfume.nome} (${perfume.ml}) — ${formatarPreco(perfume.preco)}</option>`;
  });
}

function mostrarCarrinho() {
  const lista = document.getElementById("lista-itens-carrinho");
  const totalEl = document.getElementById("valor-total");
  if (!lista || !totalEl) return;

  if (carrinho.length === 0) {
    lista.innerHTML = `<p class="text-secondary mb-0">Seu carrinho está vazio.</p>`;
    totalEl.textContent = formatarPreco(0);
    return;
  }

  lista.innerHTML = carrinho.map(item => `
    <div class="d-flex justify-content-between align-items-center border-bottom py-3 gap-2">
      <div>
        <div class="fw-semibold">${item.nome}</div>
        <small class="text-secondary">${item.quantidade}x de ${formatarPreco(item.preco)}</small>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="fw-bold">${formatarPreco(item.preco * item.quantidade)}</span>
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="removerItem(${item.id})">
          Remover
        </button>
      </div>
    </div>
  `).join("");

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  totalEl.textContent = formatarPreco(total);
}

function removerItem(idPerfume) {
  carrinho = carrinho.filter(item => item.id !== idPerfume);
  salvarDados();
  mostrarCarrinho();
  mostrarAviso("feedback-carrinho", "Item removido do carrinho.", "warning");
}

function configurarCarrinho() {
  const form = document.getElementById("form-item-pedido");
  const inputCliente = document.getElementById("input-cliente");
  const btnLimpar = document.getElementById("btn-limpar-carrinho");
  const btnFinalizar = document.getElementById("btn-finalizar-pedido");

  if (inputCliente && nomeCliente) inputCliente.value = nomeCliente;

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const idPerfume = document.getElementById("select-perfume").value;
      const quantidade = document.getElementById("input-quantidade").value;
      const cliente = inputCliente ? inputCliente.value : "";

      const erro = validarPedido(idPerfume, quantidade, cliente);
      if (erro) {
        mostrarAviso("feedback-carrinho", erro, "danger");
        return;
      }

      const perfume = perfumes.find(p => p.id === Number(idPerfume));
      const qtd = Number(quantidade);
      nomeCliente = cliente.trim();

      const existente = carrinho.find(item => item.id === perfume.id);
      if (existente) {
        existente.quantidade = Math.min(10, existente.quantidade + qtd);
      } else {
        carrinho.push({ id: perfume.id, nome: perfume.nome, preco: perfume.preco, quantidade: qtd });
      }

      salvarDados();
      mostrarCarrinho();
      document.getElementById("input-quantidade").value = 1;
      mostrarAviso("feedback-carrinho", `<strong>${perfume.nome}</strong> adicionado para <strong>${nomeCliente}</strong>!`);
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      carrinho = [];
      salvarDados();
      mostrarCarrinho();
      mostrarAviso("feedback-carrinho", "Carrinho limpo.", "info");
    });
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const clienteAtual = inputCliente ? inputCliente.value.trim() : nomeCliente;
      if (carrinho.length === 0) return mostrarAviso("feedback-carrinho", "Adicione um perfume antes de confirmar.", "danger");
      if (clienteAtual.length < 2) return mostrarAviso("feedback-carrinho", "Preencha o nome do cliente antes de confirmar.", "danger");

      nomeCliente = clienteAtual;
      salvarDados();
      const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
      mostrarAviso("feedback-carrinho", `Pedido confirmado para <strong>${nomeCliente}</strong>! Total: <strong>${formatarPreco(total)}</strong>.`);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarContador();
  const pagina = document.body.dataset.pagina;
  if (pagina === "catalogo") {
    mostrarPerfumes();
    configurarFiltros();
  } else if (pagina === "carrinho") {
    preencherSelect();
    mostrarCarrinho();
    configurarCarrinho();
  }
});