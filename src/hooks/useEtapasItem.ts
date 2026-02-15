import { obraApi } from '../services/obraApi';
import type { EtapasObra } from '../types/DetalhesObra';
import { useAppDispatch } from './useAppDispatch';

const getProximaEtapa = (etapa: EtapasObra): EtapasObra => {
    const fluxos: Record<string, EtapasObra> = {
        ideacao: 'orcamento',
        orcamento: 'execucao',
        execucao: 'finalizado'
    };
    return fluxos[etapa] || 'ideacao';
};

const getEtapaAnterior = (etapa: EtapasObra): EtapasObra => {
    const fluxos: Record<string, EtapasObra> = {
        orcamento: 'ideacao',
        execucao: 'orcamento',
        finalizado: 'execucao'
    };
    return fluxos[etapa] || 'finalizado';
};

export const useEtapasItem = (idObra: number) => {
    const dispatch = useAppDispatch();

    const avancarEtapa = (idItem: number) => {
        dispatch(
            obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                const item = draft.items.find(i => i.id === idItem);
                if (item) {
                    item.ultimaEtapa = getProximaEtapa(item.ultimaEtapa);
                }
            })
        );
    };

    const voltarEtapa = (idItem: number) => {
        dispatch(
            obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                const item = draft.items.find(i => i.id === idItem);
                if (item) {
                    item.ultimaEtapa = getEtapaAnterior(item.ultimaEtapa); 
                }
            })
        );
    };

    return { avancarEtapa, voltarEtapa };
};