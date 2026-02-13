import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DatePicker } from '../../../components/common/DatePicker';

vi.mock('../../utils/DateUtils', () => ({
  formatValue: vi.fn((_, val) => val || ''),
}));

describe('DatePicker', () => {
    const mockOnChange = vi.fn();
    const defaultProps = {
        id: 'data-teste',
        label: 'Data de Início',
        onChange: mockOnChange,
    };

    beforeEach(() => {
        mockOnChange.mockClear();
        HTMLInputElement.prototype.showPicker = vi.fn();
    });

    it('deve renderizar o label e o input corretamente', () => {
        render(<DatePicker {...defaultProps} />);
        
        expect(screen.getByText('Data de Início:')).toBeInTheDocument();
        const input = screen.getByLabelText('Data de Início:');
        expect(input).toHaveAttribute('type', 'datetime-local');
    });

    it('deve chamar onChange com o formato de timezone correto para datetime-local', () => {
        render(<DatePicker {...defaultProps} />);
        const input = screen.getByLabelText('Data de Início:');

        fireEvent.change(input, { target: { value: '2023-10-25T14:30' } });

        expect(mockOnChange).toHaveBeenCalledWith('2023-10-25T14:30-03:00');
    });

    it('deve formatar corretamente quando o tipo for "date"', () => {
        render(<DatePicker {...defaultProps} type="date" />);
        const input = screen.getByLabelText('Data de Início:');

        fireEvent.change(input, { target: { value: '2023-10-25' } });

        expect(mockOnChange).toHaveBeenCalledWith('2023-10-25T00:00:00-03:00');
    });

    it('deve acionar o showPicker ao clicar no botão do calendário', () => {
        render(<DatePicker {...defaultProps} />);
        const button = screen.getByRole('button', { name: /abrir seletor/i });
        
        fireEvent.click(button);

        expect(HTMLInputElement.prototype.showPicker).toHaveBeenCalled();
    });

    it('deve mostrar o spinner e desabilitar interações quando loading for true', () => {
        render(<DatePicker {...defaultProps} loading={true} />);
        
        const input = screen.getByLabelText('Data de Início:');
        const button = screen.getByRole('button', { name: /abrir seletor/i });

        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
        expect(document.querySelector('.spinner-border')).toBeInTheDocument();
    });
});