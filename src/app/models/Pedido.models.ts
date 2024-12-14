import { FormaDePagamento } from "./formaDePagamanto.model";
import { ItemPedido } from "./itemPedido.models";

export class Pedido{
    itens!: ItemPedido[];
    idFormaDePagamento!: FormaDePagamento;
}