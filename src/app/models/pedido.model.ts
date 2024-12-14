import { FormaDePagamento } from "./formaDePagamanto.model";
import { ItemPedido } from "./itemPedido.model";

export class Pedido{
    id!: number;
    itens!: ItemPedido[];
    formaDePagamento!: FormaDePagamento;
}