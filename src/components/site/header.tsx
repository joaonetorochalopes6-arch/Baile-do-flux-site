import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Bat } from './atmosphere'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#atracoes', label: 'Atrações' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#comunidade', label: 'Comunidade' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('group flex items-center gap-2.5', className)} aria-label="Baile do Fluxo FSA — início">
      <Bat className="w-8 text-primary transition-transform duration-500 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
      <span className="font-display text-xl font-extrabold uppercase leading-none tracking-wide">
        Baile do Fluxo
        <span className="ml-1.5 text-primary">FSA</span>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'border-b border-white/5 bg-black/80 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/ingressos"
            className="btn-glow rounded-sm bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Ingressos
          </Link>
        </nav>
        <button
          type="button"
          className="grid size-10 place-items-center text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <nav id="menu-mobile" className="border-t border-white/5 px-5 pb-6 pt-2 md:hidden" aria-label="Principal">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-display block py-3 text-2xl font-bold uppercase tracking-wide text-white/85"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/ingressos"
            onClick={() => setOpen(false)}
            className="btn-glow mt-4 block rounded-sm bg-primary py-3.5 text-center text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Garantir meu ingresso
          </Link>
        </nav>
      )}
    </header>
  )
}
