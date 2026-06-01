// ==========================================
// 1. DADOS E VARIÁVEIS DE ESTADO
// ==========================================
const quartos = [
    { id: 1, nome: 'Quarto Standard Charmoso', tipo: 'standard', descricao: 'Ar condicionado, Wi-Fi e TV a cabo. Perfeito para uma estadia prática e confortável.', preco: 180, imagem: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 2, nome: 'Quarto Deluxe King Size', tipo: 'deluxe', descricao: 'Cama King Size, frigobar, varanda e decoração premium para máximo conforto.', preco: 350, imagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 3, nome: 'Suite Luxo com Varanda', tipo: 'suite', descricao: 'Hidromassagem, sala de estar, vista panorâmica e serviço de quarto 24h.', preco: 600, imagem: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

let quartoSelecionadoAtual = null;

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

// ==========================================
// 3. PESQUISAR QUARTOS
// ==========================================
if (formularioPesquisa) {
    formularioPesquisa.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a página de recarregar com o '?'
        
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

    if (secaoBusca) secaoBusca.style.display = 'none';
    if (resultadosQuartos) resultadosQuartos.style.display = 'none';
    if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
    if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'none';
    if (secaoCheckout) secaoCheckout.style.display = 'block';

    if (detalhesCheckout) {
        detalhesCheckout.innerHTML = `
            <h3>📍 Resumo da sua Escolha:</h3>
            <p><strong>Acomodação:</strong> ${nome}</p>
            <p><strong>Valor unitário:</strong> R$ ${preco}/noite</p>
            <p style="font-size: 0.9em; color: #555;">Por favor, preencha seus dados abaixo para confirmar a reserva.</p>
        `;
    }

    const checkinPesquisa = document.getElementById('checkin');
    const checkoutPesquisa = document.getElementById('checkout');
    const inputCheckoutCheckin = document.getElementById('checkout-checkin');
    const inputCheckoutCheckout = document.getElementById('checkout-checkout');

    if (checkinPesquisa && inputCheckoutCheckin) inputCheckoutCheckin.value = checkinPesquisa.value || '';
    if (checkoutPesquisa && inputCheckoutCheckout) inputCheckoutCheckout.value = checkoutPesquisa.value || '';
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
// 7. CONFIRMAR RESERVA (POST)
// ==========================================
const formCheckout = document.getElementById('formulario-checkout');
if (formCheckout) {
    formCheckout.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!quartoSelecionadoAtual) {
            alert("Erro: Nenhum quarto foi selecionado.");
            return;
        }

        const reservaDados = {
            quarto: quartoSelecionadoAtual.nome,
            preco: quartoSelecionadoAtual.preco,
            hospede: document.getElementById('nome-hospede').value,
            checkin: document.getElementById('checkout-checkin').value,
            checkout: document.getElementById('checkout-checkout').value
        };

        try {
            const resposta = await fetch('http://localhost:3000/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaDados)
            });

            if (resposta.ok) {
                // Buscamos o modal no exato momento do sucesso para evitar o erro 'null'
                const modal = document.getElementById('modal-sucesso');
                
                if (modal) {
                    const tituloSucesso = modal.querySelector('h2');
                    const msgSucesso = document.getElementById('mensagem-sucesso');

                    if (tituloSucesso) tituloSucesso.innerText = "Reserva Confirmada!";
                    if (msgSucesso) msgSucesso.innerText = "A sua reserva foi concluída com sucesso.";
                    
                    modal.style.display = 'flex';
                } else {
                    console.error("Modal de sucesso não encontrado no HTML!");
                    // Se não achar o modal por algum motivo, recarrega a página por segurança
                    window.location.reload(); 
                }
            } else {
                alert("Erro ao confirmar a reserva no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro real na requisição:", erro);
            alert("Erro de conexão com o servidor. Verifique o terminal do Node.");
        }
    });
}

// ==========================================
// 8. FECHAR MODAIS DE SUCESSO
// ==========================================
if (botaoFecharModal) {
    botaoFecharModal.addEventListener('click', () => {
        if (modalSucesso) modalSucesso.style.display = 'none';
        if (formCheckout) formCheckout.reset();
        
        if (secaoCheckout && secaoCheckout.style.display === 'block') {
            window.location.reload(); // Recarrega para voltar à Home limpa
        }
    });
}

// ==========================================
// 9. PAINEL MINHAS RESERVAS (GET)
// ==========================================
async function renderizarReservas() {
    if (secaoBusca) secaoBusca.style.display = 'none';
    if (resultadosQuartos) resultadosQuartos.style.display = 'none';
    if (secaoRecomendacoes) secaoRecomendacoes.style.display = 'none';
    if (secaoCheckout) secaoCheckout.style.display = 'none';

    listaReservas.innerHTML = 'Carregando reservas do banco...';

    try {
        const resposta = await fetch('http://localhost:3000/api/reservas');
        const reservasDoBanco = await resposta.json();

        listaReservas.innerHTML = '';

        if (reservasDoBanco.length === 0) {
            listaReservas.innerHTML = '<div class="mensagem-vazia">Nenhuma reserva encontrada no banco de dados.</div>';
        } else {
            reservasDoBanco.forEach(reserva => {
                const card = document.createElement('div');
                card.className = 'cartao-reserva-feita';

                card.id = `reserva-${reserva.id}`;
                
                const dataIn = reserva.checkin ? reserva.checkin.split('T')[0] : 'N/A';
                const dataOut = reserva.checkout ? reserva.checkout.split('T')[0] : 'N/A';

                card.innerHTML = `
                    <div class="info-reserva">
                        <h3>${reserva.quarto}</h3>
                        <p><strong>Hóspede:</strong> ${reserva.hospede}</p>
                        <p><strong>Período:</strong> ${dataIn} a ${dataOut}</p>
                        <p><strong>Total:</strong> R$ ${reserva.preco}</p>
                    </div>
                    <div class="status-e-acoes" style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                        <div class="status-badge">${reserva.status || 'Confirmada ✔️'}</div>
                        <div class="botoes-acao" style="display: flex; gap: 8px;">
                            <button class="botao-secundario" style="margin: 0; padding: 8px 12px;" 
                                onclick="atualizarReserva(${reserva.id}, '${dataIn}', '${dataOut}')">Editar</button>
                            <button class="botao-excluir" 
                                onclick="deletarReserva(${reserva.id})">Cancelar</button>
                        </div>
                    </div>
                `;
                listaReservas.appendChild(card);
            });
        }
    } catch (erro) {
        listaReservas.innerHTML = '<div class="mensagem-vazia">Erro ao conectar com o banco de dados. Verifique se o servidor está rodando.</div>';
    }

    if (secaoMinhasReservas) secaoMinhasReservas.style.display = 'block';
}

// ==========================================
// 10. DELETAR (DELETE)
// ==========================================
async function deletarReserva(id) {
    const confirmar = window.confirm("Tem certeza que deseja cancelar esta reserva?");
    if (!confirmar) return;

    try {
        const response = await fetch(`http://localhost:3000/api/reservas/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            // 1. Remove o cartão da tela instantaneamente sem dar F5
            const cardRemover = document.getElementById(`reserva-${id}`);
            if (cardRemover) cardRemover.remove();

            // 2. Se apagou o último cartão, mostra a mensagem de lista vazia
            if (listaReservas.children.length === 0) {
                listaReservas.innerHTML = '<div class="mensagem-vazia">Nenhuma reserva encontrada no banco de dados.</div>';
            }

            // 3. Mostra o modal de sucesso
            const tituloSucesso = modalSucesso.querySelector('h2');
            if (tituloSucesso) tituloSucesso.innerText = "Reserva Cancelada!";
            if (mensagemSucesso) mensagemSucesso.innerText = "Sua reserva foi removida do sistema com sucesso.";
            modalSucesso.style.display = 'flex';
            
        } else {
            alert("Erro ao cancelar a reserva no banco de dados.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

// ==========================================
// 11. ATUALIZAR (MODAL E PUT)
// ==========================================
const modalEditar = document.getElementById('modal-editar');
const formEditar = document.getElementById('formulario-editar');
const btnCancelarEdicao = document.getElementById('botao-cancelar-edicao');

function atualizarReserva(id, checkinAtual, checkoutAtual) {
    if(document.getElementById('editar-id')) document.getElementById('editar-id').value = id;
    if(document.getElementById('editar-checkin')) document.getElementById('editar-checkin').value = checkinAtual;
    if(document.getElementById('editar-checkout')) document.getElementById('editar-checkout').value = checkoutAtual;
    if(modalEditar) modalEditar.style.display = 'flex';
}

if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener('click', () => {
        if(modalEditar) modalEditar.style.display = 'none';
    });
}

if (formEditar) {
    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editar-id').value;
        const novoCheckin = document.getElementById('editar-checkin').value;
        const novoCheckout = document.getElementById('editar-checkout').value;

        try {
            const response = await fetch(`http://localhost:3000/api/reservas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkin: novoCheckin, checkout: novoCheckout })
            });

            if (response.ok) {
                if(modalEditar) modalEditar.style.display = 'none';
                const tituloSucesso = modalSucesso.querySelector('h2');
                if (tituloSucesso) tituloSucesso.innerText = "Reserva Atualizada!";
                if (mensagemSucesso) mensagemSucesso.innerText = "As datas da sua reserva foram alteradas com sucesso.";
                modalSucesso.style.display = 'flex';
                renderizarReservas();
            } else {
                alert("Erro ao atualizar a reserva no banco de dados.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });
}

// ==========================================
// 12. EVENTOS DE NAVEGAÇÃO E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnMinhasReservas = document.getElementById('btn-minhas-reservas');
    if (btnMinhasReservas) {
        btnMinhasReservas.addEventListener('click', () => {
            renderizarReservas();
        });
    }

    const btnVoltarHome = document.getElementById('botao-voltar-home');
    if (btnVoltarHome) {
        btnVoltarHome.addEventListener('click', () => {
            window.location.reload();
        });
    }
});