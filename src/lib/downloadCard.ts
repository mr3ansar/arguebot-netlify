import { VerdictResult, TONES } from './types'

const RULING_COLORS: Record<string, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

// Use only system fonts — no Google Fonts needed
const FONT_DISPLAY  = 'Georgia, "Times New Roman", serif'
const FONT_BODY     = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
const FONT_MONO     = '"Courier New", Courier, monospace'

function buildCardHTML(verdict: VerdictResult, argument: string): string {
  const tone        = TONES.find(t => t.id === verdict.tone)
  const rulingColor = RULING_COLORS[verdict.ruling] ?? '#E8251A'
  const shortArg    = argument.length > 120 ? argument.slice(0, 120) + '…' : argument

  const webEvidence   = verdict.evidence.filter(e => e.type !== 'paper')
  const paperEvidence = verdict.evidence.filter(e => e.type === 'paper')

  const evidenceRows = webEvidence.slice(0, 3).map(item =>
    '<div style="display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;">' +
      '<div style="width:6px;height:6px;min-width:6px;background:#E8251A;border-radius:50%;margin-top:6px;flex-shrink:0;"></div>' +
      '<div>' +
        '<span style="font-size:13px;color:#cccccc;line-height:1.6;font-family:' + FONT_BODY + ';word-spacing:normal;letter-spacing:normal;">' +
          item.text +
        '</span>' +
        (item.source
          ? '<span style="font-size:11px;color:#666666;font-family:' + FONT_MONO + ';margin-left:6px;">— ' + item.source + '</span>'
          : '') +
      '</div>' +
    '</div>'
  ).join('')

  const paperRows = paperEvidence.slice(0, 1).map(p =>
    '<div style="background:rgba(232,37,26,0.1);border:1px solid rgba(232,37,26,0.25);border-radius:12px;padding:14px 16px;margin-bottom:14px;">' +
      '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8251A;margin-bottom:8px;font-family:' + FONT_BODY + ';">RESEARCH BACKED · OPENALEX</div>' +
      '<p style="font-size:13px;color:#cccccc;line-height:1.6;margin:0 0 6px;font-family:' + FONT_BODY + ';word-spacing:normal;">' +
        (p.text.slice(0, 200) + (p.text.length > 200 ? '…' : '')) +
      '</p>' +
      (p.authors ? '<span style="font-size:11px;color:#888888;font-style:italic;font-family:' + FONT_BODY + ';">' + p.authors + (p.year ? ', ' + p.year : '') + '</span>' : '') +
    '</div>'
  ).join('')

  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8">' +
    '<style>' +
      '* { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }' +
      'body { margin: 0; padding: 0; background: #1A1A1A; font-family: ' + FONT_BODY + '; }' +
      'p, span, div { word-spacing: normal !important; letter-spacing: normal !important; }' +
    '</style>' +
    '</head><body>' +
    '<div style="width:600px;background:#1A1A1A;overflow:hidden;">' +

      // ── Header ──
      '<div style="background:#E8251A;padding:22px 32px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:38px;height:38px;background:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#E8251A;font-family:' + FONT_DISPLAY + ';">A</div>' +
          '<span style="font-weight:900;font-size:24px;letter-spacing:3px;color:white;text-transform:uppercase;font-family:' + FONT_DISPLAY + ';">ARGUEBOT</span>' +
        '</div>' +
        '<div style="background:white;color:#E8251A;font-weight:900;font-size:34px;padding:8px 22px;border-radius:14px;font-family:' + FONT_DISPLAY + ';">' + verdict.score + '%</div>' +
      '</div>' +

      // ── Ruling band ──
      '<div style="background:' + rulingColor + ';padding:14px 32px;display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:22px;">⚖️</span>' +
        '<span style="font-weight:900;font-size:28px;letter-spacing:2px;color:white;text-transform:uppercase;font-family:' + FONT_DISPLAY + ';">' + verdict.ruling + '</span>' +
      '</div>' +

      // ── Body ──
      '<div style="padding:28px 32px;">' +

        // Argument
        '<div style="background:#2a2a2a;border-radius:12px;padding:14px 18px;margin-bottom:20px;border-left:3px solid #E8251A;">' +
          '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888888;margin-bottom:8px;font-family:' + FONT_BODY + ';">THE ARGUMENT</div>' +
          '<div style="font-size:14px;color:#FAFAFA;line-height:1.6;font-style:italic;font-family:' + FONT_BODY + ';word-spacing:normal;">&ldquo;' + shortArg + '&rdquo;</div>' +
        '</div>' +

        // Summary
        '<div style="font-size:15px;color:#EEEEEE;line-height:1.8;margin-bottom:22px;font-family:' + FONT_BODY + ';word-spacing:normal;word-break:normal;">' +
          verdict.summary +
        '</div>' +

        // Evidence
        (webEvidence.length > 0
          ? '<div style="background:#242424;border-radius:14px;padding:16px 20px;margin-bottom:16px;">' +
              '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#888888;margin-bottom:12px;font-family:' + FONT_BODY + ';">EVIDENCE</div>' +
              evidenceRows +
            '</div>'
          : '') +

        // Research papers
        paperRows +

        // Twist
        (verdict.twist
          ? '<div style="background:rgba(232,37,26,0.08);border:1px solid rgba(232,37,26,0.2);border-radius:14px;padding:14px 18px;margin-bottom:22px;">' +
              '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#E8251A;margin-bottom:8px;font-family:' + FONT_BODY + ';">ACTUALLY...</div>' +
              '<p style="font-size:13px;color:#cccccc;line-height:1.6;margin:0;font-family:' + FONT_BODY + ';word-spacing:normal;">' + verdict.twist + '</p>' +
            '</div>'
          : '') +

        // Footer
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<div style="display:flex;align-items:center;gap:6px;background:#2E2E2E;color:#cccccc;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:7px 14px;border-radius:100px;font-family:' + FONT_BODY + ';">' +
            (tone?.emoji ?? '') + ' ' + (tone?.label ?? '') + ' MODE' +
          '</div>' +
          '<div style="font-size:12px;color:#555555;font-family:' + FONT_MONO + ';">arguebot.app</div>' +
        '</div>' +

      '</div>' +
    '</div>' +
    '</body></html>'
}

export async function downloadVerdictCard(verdict: VerdictResult, argument: string) {
  const html2canvas = (await import('html2canvas')).default

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:600px;height:1px;border:none;opacity:0;pointer-events:none;'
  document.body.appendChild(iframe)

  try {
    const doc = iframe.contentDocument!
    doc.open()
    doc.write(buildCardHTML(verdict, argument))
    doc.close()

    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 500))

    const cardEl = doc.body.firstElementChild as HTMLElement
    if (!cardEl) throw new Error('Card element not found')

    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#1A1A1A',
      scale:           2,
      useCORS:         true,
      logging:         false,
      width:           600,
      height:          cardEl.scrollHeight,
      windowWidth:     600,
      windowHeight:    cardEl.scrollHeight,
      onclone: (clonedDoc) => {
        // Force all text elements to use system fonts in the clone
        const allEls = clonedDoc.querySelectorAll('*')
        allEls.forEach((el: any) => {
          if (el.style) {
            el.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
            el.style.wordSpacing = 'normal'
            el.style.letterSpacing = 'normal'
          }
        })
      },
    })

    const link    = document.createElement('a')
    link.download = 'arguebot-' + verdict.ruling.toLowerCase().replace(/\s/g, '-') + '.png'
    link.href     = canvas.toDataURL('image/png')
    link.click()

  } finally {
    document.body.removeChild(iframe)
  }
}

import { DebateResult } from './modes'

const RULING_COLORS_DEBATE: Record<string, string> = {
  'CORRECT':        '#4CAF50',
  'MOSTLY RIGHT':   '#8BC34A',
  'PARTIALLY RIGHT':'#FF9800',
  'MOSTLY WRONG':   '#FF5722',
  'WRONG':          '#E8251A',
}

function buildDebateCardHTML(debate: DebateResult, argument: string): string {
  const rulingColor = RULING_COLORS_DEBATE[debate.ruling] ?? '#E8251A'
  const shortArg    = argument.length > 100 ? argument.slice(0, 100) + '\u2026' : argument
  const advocate    = debate.turns.find(t => t.role === 'advocate')
  const skeptic     = debate.turns.find(t => t.role === 'skeptic')
  const judge       = debate.turns.find(t => t.role === 'judge')
  const toneLabel   = debate.tone.toUpperCase()

  return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<style>* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; background: #1A1A1A; }</style>' +
    '</head><body>' +
    '<div style="width:600px;background:#1A1A1A;overflow:hidden;font-family:' + FONT_BODY + ';">' +

      // Header
      '<div style="background:#1A1A1A;border-bottom:2px solid #333;padding:22px 32px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:38px;height:38px;background:#E8251A;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:white;font-family:' + FONT_DISPLAY + ';">A</div>' +
          '<div>' +
            '<div style="font-weight:900;font-size:18px;letter-spacing:3px;color:white;text-transform:uppercase;font-family:' + FONT_DISPLAY + ';">ARGUEBOT</div>' +
            '<div style="font-size:10px;color:#555;letter-spacing:1px;text-transform:uppercase;font-family:' + FONT_BODY + ';">3-AI DEBATE · HEAVY MODE</div>' +
          '</div>' +
        '</div>' +
        '<div style="background:#E8251A;color:white;font-weight:900;font-size:28px;padding:6px 18px;border-radius:12px;font-family:' + FONT_DISPLAY + ';">' + debate.score + '%</div>' +
      '</div>' +

      // Ruling band
      '<div style="background:' + rulingColor + ';padding:12px 32px;">' +
        '<span style="font-weight:900;font-size:24px;letter-spacing:2px;color:white;text-transform:uppercase;font-family:' + FONT_DISPLAY + ';">\u2696\uFE0F ' + debate.ruling + '</span>' +
      '</div>' +

      '<div style="padding:24px 32px;">' +

        // Topic
        '<div style="background:#242424;border-radius:12px;padding:12px 16px;margin-bottom:20px;border-left:3px solid #555;">' +
          '<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:6px;font-family:' + FONT_BODY + ';">THE ARGUMENT</div>' +
          '<div style="font-size:14px;color:#FAFAFA;line-height:1.5;font-style:italic;font-family:' + FONT_BODY + ';">&ldquo;' + shortArg + '&rdquo;</div>' +
        '</div>' +

        // Advocate
        (advocate ? '<div style="margin-bottom:14px;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<div style="width:22px;height:22px;border-radius:50%;background:#4CAF50;display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:700;">\u2713</div>' +
            '<span style="font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4CAF50;font-family:' + FONT_BODY + ';">ADVOCATE — FOR</span>' +
          '</div>' +
          '<div style="background:rgba(76,175,80,0.08);border:1px solid rgba(76,175,80,0.2);border-radius:12px;padding:12px 14px;">' +
            '<p style="font-size:13px;color:#ddd;line-height:1.6;margin:0;font-family:' + FONT_BODY + ';word-spacing:normal;">' + (advocate.content ?? '') + '</p>' +
          '</div>' +
        '</div>' : '') +

        // VS
        '<div style="display:flex;align-items:center;gap:12px;margin:14px 0;">' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>' +
          '<span style="font-weight:900;font-size:14px;letter-spacing:3px;color:#444;font-family:' + FONT_DISPLAY + ';">VS</span>' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>' +
        '</div>' +

        // Skeptic
        (skeptic ? '<div style="margin-bottom:18px;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
            '<div style="width:22px;height:22px;border-radius:50%;background:#E8251A;display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:700;">\u2717</div>' +
            '<span style="font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#E8251A;font-family:' + FONT_BODY + ';">SKEPTIC — AGAINST</span>' +
          '</div>' +
          '<div style="background:rgba(232,37,26,0.06);border:1px solid rgba(232,37,26,0.15);border-radius:12px;padding:12px 14px;">' +
            '<p style="font-size:13px;color:#ddd;line-height:1.6;margin:0;font-family:' + FONT_BODY + ';word-spacing:normal;">' + (skeptic.content ?? '') + '</p>' +
          '</div>' +
        '</div>' : '') +

        // Judge
        (judge ? '<div style="background:#242424;border-radius:14px;padding:16px 18px;margin-bottom:18px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
              '<span style="font-size:16px;">\u2696\uFE0F</span>' +
              '<span style="font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:' + FONT_BODY + ';">JUDGE&#39;S RULING</span>' +
            '</div>' +
            '<span style="font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:' + rulingColor + ';font-family:' + FONT_BODY + ';">' + debate.ruling + '</span>' +
          '</div>' +
          '<p style="font-size:13px;color:#ddd;line-height:1.6;margin:0;font-family:' + FONT_BODY + ';word-spacing:normal;">' + (judge.content ?? '') + '</p>' +
        '</div>' : '') +

        // Footer
        '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<div style="background:#2E2E2E;color:#ccc;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:100px;font-family:' + FONT_BODY + ';">\u2694\uFE0F ' + toneLabel + ' MODE</div>' +
          '<div style="font-size:11px;color:#555;font-family:' + FONT_MONO + ';">arguebot.app</div>' +
        '</div>' +

      '</div>' +
    '</div>' +
    '</body></html>'
}

export async function downloadDebateCard(debate: DebateResult, argument: string) {
  const html2canvas = (await import('html2canvas')).default

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:600px;height:1px;border:none;opacity:0;pointer-events:none;'
  document.body.appendChild(iframe)

  try {
    const doc = iframe.contentDocument!
    doc.open()
    doc.write(buildDebateCardHTML(debate, argument))
    doc.close()

    await new Promise(resolve => setTimeout(resolve, 500))

    const cardEl = doc.body.firstElementChild as HTMLElement
    if (!cardEl) throw new Error('Card element not found')

    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#1A1A1A',
      scale:           2,
      useCORS:         true,
      logging:         false,
      width:           600,
      height:          cardEl.scrollHeight,
      windowWidth:     600,
      windowHeight:    cardEl.scrollHeight,
      onclone: (clonedDoc) => {
        const allEls = clonedDoc.querySelectorAll('*')
        allEls.forEach((el: any) => {
          if (el.style) {
            el.style.fontFamily  = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'
            el.style.wordSpacing = 'normal'
            el.style.letterSpacing = 'normal'
          }
        })
      },
    })

    const link    = document.createElement('a')
    link.download = 'arguebot-debate-' + debate.ruling.toLowerCase().replace(/\s/g, '-') + '.png'
    link.href     = canvas.toDataURL('image/png')
    link.click()

  } finally {
    document.body.removeChild(iframe)
  }
}
