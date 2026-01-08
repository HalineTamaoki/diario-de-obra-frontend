import type { Execucao } from "./Execucao";
import type { Finalizacao } from "./Finalizacao";
import type { Ideia } from "./Ideia";
import type { OrcamentoResumo } from "./Orcamento";

export type EtapasObra = 'ideacao' | 'orcamento' | 'execucao' | 'finalizado';

export type ItemObra = {
    id: number;
    nome: string;
    ultimaEtapa: EtapasObra;
    ideacao?: Ideia[];
    orcamento?: OrcamentoResumo[];
    execucao?: Execucao;
    finalizacao?: Finalizacao
}

export type IdItemId = { 
  idItem: number;
  id: number;
}