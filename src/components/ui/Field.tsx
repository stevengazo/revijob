import type { InputHTMLAttributes, ReactNode } from 'react'
import { fieldClass, labelClass } from './styles'

/** Envoltorio de etiqueta + control. Acepta cualquier control (input, select, textarea) como hijo. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={labelClass}>
      {label}
      {children}
    </label>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

/** Conveniencia para el caso más común: etiqueta + <input> con el estilo estándar. */
export default function TextField({ label, className = '', ...rest }: TextFieldProps) {
  return (
    <Field label={label}>
      <input className={`${fieldClass} ${className}`} {...rest} />
    </Field>
  )
}
