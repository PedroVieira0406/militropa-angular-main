import { Acabamento } from "./acabamento.model";
import { TipoArma } from "./tipoArma.model";

export class Arma {
    id!: number;
    nome!: string;
    qtdNoEstoque!: number;
    preco!: number;
    descricao!: string;
    tipo!: TipoArma;
    marca!: string;
    idsAcabamentos!: Acabamento[]; //array de id
    calibre!: string;
    comprimentoDoCano!: string;
    capacidadeDeTiro!: number;
    numeroSigma!: string;
    numeroDaArma!: string;
    modelo!: string;
    rna!: string;
    nomeImagem!: string;
}
