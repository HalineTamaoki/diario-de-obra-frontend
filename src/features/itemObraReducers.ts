import type { EtapasObra } from "../types/DetalhesObra";

export const getProximaEtapa = (etapa: EtapasObra): EtapasObra => {
  const fluxos: Record<string, EtapasObra> = {
    ideacao: 'orcamento',
    orcamento: 'execucao',
    execucao: 'finalizado'
  };
  return fluxos[etapa] || 'ideacao';
};

export const getEtapaAnterior = (etapa: EtapasObra): EtapasObra => {
  const fluxos: Record<string, EtapasObra> = {
    orcamento: 'ideacao',
    execucao: 'orcamento',
    finalizado: 'execucao'
  };
  return fluxos[etapa] || 'finalizado';
};