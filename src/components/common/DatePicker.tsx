
import React, { useRef } from "react";

type HTMLInputDateWithShowPicker = HTMLInputElement & {
  showPicker?: () => void;
};

interface DatePickerProps {
  id: string;
  label: string;
  value?: string;
  onChange: (novaDataHora: string) => void;
}

export function DatePicker({ id, label, value, onChange }: DatePickerProps) {
  const dateInputRef = useRef<HTMLInputDateWithShowPicker | null>(null);

  return (
    <div className="w-full flex items-center" id={`input-date-${id}-wrapper`}>
      <label
        id={`input-label-${id}`}
        htmlFor={`date-input-${id}`}
        className="block font-medium"
      >
        {label}:
      </label>

      <div className="relative flex rounded-md shadow-sm min-w-0 flex-1">
        <input
          id={`date-input-${id}`}
          type="datetime-local"
          ref={dateInputRef}
          value={value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="block w-[80%] rounded-l-md px-3 text-sm"
          pattern="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}"
        />
      </div>
    </div>
  );
}
