import type { CVDocument } from '../types/cv'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Asegura que una URL tenga protocolo para que el hipervínculo funcione. */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed) || /^(mailto:|tel:)/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** Texto legible de una URL (sin protocolo ni barra final). */
function prettyUrl(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')
}

const ICONS = {
  email:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  location:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  website:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V10.4H5.67v7.94h2.67ZM7 9.24a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9.1v-4.36c0-2.33-1.24-3.41-2.9-3.41a2.5 2.5 0 0 0-2.27 1.25v-1.07h-2.67c.04.75 0 7.94 0 7.94h2.67v-4.43c0-.24.02-.48.09-.65.19-.48.63-.97 1.36-.97.96 0 1.35.73 1.35 1.8v4.25h2.66Z"/></svg>',
  x:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg>',
}

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'CV'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : ''
  return (first + last).toUpperCase()
}

function buildCvHtml(cv: CVDocument): string {
  const skills = cv.skills.length
    ? cv.skills.map((skill) => `<li class="skill">${escapeHtml(skill)}</li>`).join('')
    : ''

  const competencies = cv.competencies?.length
    ? cv.competencies.map((item) => `<li class="competency">${escapeHtml(item)}</li>`).join('')
    : ''

  const projects = (cv.projects ?? [])
    .filter((item) => item.name || item.description || item.link)
    .map(
      (item) => `
        <div class="entry">
          <div class="entry-head">
            <span class="entry-title">${escapeHtml(item.name || 'Proyecto')}</span>
            ${item.period ? `<span class="entry-period">${escapeHtml(item.period)}</span>` : ''}
          </div>
          ${
            item.link
              ? `<a class="entry-link" href="${escapeHtml(normalizeUrl(item.link))}"><span class="entry-link-icon">${ICONS.website}</span>${escapeHtml(prettyUrl(item.link))}</a>`
              : ''
          }
          ${item.description ? `<p class="entry-desc">${escapeHtml(item.description)}</p>` : ''}
        </div>`,
    )
    .join('')

  const experience = cv.experience
    .filter((item) => item.role || item.company || item.period || item.description)
    .map(
      (item) => `
        <div class="entry">
          <div class="entry-head">
            <span class="entry-title">${escapeHtml(item.role || 'Cargo')}</span>
            ${item.period ? `<span class="entry-period">${escapeHtml(item.period)}</span>` : ''}
          </div>
          ${item.company ? `<div class="entry-sub">${escapeHtml(item.company)}</div>` : ''}
          ${item.description ? `<p class="entry-desc">${escapeHtml(item.description)}</p>` : ''}
        </div>`,
    )
    .join('')

  const education = cv.education
    .filter((item) => item.degree || item.institution || item.period || item.details)
    .map(
      (item) => `
        <div class="entry">
          <div class="entry-head">
            <span class="entry-title">${escapeHtml(item.degree || 'Título')}</span>
            ${item.period ? `<span class="entry-period">${escapeHtml(item.period)}</span>` : ''}
          </div>
          ${item.institution ? `<div class="entry-sub">${escapeHtml(item.institution)}</div>` : ''}
          ${item.details ? `<p class="entry-desc">${escapeHtml(item.details)}</p>` : ''}
        </div>`,
    )
    .join('')

  const p = cv.personal
  const contactRows = [
    p.email
      ? { icon: ICONS.email, href: `mailto:${p.email.trim()}`, text: p.email.trim() }
      : null,
    p.phone
      ? { icon: ICONS.phone, href: `tel:${p.phone.replace(/\s+/g, '')}`, text: p.phone.trim() }
      : null,
    p.website
      ? { icon: ICONS.website, href: normalizeUrl(p.website), text: prettyUrl(p.website) }
      : null,
    p.linkedin
      ? { icon: ICONS.linkedin, href: normalizeUrl(p.linkedin), text: prettyUrl(p.linkedin) }
      : null,
    p.x ? { icon: ICONS.x, href: normalizeUrl(p.x), text: prettyUrl(p.x) } : null,
    p.location ? { icon: ICONS.location, href: '', text: p.location.trim() } : null,
  ]
    .filter((row): row is { icon: string; href: string; text: string } => row !== null)
    .map((row) => {
      const inner = `<span class="contact-icon">${row.icon}</span><span class="contact-value">${escapeHtml(row.text)}</span>`
      return row.href
        ? `<li class="contact-row"><a class="contact-link" href="${escapeHtml(row.href)}">${inner}</a></li>`
        : `<li class="contact-row"><span class="contact-link">${inner}</span></li>`
    })
    .join('')

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(cv.personal.fullName || 'CV')}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      background: #eef2f7;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #ffffff;
      display: grid;
      grid-template-columns: 64mm 1fr;
    }

    /* ---------- Barra lateral ---------- */
    .sidebar {
      background: linear-gradient(160deg, #4c1d95 0%, #6d28d9 55%, #7c3aed 100%);
      color: #ede9fe;
      padding: 26px 22px;
    }
    .avatar {
      width: 74px; height: 74px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.16);
      border: 2px solid rgba(255, 255, 255, 0.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; font-weight: 700; color: #ffffff;
      margin-bottom: 18px;
    }
    .side-block { margin-top: 24px; }
    .side-block:first-of-type { margin-top: 8px; }
    .side-title {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em;
      font-weight: 700; color: #ffffff; margin-bottom: 12px;
      padding-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }
    .contact-list, .skills { list-style: none; }
    .contact-row { margin-bottom: 10px; }
    .contact-link {
      display: flex; align-items: center; gap: 9px;
      color: #f5f3ff; text-decoration: none;
    }
    .contact-icon {
      flex: 0 0 auto; width: 22px; height: 22px; border-radius: 6px;
      background: rgba(255, 255, 255, 0.16);
      display: flex; align-items: center; justify-content: center;
    }
    .contact-icon svg { width: 13px; height: 13px; color: #ffffff; }
    .contact-value { font-size: 11.5px; color: #f5f3ff; word-break: break-word; line-height: 1.35; }
    a.contact-link:hover .contact-value { text-decoration: underline; }
    .skills { display: flex; flex-wrap: wrap; gap: 7px; }
    .skill {
      font-size: 11px; font-weight: 600; color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 999px; padding: 3px 10px;
    }
    .competencies { list-style: none; }
    .competency {
      position: relative; font-size: 11.5px; color: #f5f3ff;
      padding-left: 14px; margin-bottom: 6px;
    }
    .competency::before {
      content: ''; position: absolute; left: 0; top: 6px;
      width: 5px; height: 5px; border-radius: 50%; background: #c4b5fd;
    }

    /* ---------- Columna principal ---------- */
    .main { padding: 34px 32px; }
    .name { font-size: 30px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; line-height: 1.1; }
    .headline {
      font-size: 14px; font-weight: 600; color: #7c3aed;
      text-transform: uppercase; letter-spacing: 0.12em; margin-top: 6px;
    }
    .name-rule { height: 3px; width: 54px; background: #7c3aed; border-radius: 3px; margin-top: 14px; }

    .section { margin-top: 26px; }
    .section-title {
      font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.18em;
      color: #4c1d95; font-weight: 700; margin-bottom: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .section-title::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
    .summary { font-size: 13px; color: #334155; }

    .entry { position: relative; padding-left: 16px; margin-bottom: 16px; }
    .entry:last-child { margin-bottom: 0; }
    .entry::before {
      content: ''; position: absolute; left: 0; top: 5px;
      width: 7px; height: 7px; border-radius: 50%;
      background: #7c3aed;
    }
    .entry::after {
      content: ''; position: absolute; left: 3px; top: 14px; bottom: -10px;
      width: 1px; background: #e2e8f0;
    }
    .entry:last-child::after { display: none; }
    .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .entry-title { font-size: 14px; font-weight: 700; color: #0f172a; }
    .entry-period {
      font-size: 11px; font-weight: 600; color: #6d28d9; white-space: nowrap;
      background: #f3e8ff; border-radius: 999px; padding: 2px 9px;
    }
    .entry-sub { font-size: 12.5px; color: #64748b; font-weight: 600; margin-top: 1px; }
    .entry-desc { font-size: 12.5px; color: #475569; margin-top: 5px; }
    .entry-link {
      display: inline-flex; align-items: center; gap: 5px; margin-top: 3px;
      font-size: 11.5px; font-weight: 600; color: #6d28d9; text-decoration: none;
    }
    .entry-link:hover { text-decoration: underline; }
    .entry-link-icon svg { width: 12px; height: 12px; color: #6d28d9; vertical-align: middle; }

    @media print {
      body { background: #ffffff; }
      .sheet { margin: 0; box-shadow: none; }
      .entry, .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <aside class="sidebar">
      <div class="avatar">${escapeHtml(initials(cv.personal.fullName))}</div>
      ${contactRows ? `<div class="side-block"><h2 class="side-title">Contacto</h2><ul class="contact-list">${contactRows}</ul></div>` : ''}
      ${skills ? `<div class="side-block"><h2 class="side-title">Habilidades</h2><ul class="skills">${skills}</ul></div>` : ''}
      ${competencies ? `<div class="side-block"><h2 class="side-title">Competencias</h2><ul class="competencies">${competencies}</ul></div>` : ''}
    </aside>

    <main class="main">
      <header>
        <div class="name">${escapeHtml(cv.personal.fullName || 'Tu nombre')}</div>
        ${cv.personal.headline ? `<div class="headline">${escapeHtml(cv.personal.headline)}</div>` : ''}
        <div class="name-rule"></div>
      </header>

      ${cv.summary ? `<section class="section"><h2 class="section-title">Perfil</h2><p class="summary">${escapeHtml(cv.summary)}</p></section>` : ''}

      ${experience ? `<section class="section"><h2 class="section-title">Experiencia</h2>${experience}</section>` : ''}

      ${projects ? `<section class="section"><h2 class="section-title">Proyectos</h2>${projects}</section>` : ''}

      ${education ? `<section class="section"><h2 class="section-title">Educación</h2>${education}</section>` : ''}
    </main>
  </div>
</body>
</html>`
}

/**
 * Abre una ventana imprimible con el CV maquetado y lanza el diálogo de
 * impresión del navegador, donde el usuario puede elegir "Guardar como PDF".
 */
export function downloadCvAsPdf(cv: CVDocument): void {
  const html = buildCvHtml(cv)
  const printWindow = window.open('', '_blank', 'width=820,height=1000')

  if (!printWindow) {
    alert('Permite las ventanas emergentes para descargar el PDF.')
    return
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()

  // Esperar al renderizado antes de lanzar la impresión.
  const triggerPrint = () => {
    printWindow.print()
  }

  if (printWindow.document.readyState === 'complete') {
    setTimeout(triggerPrint, 250)
  } else {
    printWindow.onload = () => setTimeout(triggerPrint, 250)
  }
}
