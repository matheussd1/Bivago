
const formularioPesquisa = document.getElementById('formulario-pesquisa');
const resultadosQuartos = document.getElementById('resultados-quartos');
const secaoCheckout = document.getElementById('secao-checkout');
const detalhesReservaCheckout = document.getElementById('detalhes-reserva-checkout');
const botaoVoltar = document.getElementById('botao-voltar');
const campoCheckin = document.getElementById('checkin');
const campoCheckout = document.getElementById('checkout');
const campoTipoQuarto = document.getElementById('tipo-quarto');
const containerPesquisa = document.querySelector('.container-pesquisa');
const campoCartao = document.getElementById('numero-cartao');
const formularioCheckout = document.getElementById('formulario-checkout');

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

// Guardar na memória o quarto que está sendo reservado atualmente
let quartoSelecionadoAtual = null;



// FUNCIONALIDADE 1 - Busca de disponibilidade

formularioPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault(); // nao deixa a pagina recarregar

    const checkin = campoCheckin.value;
    const checkout = campoCheckout.value;
    const tipo = campoTipoQuarto.value;

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
            divResumoPreco.style.display = 'none'; // Esconde o resumo se não achar quartos
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
                    <button class="botao-reserva" onclick="selecionarQuarto(${quarto.id}, '${quarto.nome}', ${quarto.preco})">Selecionar Quarto</button>
                </div>
            `;
            resultadosQuartos.appendChild(card);
        });

        // Só executa o cálculo estimado se a busca trouxer quartos com sucesso
        calcularDiariasETotal();

    } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        resultadosQuartos.innerHTML = '<p>Erro ao conectar com o servidor. Tente novamente.</p>';
        divResumoPreco.style.display = 'none';
    }
});



// FUNCIONALIDADE 2 - calculo do valor real do quarto


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



// FUNCIONALIDADE 3 - Fluxo de Transição para o Checkout


function selecionarQuarto(id, nome, preco) {
    // Guarda as informações na memória
    quartoSelecionadoAtual = { id, nome, preco };

    // Esconde a busca e os resultados usando manipulação do DOM
    containerPesquisa.style.display = 'none';
    resultadosQuartos.style.display = 'none';

    // Exibe a tela de checkout
    secaoCheckout.style.display = 'block';

    // Preenche o resumo da reserva com os dados dinâmicos do quarto
    detalhesReservaCheckout.innerHTML = `
        <h3>📍 Resumo da sua Escolha:</h3>
        <p><strong>Acomodação:</strong> ${nome}</p>
        <p><strong>Valor unitário:</strong> R$ ${preco}/noite</p>
        <p style="font-size: 0.9em; color: #555;">Por favor, preencha seus dados abaixo para confirmar a reserva.</p>
    `;
}

// Botão para voltar do checkout para a tela de busca inicial
if (botaoVoltar) {
    botaoVoltar.addEventListener('click', () => {
        secaoCheckout.style.display = 'none';
        containerPesquisa.style.display = 'block';
        resultadosQuartos.style.display = 'grid'; // Volta para o layout original
    });
}



// FUNCIONALIDADE 4 - Máscara Dinâmica de Cartão e Validação

if (campoCartao) {
    // Aplica máscara automática adicionando espaço a cada 4 números digitados
    campoCartao.addEventListener('input', (event) => {
        let valor = event.target.value;
        
        // Remove tudo o que não for número usando expressão regular (Regex)
        valor = valor.replace(/\D/g, '');
        
        // Adiciona o espaçamento padrão de cartões de crédito
        valor = valor.replace(/(\d{4})(\d)/, '$1 $2');
        valor = valor.replace(/(\d{4}) (\d{4})(\d)/, '$1 $2 $3');
        valor = valor.replace(/(\d{4}) (\d{4}) (\d{4})(\d)/, '$1 $2 $3 $4');
        
        event.target.value = valor;
    });
}

if (formularioCheckout) {
    // Manipula o envio do checkout final
    formularioCheckout.addEventListener('submit', (event) => {
        event.preventDefault();

        const nomeHospede = document.getElementById('nome-hospede').value;
        const numeroCartao = campoCartao.value;

        // Regra de validação: O cartão formatado precisa ter exatamente 16 números (19 caracteres com espaços)
        if (numeroCartao.length < 19) {
            alert('⚠️ Por favor, digite um número de cartão de crédito válido com 16 dígitos.');
            return;
        }

        // Sucesso total no fluxo de Front-end!
        alert(`🎉 Sucesso, ${nomeHospede}!\nSua reserva para o "${quartoSelecionadoAtual.nome}" foi pré-confirmada com sucesso!\nObrigado por escolher o Bivago.`);
        
        // Reseta a página e volta para a busca inicial
        formularioCheckout.reset();
        divResumoPreco.style.display = 'none'; // Esconde a faixa azul após fechar a reserva
        botaoVoltar.click();
    });
}