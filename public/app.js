const formularioPesquisa = document.getElementById('formulario-pesquisa');
const resultadosQuartos = document.getElementById('resultados-quartos');

formularioPesquisa.addEventListener('submit', async (event) => {
    event.preventDefault(); // nao deixa a pagina recarregar

    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const tipo = document.getElementById('tipo-quarto').value;

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