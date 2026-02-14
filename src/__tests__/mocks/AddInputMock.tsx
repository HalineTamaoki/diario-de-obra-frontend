
export type AddInputMockProps = {placeholder: string, id: string, add: (value: string) => void}

export const AddInputMock = ({placeholder, id, add}: AddInputMockProps) => {
    return (
        <input placeholder={placeholder} onChange={e => add(e.target.value)} id={id} data-testid={id}/>
    )
}
