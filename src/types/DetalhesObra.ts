import type { Execucao } from "./Execucao";
import type { Finalizacao } from "./Finalizacao";
import type { Ideia } from "./Ideia";
import type { OrcamentoResumo } from "./Orcamento";

export type EtapasObra = 'ideacao' | 'orcamento' | 'execucao' | 'finalizado';

export const EtapaMap: Record<number, EtapasObra> = {
  0: 'ideacao',
  1: 'orcamento',
  2: 'execucao',
  3: 'finalizado'
};

export type ItemObraBase = {
    id: number;
    nome: string;
    ultimaEtapa: EtapasObra;
}

export type ItemObra = ItemObraBase & {
    ideacao?: Ideia[];
    orcamento?: OrcamentoResumo[];
    execucao?: Execucao;
    finalizacao?: Finalizacao
}

export type IdItemId = { 
  idItem: number;
  id: number;
}