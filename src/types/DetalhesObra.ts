export type EtapasObra = 'ideacao' | 'orcamento' | 'execucao' | 'finalizado';

export type ItemObra = {
    id: number;
    nome: string;
    ultimaEtapa: EtapasObra;
}