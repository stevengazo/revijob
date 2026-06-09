import type { ButtonHTMLAttributes } from 'react'
import { primaryButtonClass } from './styles'

/** Botón de acción principal con el gradiente violeta→azul. */
export default function PrimaryButton({ className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${primaryButtonClass} ${className}`} {...rest} />
}
