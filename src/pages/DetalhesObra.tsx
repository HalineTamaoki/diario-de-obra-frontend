import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AddInput } from '../components/common/AddInput';
import { ItemObraCard } from '../components/detalhesObra/ItemObraCard';
import { PageLayout } from '../components/layout/PageLayout';
import { addItemObra } from '../features/itemsObraSlice';
import type { ItemObra } from '../types/DetalhesObra';

export const DetalhesObra = () => {
    const { nome } = useParams();
    const { itemsObra } = useSelector((state: any) => state.detalhesObra);
    const dispach = useDispatch();

    const addItem = useCallback((value: string) => dispach(addItemObra({nome: value})), []);

    return (
        <PageLayout 
            titulo={nome ?? 'Itens da obra'} 
            id="detalhes-obra" 
            backPath='/' 
        >
            <AddInput 
                id='adicionar-item-obra' 
                placeholder="Adicionar novo item"
                add={addItem}
            />
            {itemsObra.length === 0 && 
                <p className="text-gray-500 text-center md:text-start! md:px-2">Nenhum item adicionado.</p>
            }
            <div className='grid gap-3 md:grid-cols-4'>
                {itemsObra.map((item: ItemObra, index: number) => <ItemObraCard 
                    key={item.id}
                    itemObra={item}
                    index={index}
                />)}
            </div>
        </PageLayout>
    )
}
