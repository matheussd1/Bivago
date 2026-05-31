// funcionalidade 1 - busca de disponibilidade

const formularioPesquisa = document.getElementById('formulario-pesquisa');
const resultadosQuartos = document.getElementById('resultados-quartos');

formularioPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault(); // nao deixa a pagina recarregar

    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const tipo = document.getElementById('tipo-quarto').value;

    // TRAVA DE SEGURANÇA: Impede a busca no Back-end se as datas forem inválidas
    const dataInicio = new Date(checkin + 'T00:00:00');
    const dataFim = new Date(checkout + 'T00:00:00');

    if (!isNaN(dataInicio) && !isNaN(dataFim)) {
        if (dataFim <= dataInicio) {
            resultadosQuartos.innerHTML = ''; // Limpa os cards de quartos se houver erro
            divResumoPreco.style.display = 'block';
            divResumoPreco.style.backgroundColor = '#ffebee';
            divResumoPreco.style.color = '#c62828';
            divResumoPreco.innerHTML = '⚠️ Erro: A data de check-out deve ser maior que a data de check-in!';
            return; // Para a execução aqui e não faz o fetch
        }
    }

    try {
        const response = await fetch(`http://localhost:3001/api/quartos/buscar?checkin=${checkin}&checkout=${checkout}&tipo=${tipo}`);
        const data = await response.json();

        resultadosQuartos.innerHTML = '';

        if (data.quartos.length === 0) {
            resultadosQuartos.innerHTML = '<p>Nenhum quarto disponível para esse tipo nesta data.</p>';
            return;
        }

        // render os quartos
        data.quartos.forEach(quarto => {
            const card = document.createElement('div');
            card.className = 'cartao-quarto';
            card.innerHTML = `
                <img src="${quarto.imagem}" alt="${quarto.nome}">
                <div class="info-quarto">
                    <h3>${quarto.nome}</h3>
                    <p>${quarto.descricao}</p>
                    <p class="preco-quarto">R$ ${quarto.preco}/noite</p>
                    <button class="botao-reserva" onclick="selecionarQuarto(${quarto.id})">Selecionar Quarto</button>
                </div>
            `;
            resultadosQuartos.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        resultadosQuartos.innerHTML = '<p>Erro ao conectar com o servidor. Tente novamente.</p>';
    }
});

function selecionarQuarto(id) {
    alert(`Quarto ${id} selecionado com sucesso! Vamos para o checkout.`);
}

// funcionalidade 2 - calculo do valor real do quarto

const campoCheckin = document.getElementById('checkin');
const campoCheckout = document.getElementById('checkout');
const campoTipoQuarto = document.getElementById('tipo-quarto');

// Captura a seção do form
const containerPesquisa = document.querySelector('.container-pesquisa');

// Cria o container para exibir o resumo ou o erro
const divResumoPreco = document.createElement('div');
divResumoPreco.id = 'resumo-diarias';
divResumoPreco.style.marginTop = '20px';
divResumoPreco.style.padding = '12px';
divResumoPreco.style.borderRadius = '6px';
divResumoPreco.style.fontWeight = 'bold';
divResumoPreco.style.display = 'none'; // Começa escondido

// Adiciona o elemento dentro da seção correta
if (containerPesquisa) {
    containerPesquisa.appendChild(divResumoPreco);
}

// Tabela de preços por tipo
const tabelaPrecos = {
    standard: 180,
    deluxe: 350,
    suite: 600
};

function calcularDiariasETotal() {
    // Se alguma das datas estiver vazia, esconde o bloco e para a execução
    if (!campoCheckin.value || !campoCheckout.value) {
        divResumoPreco.style.display = 'none';
        return;
    }

    // Adicionado 'T00:00:00' para garantir que a data seja interpretada no fuso horário local
    const dataInicio = new Date(campoCheckin.value + 'T00:00:00');
    const dataFim = new Date(campoCheckout.value + 'T00:00:00');
    const tipoSelecionado = campoTipoQuarto.value;

    // Garante que os objetos de data são válidos antes de calcular
    if (!isNaN(dataInicio) && !isNaN(dataFim)) {
        
        // Validacao: Check-out menor ou igual ao Check-in
        if (dataFim <= dataInicio) {
            resultadosQuartos.innerHTML = ''; // Limpa os quartos da tela na hora que o erro acontecer
            divResumoPreco.style.display = 'block';
            divResumoPreco.style.backgroundColor = '#ffebee';
            divResumoPreco.style.color = '#c62828';
            divResumoPreco.innerHTML = '⚠️ Erro: A data de check-out deve ser maior que a data de check-in!';
            return;
        }

        // calcula a diferença em dias
        const diferencaTempo = Math.abs(dataFim - dataInicio);
        const quantidadeDiarias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

        // obtem o preco e calcula o total
        const precoPorNoite = tabelaPrecos[tipoSelecionado] || 0;
        const valorTotal = quantidadeDiarias * precoPorNoite;

        // resumo estilizado
        divResumoPreco.style.opacity = '1'; // Corrigido de styleOpacity para opacity
        divResumoPreco.style.display = 'block';
        divResumoPreco.style.backgroundColor = '#e3f2fd';
        divResumoPreco.style.color = '#003580';
        divResumoPreco.innerHTML = `✨ Período Selecionado: ${quantidadeDiarias} diária(s) | Valor por noite: R$ ${precoPorNoite} | Total Estimado: R$ ${valorTotal}`;
    }
}

campoCheckin.addEventListener('change', calcularDiariasETotal);
campoCheckout.addEventListener('change', calcularDiariasETotal);
campoTipoQuarto.addEventListener('change', calcularDiariasETotal);