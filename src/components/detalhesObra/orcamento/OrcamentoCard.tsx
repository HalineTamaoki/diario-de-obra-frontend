import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const OrcamentoCard = ({id}: {id: number}) => {
    const { resumoOrcamentos } = useSelector((state: any) => state.orcamento);

    return (
        <div>OrcamentoCard</div>
    )
}
