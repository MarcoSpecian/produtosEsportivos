const items=document.querySelectorAll('.item');
const taxaEntrega=8;
let total=0;


items.forEach((item)=> {
    item.addEventListener('click', () => {
        item.classList.toggle('selected');
        calcularTotal();
    });
});


function calcularTotal() {
    total=0;
    const itemsSelecionados = document.querySelectorAll('.selected');
    itemsSelecionados.forEach((item) => {
        total += parseFloat(item.dataset.preco);
    });
    if (itemsSelecionados.length > 0) {
        total += taxaEntrega;
    }
    document.getElementById('total').textContent = `Total: R$ ${total.toFixed(2)}`;
    return total;
}


const loadingBtn = document.getElementById('loadingBtn');
if (loadingBtn) {
    loadingBtn.addEventListener('click', () => {
        Swal.fire({   
            title: 'Carregando...',  
            allowOutsideClick: false,
            didOpen: () => { 
                Swal.showLoading();
                finalizarPedido() 
                    .then((pedido) => { 
                        Swal.close(); 
                        exibirMensagemSucesso(pedido);
                    })
                    .catch((erro) => { 
                        Swal.close();
                        Swal.fire('Erro!', erro, 'error');
                    });
            },
        });
    });
}


async function finalizarPedido(){
    return new Promise((resolve, reject) => { 
        const endereco = document.getElementById('endereco').value;  
        const pagamento = document.querySelector('input[name="pagamento"]:checked'); 
        const itemsSelecionados = document.querySelectorAll('.selected'); 
        if (itemsSelecionados.length === 0) {  
            reject('Selecione pelo menos um item para fazer o pedido!');
            return;
        }
        if (!endereco) {
            reject('Por favor, informe o endereço de entrega!');
            return;
        }
        if (!pagamento) {
            reject('Selecione uma forma de pagamento!');
            return;
        }
        const pedido = {
            items: Array.from(itemsSelecionados).map((item) => item.querySelector('h3').textContent), 
            endereco,
            formaPagamento: pagamento.value,
            total: calcularTotal(),
        };
        setTimeout(() => {
            resolve(pedido);
        }, 2000);
    });
}

function exibirMensagemSucesso(pedido) {
    const { items, endereco, formaPagamento, total } = pedido; 
    const mensagem = `
        Itens: ${items.join(', ')}<br>
        Endereço: ${endereco}<br>
        Forma de pagamento: ${formaPagamento}<br>
        Total (com taxa de entrega R$ ${taxaEntrega.toFixed(2)}): R$ ${total.toFixed(2)}<br>
    `;

    Swal.fire('Pedido realizado com sucesso!', mensagem, 'success').then(() => {
        novoPedido();
    });
}
