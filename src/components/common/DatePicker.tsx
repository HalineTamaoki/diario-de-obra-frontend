
import { useRef } from "react";
import { Spinner } from "react-bootstrap";
import { BsCalendar } from "react-icons/bs";

interface DatePickerProps {
  id: string;
  label: string;
  value?: string;
  onChange: (novaDataHora: string) => void;
  labelClassName?: string,
  className?: string,
  inputClassName?: string,
  loading?: boolean,
  type?: 'date' | 'datetime-local'
}

export function DatePicker({
  id,
  label,
  value,
  labelClassName,
  className,
  inputClassName,
  onChange,
  loading,
  type = 'datetime-local'
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  return (
    <div className={`relative items-center max-w-full min-w-0 ${className}`}>
      <label htmlFor={`date-input-${id}`} className={labelClassName}>
        {label}:
      </label>
      <input
        ref={inputRef}
        id={`date-input-${id}`}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md text-sm pr-10 input-no-icon ${inputClassName}`}
        pattern={type === 'datetime-local' ? "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}" : "\d{4}-\d{2}-\d{2}"}
        disabled={loading}
      />
      <button
        type="button"
        className="absolute inset-0 flex items-center justify-end py-0 px-1"
        aria-label="Abrir seletor de data e hora"
        onClick={openPicker}
        style={{ background: "transparent" }}
        disabled={loading}
      >
        {loading ? <Spinner className='text-(--gray) border-2' size='sm'/> : <BsCalendar />}
      </button>
    </div>
  );
}

