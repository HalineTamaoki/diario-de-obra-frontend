import React from 'react'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout';

export const DetalhesObra = () => {
    const { nome } = useParams();

    return (
        <PageLayout titulo={nome ?? 'Itens da obra'} id="detalhes-obra" backPath='/'>
            <div></div>
        </PageLayout>
    )
}
