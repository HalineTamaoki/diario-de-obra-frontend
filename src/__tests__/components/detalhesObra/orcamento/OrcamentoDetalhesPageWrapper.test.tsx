import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrcamentoDetalhesPageWrapper } from '../../../../components/detalhesObra/orcamento/OrcamentoDetalhesPageWrapper';
import { NomeInputMock, type NomeInputMockProps } from '../../../mocks/NomeObraInputMock';

vi.mock('../../../../components/common/NomeInput', () => ({
    NomeInput: (props: NomeInputMockProps) => <NomeInputMock {...props} />
}));

describe('OrcamentoDetalhesPageWrapper', () => {
    const mockOrcamento = {
        id: 1,
        empresa: 'Loja de Materiais',
        valor: 1000,
        descricao: 'Teste',
        itens: []
    };

    const defaultProps = {
        editMode: false,
        voltar: vi.fn(),
        setEditMode: vi.fn(),
        orcamento: mockOrcamento as any,
        editar: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar o nome da empresa e os filhos corretamente', () => {
        render(
            <OrcamentoDetalhesPageWrapper {...defaultProps}>
                <div data-testid="child-content">Conteúdo Interno</div>
            </OrcamentoDetalhesPageWrapper>
        );

        expect(screen.getByText('Loja de Materiais')).toBeInTheDocument();
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('deve entrar em modo de edição ao clicar no nome da empresa', () => {
        render(<OrcamentoDetalhesPageWrapper {...defaultProps} >Children</OrcamentoDetalhesPageWrapper>);
        
        const btnNome = screen.getByText('Loja de Materiais').closest('button');
        if (btnNome) fireEvent.click(btnNome);

        expect(screen.getByTestId('nome-input')).toBeInTheDocument();
        expect(defaultProps.setEditMode).toHaveBeenCalledWith(true);
    });

    it('deve iniciar diretamente em modo de edição se a prop editMode for true', () => {
        render(<OrcamentoDetalhesPageWrapper {...defaultProps} editMode={true} >Children</OrcamentoDetalhesPageWrapper>);
        
        expect(screen.getByTestId('nome-input')).toBeInTheDocument();
        expect(screen.queryByText('Loja de Materiais', { selector: 'span' })).not.toBeInTheDocument();
    });

    it('deve chamar a função editar preservando os dados do orçamento ao mudar o nome', () => {
        render(<OrcamentoDetalhesPageWrapper {...defaultProps} editMode={true} >children</OrcamentoDetalhesPageWrapper>);
        
        const input = screen.getByTestId('nome-input-input');
        fireEvent.change(input, { target: { value: 'Novo Nome' } });

        expect(defaultProps.editar).toHaveBeenCalledWith({
            ...mockOrcamento,
            empresa: 'Novo Nome'
        });
    });
});