import { useCallback } from "react";
import { BsTrash3 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { removerObra } from "../../features/obraSlice";
import { AcaoButton } from "../common/AcaoButton";

export const DeletarObraButton = ({idObra}: {idObra: number}) => {
    const dispach = useDispatch();

    const deletar = useCallback(() => {
        dispach(removerObra(idObra));
    }, []);

    return (
        <AcaoButton id='acoes-obra-deletar' onClick={deletar} className="text-(--red)">
            <BsTrash3 />
            Deletar
        </AcaoButton>
    )
}