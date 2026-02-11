import { useCallback, useMemo, useState } from 'react';
import { BsChevronDown, BsChevronUp, BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { mostrarNotificacao } from '../../features/notificacaoSlice';
import { useDeletarItemMutation, useEditarItemMutation } from '../../services/itemObraApi';
import type { ItemObra } from '../../types/DetalhesObra';
import { AcoesButton } from '../common/AcoesButton';
import { NomeInput } from '../common/NomeInput';


export const ItemObraAccordionHeader = ({itemObra, toogleActive, active, idObra}: {itemObra: ItemObra, active: boolean, toogleActive: () => void, idObra: number}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deletarItem, { isLoading: deleteLoading }] = useDeletarItemMutation();
    const [editarItem, { isLoading: editLoading }] = useEditarItemMutation();
    const dispatch = useDispatch();

    const bgColor = useMemo(() => {
        const { ultimaEtapa } = itemObra;
        if (ultimaEtapa === 'ideacao'){
            return 'bg-(--main) hover:bg-(--main-2)'
        } else if (ultimaEtapa === 'orcamento'){
            return 'bg-(--secondary) hover:bg-(--secondary-2)'
        } else if (ultimaEtapa === 'execucao'){
            return 'bg-(--blue) hover:bg-(--blue-2)'
        } else return 'bg-(--green) hover:bg-(--green-2)'
    }, [itemObra.ultimaEtapa]);

    const textColor = useMemo(() => itemObra.ultimaEtapa === 'execucao' ? 'text-white' : 'text-(--black)!', [itemObra.ultimaEtapa]);

    const editar = useCallback((value: string) => {
        editarItem({id: itemObra.id, nome: value, idObra: idObra}).unwrap().catch((error) => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar item.'}));
        });
    }, [itemObra.id, idObra]);

    const deletar = useCallback(() => {
        deletarItem({id: itemObra.id, idObra: idObra}).unwrap().catch((error) => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao deletar item.'}));
        });
    }, [itemObra.id, idObra]);

    return (
        <div 
            className={`flex justify-between w-100 align-items-center px-3 rounded-t-md ${bgColor} ${textColor} ${!active && 'rounded-b-md'}`}
            onClick={toogleActive}
        >
            {editMode ? (
                <NomeInput 
                    id='editar-nome-obra-input'
                    className='py-2.5'
                    valorInicial={itemObra.nome}
                    defaultValue='Nome do item'
                    editar={editar} 
                    sairModoEdicao={() => setEditMode(false)}
                />
            ) : (
                <button className='truncate max-w-[70%] min-w-0 px-0 py-2.5' onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditMode(true)
                }}>
                    <span className='font-semibold'>{itemObra.nome}</span>
                </button>
            )}
            <div className='flex align-items-center gap-1'>
                <AcoesButton 
                    color={textColor} 
                    itens={[
                        {id: 'acoes-obra-deletar', text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
                    ]}
                    loading={deleteLoading || editLoading}
                />
                <button className='p-0'>
                    {active ? <BsChevronUp className='text-xl'/> : <BsChevronDown className='text-xl'/>}
                </button>
            </div>
        </div>
    )
}
