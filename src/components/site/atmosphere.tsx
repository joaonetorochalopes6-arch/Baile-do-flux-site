/**
 * Camadas decorativas: fumaça, lasers, luzes pulsando, partículas e morcegos.
 * Puramente visual (aria-hidden), só CSS/transform/opacity para ficar leve.
 * Com prefers-reduced-motion as animações param (ver styles.css).
 */

const BAT_PATH =
  'M32 14c-1.2-2.2-2.6-3.4-3.6-3.6.4 1 .5 2.2.1 3.1C25 9.6 18.6 7.2 10 8.2c3.6 1.4 6 3.8 6.6 6.8-3.4-.8-7.6-.2-11 2 5.4-.2 10.4 1.6 14.2 5.2 1.6-1.4 4-2 6.4-1.6.9 2.2 2.6 4 5.8 4.4 3.2-.4 4.9-2.2 5.8-4.4 2.4-.4 4.8.2 6.4 1.6 3.8-3.6 8.8-5.4 14.2-5.2-3.4-2.2-7.6-2.8-11-2 .6-3 3-5.4 6.6-6.8-8.6-1-15 1.4-18.5 5.3-.4-.9-.3-2.1.1-3.1-1 .2-2.4 1.4-3.6 3.6-.4-.2-1.4-.2-1.8 0z'

export function Bat({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 64 28" className={className} style={style} aria-hidden="true">
      <path d={BAT_PATH} fill="currentColor" />
    </svg>
  )
}

// Posições determinísticas (sem Math.random) para o HTML do servidor bater com o cliente.
const particles = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 61.3 + 7) % 100,
  size: 1 + (i % 3),
  delay: (i * 0.73) % 6,
  dur: 4 + (i % 5),
}))

const bats = [
  { top: '14%', dur: 38, delay: -4, scale: 1, op: 0.32 },
  { top: '28%', dur: 52, delay: -22, scale: 0.6, op: 0.22 },
  { top: '9%', dur: 46, delay: -35, scale: 0.75, op: 0.26 },
  { top: '42%', dur: 64, delay: -12, scale: 0.45, op: 0.16 },
  { top: '20%', dur: 58, delay: -48, scale: 0.5, op: 0.18 },
]

export function Atmosphere({ intensity = 'full' }: { intensity?: 'full' | 'soft' }) {
  const full = intensity === 'full'
  return (
    <div className="fx-layer" aria-hidden="true">
      <div className="fx-glow fx-glow-a" />
      <div className="fx-glow fx-glow-b" />
      <div className="fx-smoke fx-smoke-a" />
      <div className="fx-smoke fx-smoke-b" />
      {full && (
        <>
          <div className="fx-laser fx-laser-a" />
          <div className="fx-laser fx-laser-b" />
          <div className="fx-laser fx-laser-c" />
        </>
      )}
      {particles.slice(0, full ? 34 : 16).map((p, i) => (
        <span
          key={i}
          className="fx-dot"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
      {bats.slice(0, full ? 5 : 2).map((b, i) => (
        <div
          key={i}
          className="fx-bat"
          style={{ top: b.top, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, opacity: b.op }}
        >
          <Bat className="fx-bat-wing" style={{ width: 64 * b.scale, animationDelay: `${i * 0.13}s` }} />
        </div>
      ))}
    </div>
  )
}

/** Silhuetas de morcego paradas, bem discretas, para o fundo das seções. */
export function BatField() {
  const spots = [
    { l: '6%', t: '12%', w: 42, r: -12 },
    { l: '84%', t: '22%', w: 30, r: 10 },
    { l: '72%', t: '78%', w: 54, r: -6 },
    { l: '14%', t: '70%', w: 26, r: 16 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {spots.map((s, i) => (
        <Bat
          key={i}
          className="absolute text-white/[0.04]"
          style={{ left: s.l, top: s.t, width: s.w, transform: `rotate(${s.r}deg)` }}
        />
      ))}
    </div>
  )
}
