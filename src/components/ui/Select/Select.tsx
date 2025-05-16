// src/components/ui/Select/Select.tsx
import * as React from "react";
import "./Select.css"; // Убедись, что этот CSS файл тоже есть

export interface SelectOption { // Убедись, что этот интерфейс тоже экспортируется, если он нужен извне
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  // id?: string; // id уже есть в React.SelectHTMLAttributes
}

// --- НАЧАЛО ЭКСПОРТА КОМПОНЕНТА ---
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
// --- КОНЕЦ ЭКСПОРТА КОМПОНЕНТА ---
  ({ className = "", options, label, id, placeholder, ...props }, ref) => {
    return (
      <div className={`select-wrapper ${className}`}>
        {label && <label htmlFor={id} className="select-label">{label}</label>}
        <select id={id} className="select-base" ref={ref} {...props}>
          {/* Если placeholder есть, и value не установлено, он должен быть выбран по умолчанию браузером,
              но для явности можно добавить disabled selected опцию */}
          {placeholder && !props.value && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select"; // Для удобства в React DevTools