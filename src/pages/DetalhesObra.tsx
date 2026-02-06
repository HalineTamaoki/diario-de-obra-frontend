import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AddInput } from '../components/common/AddInput';
import { ItemObraCard } from '../components/detalhesObra/ItemObraCard';
import { PageLayout } from '../components/layout/PageLayout';
import { mostrarNotificacao } from '../features/notificacaoSlice';
import { useCadastrarItemMutation } from '../services/itemObraApi';
import { useObterObraDetalhadaQuery } from '../services/obraApi';
import type { ItemObra } from '../types/DetalhesObra';

export const DetalhesObra = () => {
    const { idObra } = useParams();
    const navigate = useNavigate();

    if(!idObra || idObra === '0' || parseInt(idObra).toString() === 'NaN') {
        navigate('/');
        return null;
    }

    const { data: obraDetalhada } = useObterObraDetalhadaQuery(parseInt(idObra));
    const [cadastrarItem, { isLoading }] = useCadastrarItemMutation()
    const dispatch = useDispatch();

    const addItem = useCallback((value: string) => 
        cadastrarItem({ obraId: parseInt(idObra), nome: value }).unwrap()
            .catch((error) => {
                dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao adicionar item.'}));
            })
    , []);

    useEffect(() => {
        sessionStorage.setItem('ultimaObraVista', idObra ?? '0');
    }, []);
    
    const clearSessionStorage = useCallback(() => {
        sessionStorage.removeItem('ultimaObraVista');
    }, []);

    return (
        <PageLayout 
            titulo={obraDetalhada?.nome ?? 'Itens da obra'} 
            id="detalhes-obra" 
            backPath='/' 
            onClick={clearSessionStorage}
        >
            <AddInput 
                id='adicionar-item-obra' 
                placeholder="Adicionar novo item"
                add={addItem}
                className='md:w-[70%] lg:w-1/2'
                loading={isLoading}
            />
            {!obraDetalhada?.items || obraDetalhada.items.length === 0 && 
                <p className="text-gray-500 text-center md:text-start! md:px-2">Nenhum item adicionado.</p>
            }
            <div className='grid gap-3 md:grid-cols-4 mb-4'>
                {obraDetalhada?.items.map((item: ItemObra, index: number) => <ItemObraCard 
                    key={item.id}
                    itemObra={item}
                    index={index}
                />)}
            </div>
        </PageLayout>
    )
}
