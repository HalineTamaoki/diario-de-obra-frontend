import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AddInput } from '../components/common/AddInput';
import { ItemObraCard } from '../components/detalhesObra/ItemObraCard';
import { PageLayout } from '../components/layout/PageLayout';
import { mostrarNotificacao } from '../features/notificacaoSlice';
import { useCadastrarItemMutation } from '../services/itemObraApi';
import { useObterObraDetalhadaQuery } from '../services/obraApi';
import type { ItemObra } from '../types/DetalhesObra';
import { Spinner } from 'react-bootstrap';

export const DetalhesObra = () => {
    const { idObra } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openItems, setOpenItems] = useState<number[]>(() => {
        const saved = localStorage.getItem('accordion_state');
        return saved ? JSON.parse(saved) : [];
    });

    const obraIdNum = Number(idObra);
    const isIdValido = !Number.isNaN(obraIdNum) && obraIdNum > 0;
    const { data: obraDetalhada, isLoading: isLoadingItens } = useObterObraDetalhadaQuery(obraIdNum, {
        skip: !isIdValido,
    });
    const [cadastrarItem, { isLoading }] = useCadastrarItemMutation();

    useEffect(() => {
        if (!isIdValido) {
            dispatch(mostrarNotificacao({ variant: 'danger', mensagem: 'ID da obra inválido.' }));
            sessionStorage.removeItem('ultimaObraVista');
            navigate('/', { replace: true });
        }
    }, [isIdValido, navigate, dispatch]);

    const addItem = useCallback((value: string) => 
        cadastrarItem({ obraId: obraIdNum, nome: value }).unwrap()
            .catch((error) => {
                dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao adicionar item.'}));
            })
    , []);

    useEffect(() => {
        if(isIdValido && idObra && obraIdNum !== 0){
            sessionStorage.setItem('ultimaObraVista', idObra);
        }
    }, []);
    
    const clearSessionStorage = useCallback(() => {
        sessionStorage.removeItem('ultimaObraVista');
    }, []);

    const toogleAccordionState = useCallback((id: number) => {
        setOpenItems(prev => 
            prev.includes(id)  ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, [openItems]);
    
    useEffect(() => {
        localStorage.setItem('accordion_state', JSON.stringify(openItems));
    }, [openItems]);

    useEffect(() => {
        if(obraDetalhada?.items && obraDetalhada.items.length !== 0 && 
            !obraDetalhada.items.some(item => openItems.includes(item.id))
        ){
            toogleAccordionState(obraDetalhada.items[0].id);
        }
    }, [obraDetalhada?.items]);

    return isLoadingItens ? <Spinner className='text-(--secondary) border-2'/> : (
        <PageLayout 
            titulo={isLoadingItens ? '' : (obraDetalhada?.nome ?? 'Itens da obra')} 
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
                {obraDetalhada?.items.map((item: ItemObra) => <ItemObraCard 
                    key={item.id}
                    itemObra={item}
                    idObra={obraIdNum}
                    open={openItems.includes(item.id)}
                    toogleAccordionState={toogleAccordionState}
                />)}
            </div>
        </PageLayout>
    )
}
