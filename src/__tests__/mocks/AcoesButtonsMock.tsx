import type { AcoesButtonItens } from "../../components/common/AcoesButtonItens";

export type AcoesButtonsMockProps = {color?: string, itens: AcoesButtonItens[], disabled?: boolean}
export const AcoesButtonsMock = ({ itens, color, disabled }: AcoesButtonsMockProps) => (
    <div data-testid="acoes-button">
        {itens.map(item => (
            <button className={color} data-testid={item.id} key={item.id} onClick={e => item.onClick(e as unknown as MouseEvent)} disabled={disabled}>
                {item.text}
            </button>
        ))}
    </div>
);