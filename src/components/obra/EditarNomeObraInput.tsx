import { useCallback, useState } from 'react';

export const EditarNomeObraInput = ({valorInicial, sairModoEdicao}: {valorInicial: string, sairModoEdicao: () => void}) => {
    const [value, setValue] = useState<string>(valorInicial)

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        const timer = setTimeout(() => {    
            console.log('teste')
        }, 1000);

        return () => clearTimeout(timer);
    }, [value]);

    const onClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);

    return (
        <input 
            type="text"
            autoFocus
            onClick={onClick}
            className='bg-white'
            value={value} 
            onChange={onChange} 
            onBlur={sairModoEdicao}
        />
    )
}
