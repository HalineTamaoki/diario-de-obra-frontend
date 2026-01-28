import { useEffect, useState } from 'react';
import imagePlaceholder from '../../../assets/imagePlaceholder.png';

export const IdeacaoImg = ({ url }: { url: string }) => {
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
        if(url && (url.startsWith('data:image') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'))) {
            setImage(url);
            return;
        }
        
        fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => setImage(data.data.image?.url))
            .catch(() => setImage(url));
    }, [url]);

    return (
        <img
            id={`ideacao-imagem-${url}`}
            src={error || !image ? imagePlaceholder : image}
            alt={error || !image ? "Imagem não disponível" : `Imagem de ${url}`}
            onError={() => setError(true)}
            className='max-w-25 max-h-25'
        />
    )
}
