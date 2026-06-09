import { useEffect, useRef } from 'react'

/**
 * Banner de Google AdSense.
 *
 * Para activarlo en producción, define tu ID de cliente y de bloque de anuncio.
 * Mientras estén vacíos se muestra un marcador de posición y NO se carga ningún
 * script externo (útil en desarrollo y para no romper la maquetación).
 *
 * 1. Crea una cuenta en https://www.google.com/adsense y añade tu sitio.
 * 2. Copia tu "ca-pub-XXXXXXXXXXXXXXXX" en ADSENSE_CLIENT.
 * 3. Crea un bloque de anuncio (display) y copia su "data-ad-slot" en ADSENSE_SLOT.
 */
export const ADSENSE_CLIENT = '' // p. ej. 'ca-pub-0000000000000000'
export const ADSENSE_SLOT = '' // p. ej. '1234567890'

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

/** Carga el script de AdSense una sola vez por sesión. */
function ensureAdSenseScript(client: string): void {
  const id = 'adsbygoogle-js'
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
  document.head.appendChild(script)
}

interface AdSenseBannerProps {
  /** Etiqueta accesible / texto del marcador cuando no hay configuración. */
  label?: string
  className?: string
}

export default function AdSenseBanner({ label = 'Espacio publicitario', className = '' }: AdSenseBannerProps) {
  const insRef = useRef<HTMLModElement | null>(null)
  const isConfigured = Boolean(ADSENSE_CLIENT && ADSENSE_SLOT)

  useEffect(() => {
    if (!isConfigured) return
    ensureAdSenseScript(ADSENSE_CLIENT)
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense no se pudo inicializar', error)
    }
  }, [isConfigured])

  return (
    <div
      aria-label={label}
      className={`flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/60 ${className}`}
    >
      {isConfigured ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex select-none flex-col items-center gap-1 py-3 text-center">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Publicidad
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{label} · Google AdSense</span>
        </div>
      )}
    </div>
  )
}
