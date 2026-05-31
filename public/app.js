// ==========================================
// 1. DADOS E VARIÁVEIS DE ESTADO
// ==========================================
const quartos = [
    {
        id: 1,
        nome: 'Quarto Standard Charmoso',
        tipo: 'standard',
        descricao: 'Ar condicionado, Wi-Fi e TV a cabo. Perfeito para uma estadia prática e confortável.',
        preco: 180,
        imagem: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        nome: 'Quarto Deluxe King Size',
        tipo: 'deluxe',
        descricao: 'Cama King Size, frigobar, varanda e decoração premium para máximo conforto.',
        preco: 350,
        imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        nome: 'Suite Luxo com Varanda',
        tipo: 'suite',
        descricao: 'Hidromassagem, sala de estar, vista panorâmica e serviço de quarto 24h.',
        preco: 600,
        imagem: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

let quartoSelecionadoAtual = null;
let historicoReservas = [];

// ==========================================
// 2. MAPEAMENTO DOS ELEMENTOS DO DOM
// ==========================================
const formularioPesquisa = document.getElementById('formulario-pesquisa');
const secaoBusca = document.getElementById('secao-busca'); 
const resultadosQuartos = document.getElementById('resultados-quartos');
const secaoRecomendacoes = document.getElementById('recomendacoes');
const secaoCheckout = document.getElementById('secao-checkout');
const detalhesCheckout = document.getElementById('detalhes-reserva-checkout');
const botaoLimparBusca = document.getElementById('botao-limpar-busca');
const botaoVoltar = document.getElementById('botao-voltar');
const resumoPreco = document.getElementById('resumo-preco');

const modalSucesso = document.getElementById('modal-sucesso');
const mensagemSucesso = document.getElementById('mensagem-sucesso');
const botaoFecharModal = document.getElementById('botao-fechar-modal');

const secaoMinhasReservas = document.getElementById('secao-minhas-reservas');
const listaReservas = document.getElementById('lista-reservas');
const btnMinhasReservas = document.getElementById('btn-minhas-reservas');
const btnVoltarHome = document.getElementById('botao-voltar-home');

// ==========================================
// 3. PESQUISAR QUARTOS
// ==========================================
if (formularioPesquisa) {
    formularioPesquisa.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const tipoSelecionado = document.getElementById('tipo-quarto').value;
        const quartosFiltrados = quartos.filter(quarto => quarto.tipo === tipoSelecionado);

        resultadosQuartos.innerHTML = '';

        if (quartosFiltrados.length === 0) {
            resultadosQuartos.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhum quarto encontrado para este tipo.</p>';
        } else {
            quartosFiltrados.forEach(quarto => {
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
        }

        // Cálculo de datas e preços
        const checkinVal = document.getElementById('checkin').value;
        const checkoutVal = document.getElementById('checkout').value;

        if (checkinVal && checkoutVal && quartosFiltrados.length > 0) {
            const data1 = new Date(checkinVal);
            const data2 = new Date(checkoutVal);
            const diferencaTempo = Math.abs(data2 - data1);
            const diarias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

            if (diarias > 0) {
                const preco = quartosFiltrados[0].preco;
                const total = preco * diarias;
                if (resumoPreco) {
                    resumoPreco.innerHTML = `✨ <strong>Período Selecionado:</strong> ${diarias} diária(s) &nbsp;|&nbsp; <strong>Valor por noite:</strong> R$ ${preco} &nbsp;|&nbsp; <strong>Total Estimado: R$ ${total}</strong>`;
                    resumoPreco.style.display = 'block';
                }
            }
        }

        // Troca de Telas
        if (botaoLimparBusca) botaoLimparBusca.style.display = 'block';
        if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
        if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'none';
        resultadosQuartos.style.display = 'grid'; 
    });
}

// ==========================================
// 4. LIMPAR BUSCA
// ==========================================
if (botaoLimparBusca) {
    botaoLimparBusca.addEventListener('click', () => {
        if (formularioPesquisa) formularioPesquisa.reset(); 
        if (resultadosQuartos) {
            resultadosQuartos.innerHTML = ''; 
            resultadosQuartos.style.display = 'none';
        }
        if (resumoPreco) resumoPreco.style.display = 'none';
        if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'block'; 
        botaoLimparBusca.style.display = 'none'; 
    });
}

// ==========================================
// 5. SELECIONAR QUARTO (IR PARA CHECKOUT)
// ==========================================
function selecionarQuarto(id, nome, preco) {
    quartoSelecionadoAtual = { id, nome, preco };

    // Esconde as telas anteriores
    if (secaoBusca) secaoBusca.style.display = 'none';
    if (resultadosQuartos) resultadosQuartos.style.display = 'none';
    if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
    if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'none';

    // Mostra o checkout
    if (secaoCheckout) secaoCheckout.style.display = 'block';

    // Injeta os dados da reserva
    if (detalhesCheckout) {
        detalhesCheckout.innerHTML = `
            <h3>📍 Resumo da sua Escolha:</h3>
            <p><strong>Acomodação:</strong> ${nome}</p>
            <p><strong>Valor unitário:</strong> R$ ${preco}/noite</p>
            <p style="font-size: 0.9em; color: #555;">Por favor, preencha seus dados abaixo para confirmar a reserva.</p>
        `;
    }

    // Autopreenchimento de datas
    const checkinPesquisa = document.getElementById('checkin');
    const checkoutPesquisa = document.getElementById('checkout');
    const inputCheckoutCheckin = document.getElementById('checkout-checkin');
    const inputCheckoutCheckout = document.getElementById('checkout-checkout');

    if (checkinPesquisa && inputCheckoutCheckin) {
        inputCheckoutCheckin.value = checkinPesquisa.value || '';
    }
    if (checkoutPesquisa && inputCheckoutCheckout) {
        inputCheckoutCheckout.value = checkoutPesquisa.value || '';
    }
}

// ==========================================
// 6. VOLTAR DO CHECKOUT
// ==========================================
if (botaoVoltar) {
    botaoVoltar.addEventListener('click', () => {
        if (secaoCheckout) secaoCheckout.style.display = 'none';
        if (secaoBusca) secaoBusca.style.display = 'block';

        if (resultadosQuartos && resultadosQuartos.innerHTML.trim() !== '') {
            resultadosQuartos.style.display = 'grid';
        } else {
            if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'block';
        }
    });
}

// ==========================================
// 7. CONFIRMAR RESERVA E ABRIR MODAL
// ==========================================
const formCheckout = document.getElementById('formulario-checkout');

if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const dataIn = document.getElementById('checkout-checkin').value;
        const dataOut = document.getElementById('checkout-checkout').value;
        const hospede = document.getElementById('nome-hospede').value;

        historicoReservas.push({
            quarto: quartoSelecionadoAtual.nome,
            preco: quartoSelecionadoAtual.preco,
            hospede: hospede,
            checkin: dataIn,
            checkout: dataOut,
            status: 'Confirmada ✔️'
        });

        if (mensagemSucesso && modalSucesso) {
            mensagemSucesso.innerHTML = `A sua reserva para o <strong>${quartoSelecionadoAtual?.nome}</strong> foi realizada com sucesso!<br><br><span style="font-size: 0.85em; color: #888;">(Este é um sistema simulado)</span>`;
            modalSucesso.style.display = 'flex'; 
        }
    });
}

// Fechar o Modal
if (botaoFecharModal) {
    botaoFecharModal.addEventListener('click', () => {
        if (modalSucesso) modalSucesso.style.display = 'none';
        if (formCheckout) formCheckout.reset();
        
        if (botaoVoltar) botaoVoltar.click();
        if (botaoLimparBusca) botaoLimparBusca.click();
    });
}

// ==========================================
// 8. PAINEL MINHAS RESERVAS
// ==========================================
function renderizarReservas() {
    if (secaoBusca) secaoBusca.style.display = 'none';
    if (resultadosQuartos) resultadosQuartos.style.display = 'none';
    if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
    if (secaoCheckout) secaoCheckout.style.display = 'none';

    listaReservas.innerHTML = '';

    if (historicoReservas.length === 0) {
        listaReservas.innerHTML = '<div class="mensagem-vazia">Você ainda não possui nenhuma reserva ativa.</div>';
    } else {
        historicoReservas.forEach(reserva => {
            const card = document.createElement('div');
            card.className = 'cartao-reserva-feita';
            
            const dataInFormatada = reserva.checkin ? reserva.checkin.split('-').reverse().join('/') : 'N/A';
            const dataOutFormatada = reserva.checkout ? reserva.checkout.split('-').reverse().join('/') : 'N/A';

            card.innerHTML = `
                <div class="info-reserva">
                    <h3>${reserva.quarto}</h3>
                    <p><strong>Hóspede:</strong> ${reserva.hospede}</p>
                    <p><strong>Período:</strong> ${dataInFormatada} a ${dataOutFormatada}</p>
                    <p><strong>Total:</strong> R$ ${reserva.preco} / noite</p>
                </div>
                <div class="status-badge">${reserva.status}</div>
            `;
            listaReservas.appendChild(card);
        });
    }

    if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'block';
}

if (btnMinhasReservas) btnMinhasReservas.addEventListener('click', renderizarReservas);

if (btnVoltarHome) {
    btnVoltarHome.addEventListener('click', () => {
        if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'none';
        if (secaoBusca) secaoBusca.style.display = 'block';
        if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'block';
        
        if (formularioPesquisa) formularioPesquisa.reset();
        if (resultadosQuartos) resultadosQuartos.style.display = 'none';
        if (resumoPreco) resumoPreco.style.display = 'none';
        if (botaoLimparBusca) botaoLimparBusca.style.display = 'none';
    });
}