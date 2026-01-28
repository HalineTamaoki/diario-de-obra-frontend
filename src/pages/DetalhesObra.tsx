import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '../app/store';
import { AddInput } from '../components/common/AddInput';
import { ItemObraCard } from '../components/detalhesObra/ItemObraCard';
import { PageLayout } from '../components/layout/PageLayout';
import { itemsObraActions } from '../features/itemsObraSlice';
import type { ItemObra } from '../types/DetalhesObra';

export const DetalhesObra = () => {
    const { idObra } = useParams();
    const { itemsObra } = useSelector((state: RootState) => state.detalhesObra);
    const { obras } = useSelector((state: RootState) => state.obra);
    const dispach = useDispatch();

    const addItem = useCallback((value: string) => dispach(itemsObraActions.addItemObra({nome: value})), []);

    const obra = useMemo(() => obras.find(obra => obra.id === parseInt(idObra ?? '0')), [idObra, obras]);

    useEffect(() => {
        sessionStorage.setItem('ultimaObraVista', idObra ?? '0');
    }, []);
    
    const clearSessionStorage = useCallback(() => {
        sessionStorage.removeItem('ultimaObraVista');
    }, []);

    return (
        <PageLayout 
            titulo={obra?.nome ?? 'Itens da obra'} 
            id="detalhes-obra" 
            backPath='/' 
            onClick={clearSessionStorage}
        >
            <AddInput 
                id='adicionar-item-obra' 
                placeholder="Adicionar novo item"
                add={addItem}
                className='md:w-[70%] lg:w-1/2'
            />
            {itemsObra.length === 0 && 
                <p className="text-gray-500 text-center md:text-start! md:px-2">Nenhum item adicionado.</p>
            }
            <div className='grid gap-3 md:grid-cols-4 mb-4'>
                {itemsObra.map((item: ItemObra, index: number) => <ItemObraCard 
                    key={item.id}
                    itemObra={item}
                    index={index}
                />)}
            </div>
        </PageLayout>
    )
}
