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
                    resumoPreco.innerHTML = ` <strong>Período Selecionado:</strong> ${diarias} diária(s) &nbsp;|&nbsp; <strong>Valor por noite:</strong> R$ ${preco} &nbsp;|&nbsp; <strong>Total Estimado: R$ ${total}</strong>`;
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
    formCheckout.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Captura os dados do formulário
        const reservaDados = {
            quarto: quartoSelecionadoAtual.nome,
            preco: quartoSelecionadoAtual.preco,
            hospede: document.getElementById('nome-hospede').value,
            checkin: document.getElementById('checkout-checkin').value,
            checkout: document.getElementById('checkout-checkout').value
        };

        // Envia para o seu servidor (que está rodando na porta 3000)
        try {
            const resposta = await fetch('http://localhost:3000/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaDados)
            });

            if (resposta.ok) {
                // Se o servidor respondeu com sucesso
                if (mensagemSucesso && modalSucesso) {
                    mensagemSucesso.innerHTML = `Reserva confirmada no MySQL!`;
                    modalSucesso.style.display = 'flex'; 
                }
            }
        } catch (erro) {
            console.error("Erro na conexão:", erro);
            alert("Erro ao conectar com o servidor. Verifique se o 'npm run dev' ainda está ligado!");
        }
    });
}

// Nota: mensagem de sucesso já é tratada após resposta do servidor no formulário de checkout.

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
// 8. PAINEL MINHAS RESERVAS (BUSCANDO DO MYSQL)
// ==========================================
async function renderizarReservas() {
    // Esconde outras telas
    if (secaoBusca) secaoBusca.style.display = 'none';
    if (resultadosQuartos) resultadosQuartos.style.display = 'none';
    if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
    if (secaoCheckout) secaoCheckout.style.display = 'none';

    listaReservas.innerHTML = 'Carregando reservas do banco...';

    try {
        // Busca os dados reais do seu servidor Node.js
        const resposta = await fetch('http://localhost:3000/api/reservas');
        const reservasDoBanco = await resposta.json();

        listaReservas.innerHTML = '';

        if (reservasDoBanco.length === 0) {
            listaReservas.innerHTML = '<div class="mensagem-vazia">Nenhuma reserva encontrada no banco de dados.</div>';
        } else {
            reservasDoBanco.forEach(reserva => {
                const card = document.createElement('div');
                card.className = 'cartao-reserva-feita';
                
                // Formatação simples de data (MySQL retorna string ISO)
                const dataIn = reserva.checkin ? reserva.checkin.split('T')[0] : 'N/A';
                const dataOut = reserva.checkout ? reserva.checkout.split('T')[0] : 'N/A';

                card.innerHTML = `
                    <div class="info-reserva">
                        <h3>${reserva.quarto}</h3>
                        <p><strong>Hóspede:</strong> ${reserva.hospede}</p>
                        <p><strong>Período:</strong> ${dataIn} a ${dataOut}</p>
                        <p><strong>Total:</strong> R$ ${reserva.preco}</p>
                    </div>
                    <div class="status-badge">${reserva.status || 'Confirmada ✔️'}</div>
                `;
                listaReservas.appendChild(card);
            });
        }
    } catch (erro) {
        listaReservas.innerHTML = '<div class="mensagem-vazia">Erro ao conectar com o banco de dados. Verifique se o servidor está rodando.</div>';
    }

    if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'block';
}

// FORÇAR VÍNCULO DO BOTÃO
window.onload = () => {
    const btn = document.getElementById('btn-minhas-reservas');
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("Evento disparado!");
            renderizarReservas();
        });
        console.log("Evento vinculado com sucesso!");
    } else {
        console.error("ID 'btn-minhas-reservas' não foi achado no HTML.");
    }

    // ==========================================
    // BOTÃO VOLTAR PARA HOME
    // ==========================================
    const btnVoltar = document.getElementById('botao-voltar-home');
    
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            // Recarrega a página inteira. É a forma mais limpa de voltar para a Home!
            window.location.reload();
        });
    }
};