
export type NomeInputMockProps = {sairModoEdicao: () => void, editar?: (value: string) => void, valorInicial?: string}
export const NomeInputMock = ({sairModoEdicao, editar, valorInicial}: NomeInputMockProps) => {
    return (
        <div data-testid="nome-input">
            <input data-testid="nome-input-input" onChange={e => editar?.(e.target.value)} defaultValue={valorInicial}/>
            <button onClick={sairModoEdicao}>Fechar Edição</button>
        </div>
    )
}
