import { Endereco } from "./endereco.model";
import { Usuario } from "./usuario.model";

export class Cliente {
    id!: number;
    nome!: string;
    cpf!: string;
    email!: string;
    numeroRegistro_posse_porte!: string;
    usuario!: Usuario;
    telefones?: string[]; // Telefones como array de strings
    enderecos?: Endereco[]; // Endereços como array de objetos do tipo Endereco
}
