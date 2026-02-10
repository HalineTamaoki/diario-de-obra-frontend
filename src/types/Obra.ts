import type { NomeId } from "./Common";
import type { ItemObra } from "./DetalhesObra";

export type Obra = NomeId & {
    porcentagem: number;
}

export type ObraDetalhada = {
    idObra: number;
    nome: string;
    items: ItemObra[];
}