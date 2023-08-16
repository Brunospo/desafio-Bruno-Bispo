import { cardapio } from "../database/cardapio.js"
import { formasDePagamentoAceitas } from "../database/formasDePagamentoAceitas.js"

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {

        let total = 0

        const formaDePagamentoNaoExiste = !formasDePagamentoAceitas.includes(metodoDePagamento)

        if ( formaDePagamentoNaoExiste ) {
            return "Forma de pagamento inválida!"
        }

        if ( itens.length === 0 ) {
            return "Não há itens no carrinho de compra!"
        }

        const listaDeItens = this.#separarCodigoEQuantidade(itens)

        for (const item of listaDeItens) {

            const { codigo, quantidade } = item

            const itemDoCardapio = cardapio.find(item => item.codigo === codigo)

            if ( !itemDoCardapio ){
                return "Item inválido!"
            }

            if ( quantidade == 0 ){
                return "Quantidade inválida!"
            }

            const itemEhExtra = itemDoCardapio.descricao.includes("extra do ")

            if ( itemEhExtra ) {
                const descricaoDoItemDoCardapio = itemDoCardapio.descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").slice(itemDoCardapio.codigo.length)
                const naoTemItemPrincipal = (!listaDeItens.some(item => descricaoDoItemDoCardapio.includes(item.codigo)))

                if ( naoTemItemPrincipal) {
                    return "Item extra não pode ser pedido sem o principal"
                }
            }

            total += (item.quantidade * itemDoCardapio.valor)

        }

        if(metodoDePagamento === "dinheiro") {
            total *= 0.95
        } else if (metodoDePagamento === "credito") {
            total *= 1.03
          }
        
        return `R$ ${total.toFixed(2).replace(".", ",")}`
    }

    #separarCodigoEQuantidade(arrayDeStrings){
        const result = []

        for (const item of arrayDeStrings) {
            const [codigo, quantidade] = item.split(',')
            result.push({codigo, quantidade})
        }

        return result
    }

}

export { CaixaDaLanchonete };