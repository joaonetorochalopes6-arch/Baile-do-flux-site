import { useEffect, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowDown, ArrowUpRight, CalendarDays, Clock, MapPin, MessageCircle, Ticket } from 'lucide-react'
import { Instagram } from '@/components/site/brand-icons'
import { Atmosphere, Bat, BatField } from '@/components/site/atmosphere'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Reveal } from '@/components/site/reveal'
import { atracoes, brl, evento, galeria, img, ingressos, links } from '@/content/event'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="relative overflow-x-clip">
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Sobre />
        <Atracoes />
        <IngressosTeaser />
        <Galeria />
        <Comunidade />
      </main>
      <SiteFooter />
    </div>
  )
}

function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)

  // Leve movimento do fundo com rolagem e cursor (desligado com redução de movimento).
  useEffect(() => {
    const el = bgRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mx = 0
    let my = 0
    let raf = 0
    const apply = () => {
      raf = 0
      const y = Math.min(window.scrollY, 900)
      el.style.transform = `translate3d(${mx * -14}px, ${y * 0.25 + my * -10}px, 0) scale(1.08)`
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
      queue()
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    apply()
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24">
      <div ref={bgRef} className="absolute inset-0 -z-20 will-change-transform" style={{ transform: 'scale(1.08)' }}>
        <img
          src={img('/img/hero.png', 1600, 70)}
          srcSet={`${img('/img/hero.png', 800, 65)} 800w, ${img('/img/hero.png', 1600, 70)} 1600w`}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="size-full object-cover object-[65%_center] opacity-70"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_85%)]" />
      <Atmosphere />

      <div className="relative mx-auto w-full max-w-content px-5 sm:px-8">
        <p className="eyebrow title-in" style={{ animationDelay: '0.1s' }}>
          {evento.nome} · {evento.edicao}
        </p>
        <h1
          className="font-display title-in text-glow mt-6 text-[clamp(4.2rem,17vw,13rem)] font-black uppercase leading-[0.82] tracking-tight"
          style={{ animationDelay: '0.25s' }}
        >
          A noite
          <br />
          é <span className="text-primary">nossa</span>
        </h1>
        <p
          className="title-in mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-base"
          style={{ animationDelay: '0.5s' }}
        >
          {evento.tagline}
        </p>

        <div className="title-in mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" style={{ animationDelay: '0.7s' }}>
          <Link
            to="/ingressos"
            className="btn-glow inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground"
          >
            <Ticket className="size-5" />
            Garantir meu ingresso
          </Link>
          <a
            href={links.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-primary hover:text-white"
          >
            Grupo oficial <ArrowUpRight className="size-4" />
          </a>
        </div>

        <dl
          className="title-in mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-3"
          style={{ animationDelay: '0.9s' }}
        >
          <Info icon={CalendarDays} label="Data" value={evento.data} />
          <Info icon={Clock} label="Horário" value={evento.horario} />
          <Info icon={MapPin} label="Local" value="Divulgado em breve" className="col-span-2 sm:col-span-1" />
        </dl>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-6 right-6 hidden size-12 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-primary hover:text-white sm:grid"
        aria-label="Rolar para Sobre"
      >
        <ArrowDown className="size-5 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  )
}

function Info({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Clock
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary">
        <Icon className="size-3.5" /> {label}
      </dt>
      <dd className="font-display mt-1 text-2xl font-bold uppercase text-white">{value}</dd>
    </div>
  )
}

function Marquee() {
  const words = ['Funk no talo', 'Resenha de verdade', 'Som automotivo', 'Amizade', 'Só os fortes']
  const row = [...words, ...words]
  return (
    <div className="relative overflow-hidden border-y border-primary/30 bg-primary/[0.07] py-4" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="font-display flex items-center gap-10 text-2xl font-extrabold uppercase tracking-wide text-white/85">
            {w}
            <Bat className="w-7 text-primary" />
          </span>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ eyebrow, children, id }: { eyebrow: string; children: React.ReactNode; id?: string }) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="font-display mt-5 text-[clamp(2.8rem,8vw,6rem)] font-black uppercase leading-[0.88]">
        {children}
      </h2>
    </Reveal>
  )
}

function Sobre() {
  return (
    <section id="sobre" className="relative py-28 sm:py-36" aria-labelledby="sobre-titulo">
      <BatField />
      <div className="mx-auto grid max-w-content items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Nossa essência" id="sobre-titulo">
            Mais que um baile.
            <br />
            <span className="text-primary">Um encontro.</span>
          </SectionTitle>
          <Reveal delay={120}>
            <div className="mt-8 max-w-reading space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                O Baile do Fluxo FSA é pra quem entende que a melhor parte da festa é viver tudo junto. O funk no talo, o
                grave do som automotivo e aquela resenha que vira uma boa lembrança.
              </p>
              <p>
                A gente reúne pessoas pra curtir, fazer conexões e compartilhar experiências de verdade.{' '}
                <span className="text-white">Aqui, a amizade faz parte do ritmo.</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-3">
              {['Som que bate', 'Gente que soma', 'Resenha que fica'].map((t, i) => (
                <li key={t} className="bg-background px-5 py-5">
                  <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
                  <p className="font-display mt-1 text-xl font-bold uppercase">{t}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative grid grid-cols-5 gap-4">
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/20 blur-3xl" />
          <Reveal className="zoom-frame col-span-3 aspect-[4/5] rounded-sm" as="figure">
            <img
              src={img('/img/resenha.png', 700)}
              alt="Amigos brindando no baile sob luz vermelha"
              loading="lazy"
              className="size-full object-cover"
            />
          </Reveal>
          <div className="col-span-2 flex flex-col gap-4 pt-16">
            <Reveal className="zoom-frame aspect-square rounded-sm" delay={120} as="figure">
              <img src={img('/img/som.png', 500)} alt="Carro com som automotivo e galera dançando" loading="lazy" className="size-full object-cover" />
            </Reveal>
            <Reveal delay={200}>
              <div className="rounded-sm border border-primary/40 bg-primary/10 p-4">
                <p className="font-display text-4xl font-black text-primary">1ª</p>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">Edição oficial em Formosa</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Atracoes() {
  return (
    <section id="atracoes" className="relative border-t border-white/5 py-28 sm:py-36" aria-labelledby="atracoes-titulo">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionTitle eyebrow="Line-up" id="atracoes-titulo">
          Atrações <span className="text-primary">&</span> DJs
        </SectionTitle>

        {atracoes.length === 0 ? (
          <Reveal delay={120}>
            <div className="relative mt-14 overflow-hidden rounded-sm border border-white/10">
              <img
                src={img('/img/dj.png', 1200, 60)}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
              <div className="relative max-w-xl px-6 py-16 sm:px-12 sm:py-24">
                <p className="font-display text-5xl font-black uppercase leading-none sm:text-7xl">
                  Line-up <span className="text-primary text-glow">em breve</span>
                </p>
                <p className="mt-6 text-lg text-muted-foreground">
                  As atrações confirmadas são anunciadas primeiro no Instagram e no grupo oficial. Fica ligado pra não perder
                  nenhuma novidade.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white/85 transition-colors hover:border-primary hover:text-white"
                  >
                    <Instagram className="size-4" /> {links.instagramHandle}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {atracoes.map((a, i) => (
              <Reveal as="li" key={a.nome} delay={i * 90}>
                <figure className="zoom-frame group relative aspect-[4/5] rounded-sm">
                  <img src={img(a.imagem, 700)} alt={a.nome} loading="lazy" className="size-full object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary">{a.papel}</p>
                    <p className="font-display mt-1 text-3xl font-black uppercase">{a.nome}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function IngressosTeaser() {
  return (
    <section id="ingressos" className="relative isolate overflow-hidden py-28 sm:py-36" aria-labelledby="ingressos-titulo">
      <Atmosphere intensity="soft" />
      <div className="relative mx-auto grid max-w-content gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <SectionTitle eyebrow="1ª edição" id="ingressos-titulo">
            Garanta seu
            <br />
            <span className="text-primary text-glow">ingresso.</span>
          </SectionTitle>
          <Reveal delay={120}>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">
              Compra rápida pelo site, pagamento no Pix. Escolha a quantidade, aplique seu cupom e pronto.
            </p>
          </Reveal>
        </div>
        <Reveal delay={160}>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(ingressos).map(([k, t]) => (
              <div key={k} className="rounded-sm border border-white/10 bg-black/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/60">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">{t.descricao}</p>
                <p className="font-display mt-2 text-3xl font-black uppercase">{t.nome}</p>
                <p className="font-display mt-4 text-5xl font-black text-primary">{brl(t.preco)}</p>
              </div>
            ))}
            <Link
              to="/ingressos"
              className="btn-glow col-span-full inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground"
            >
              <Ticket className="size-5" /> Garantir meu ingresso
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Galeria() {
  return (
    <section id="galeria" className="relative border-t border-white/5 py-28 sm:py-36" aria-labelledby="galeria-titulo">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="A energia" id="galeria-titulo">
            Galeria de <span className="text-primary">momentos.</span>
          </SectionTitle>
          <Reveal delay={100}>
            <p className="max-w-xs text-muted-foreground">O som passa. As boas lembranças ficam.</p>
          </Reveal>
        </div>
        <ul className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:grid-cols-4 md:gap-4">
          {galeria.map((f, i) => (
            <Reveal
              as="li"
              key={f.src}
              delay={(i % 4) * 80}
              className={cn(
                'zoom-frame relative rounded-sm bg-card',
                f.forma === 'tall' && 'row-span-2',
                f.forma === 'wide' && 'col-span-2',
              )}
            >
              <img
                src={img(f.src, f.forma === 'wide' ? 900 : 600)}
                alt={f.alt}
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Comunidade() {
  return (
    <section id="comunidade" className="relative overflow-hidden py-28 sm:py-36" aria-labelledby="comunidade-titulo">
      <BatField />
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionTitle eyebrow="Você faz parte" id="comunidade-titulo">
          A resenha é melhor
          <br />
          <span className="text-primary">com você.</span>
        </SectionTitle>
        <Reveal delay={100}>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">
            Chega junto com quem vive o mesmo ritmo. Entre na comunidade e receba as novidades direto da organização.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <CommunityCard
            href={links.whatsappGroup}
            icon={MessageCircle}
            label="Grupo oficial"
            title="Entrar no grupo do WhatsApp"
            text="Avisos, lotes e novidades em primeira mão."
            delay={0}
          />
          <CommunityCard
            href={links.instagram}
            icon={Instagram}
            label={links.instagramHandle}
            title="Seguir no Instagram"
            text="O Fluxo também tá no feed. Line-up, fotos e bastidores."
            delay={120}
          />
        </div>
      </div>
    </section>
  )
}

function CommunityCard({
  href,
  icon: Icon,
  label,
  title,
  text,
  delay,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
  text: string
  delay: number
}) {
  return (
    <Reveal delay={delay}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-sm border border-white/10 bg-card p-8 transition-all duration-300 hover:border-primary/70 hover:shadow-[0_0_50px_-10px_var(--red-glow)] sm:p-10"
      >
        <div className="flex items-center justify-between">
          <span className="grid size-14 place-items-center rounded-full bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-6" />
          </span>
          <ArrowUpRight className="size-6 text-white/40 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white motion-reduce:transition-none" />
        </div>
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary">{label}</p>
          <p className="font-display mt-2 text-3xl font-black uppercase sm:text-4xl">{title}</p>
          <p className="mt-3 text-muted-foreground">{text}</p>
        </div>
      </a>
    </Reveal>
  )
}
