import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ArrowLeft, Check, Copy, MessageCircle, Minus, Plus, ShieldCheck, Tag, Ticket, X } from 'lucide-react'
import { Atmosphere } from '@/components/site/atmosphere'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { brl, cupons, evento, ingressos, links, maxPorTipo, pix, type TipoIngresso } from '@/content/event'
import { gerarPix } from '@/lib/pix'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/ingressos')({
  head: () => ({
    meta: [
      { title: 'Ingressos — Baile do Fluxo FSA' },
      { name: 'description', content: 'Compre seu ingresso do Baile do Fluxo FSA: feminino R$ 20, masculino R$ 30. Pagamento no Pix.' },
    ],
  }),
  component: IngressosPage,
})

const tipos = Object.keys(ingressos) as TipoIngresso[]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Pedido = {
  ref: string
  nome: string
  email: string
  qtd: Record<TipoIngresso, number>
  subtotal: number
  desconto: number
  total: number
  cupom: string | null
  pixCode: string
  qr: string
}

function novaReferencia() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return 'BF' + Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

function IngressosPage() {
  const [qtd, setQtd] = useState<Record<TipoIngresso, number>>({ feminino: 0, masculino: 0 })
  const [cupomInput, setCupomInput] = useState('')
  const [cupom, setCupom] = useState<string | null>(null)
  const [cupomErro, setCupomErro] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tentou, setTentou] = useState(false)
  const [pedido, setPedido] = useState<Pedido | null>(null)

  const quantidade = qtd.feminino + qtd.masculino
  const subtotal = tipos.reduce((s, t) => s + qtd[t] * ingressos[t].preco, 0)
  const taxa = cupom ? cupons[cupom] : 0
  const desconto = Math.round(subtotal * taxa * 100) / 100
  const total = Math.round((subtotal - desconto) * 100) / 100

  const erros = useMemo(() => {
    const e: Partial<Record<'nome' | 'email' | 'qtd', string>> = {}
    const n = nome.trim()
    if (!n) e.nome = 'Informe seu nome completo.'
    else if (n.split(/\s+/).length < 2 || n.length < 5) e.nome = 'Digite nome e sobrenome.'
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Digite um e-mail válido.'
    if (quantidade === 0) e.qtd = 'Escolha pelo menos 1 ingresso.'
    return e
  }, [nome, email, quantidade])

  const mudar = (t: TipoIngresso, d: number) =>
    setQtd((q) => ({ ...q, [t]: Math.max(0, Math.min(maxPorTipo, q[t] + d)) }))

  const aplicarCupom = (e: React.FormEvent) => {
    e.preventDefault()
    const code = cupomInput.trim().toUpperCase()
    if (!code) {
      setCupomErro('Digite um cupom.')
      return
    }
    if (!(code in cupons)) {
      setCupom(null)
      setCupomErro('Cupom inválido ou expirado.')
      return
    }
    setCupom(code)
    setCupomErro(null)
    setCupomInput(code)
    toast.success(`Cupom ${code} aplicado: ${Math.round(cupons[code] * 100)}% de desconto`)
  }

  const removerCupom = () => {
    setCupom(null)
    setCupomInput('')
    setCupomErro(null)
  }

  const finalizar = async (e: React.FormEvent) => {
    e.preventDefault()
    setTentou(true)
    if (Object.keys(erros).length) {
      toast.error(erros.qtd ?? 'Confira seus dados antes de continuar.')
      return
    }
    const ref = novaReferencia()
    const pixCode = gerarPix({ chave: pix.chave, nome: pix.favorecido, cidade: pix.cidade, valor: total, txid: ref })
    // Carregado só no navegador, quando o comprador finaliza.
    const mod: typeof import('qrcode') = await import('qrcode')
    const toDataURL = mod.toDataURL ?? (mod as unknown as { default: typeof mod }).default.toDataURL
    const qr = await toDataURL(pixCode, { width: 520, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
    setPedido({ ref, nome: nome.trim(), email: email.trim().toLowerCase(), qtd, subtotal, desconto, total, cupom, pixCode, qr })
  }

  useEffect(() => {
    if (pedido) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pedido])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <SiteHeader />
      <main className="relative isolate pb-24 pt-28 sm:pt-32">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
          <Atmosphere intensity="soft" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="mx-auto max-w-content px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-white">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
          <p className="eyebrow title-in mt-8">
            {evento.nome} · {evento.data} · {evento.horario}
          </p>
          <h1 className="font-display title-in mt-4 text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.86]">
            {pedido ? (
              <>
                Falta <span className="text-primary text-glow">pouco.</span>
              </>
            ) : (
              <>
                Garanta seu <span className="text-primary text-glow">ingresso.</span>
              </>
            )}
          </h1>

          {pedido ? (
            <Pagamento pedido={pedido} onVoltar={() => setPedido(null)} />
          ) : (
            <form onSubmit={finalizar} noValidate className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
              <div className="space-y-10">
                {/* 1. Ingressos */}
                <fieldset aria-labelledby="passo-1">
                  <Step n={1} title="Escolha seus ingressos" id="passo-1" />
                  <div className="mt-5 grid gap-3">
                    {tipos.map((t) => (
                      <div
                        key={t}
                        className={cn(
                          'flex items-center justify-between gap-4 rounded-sm border bg-card/80 p-5 transition-colors sm:p-6',
                          qtd[t] > 0 ? 'border-primary/70 shadow-[0_0_40px_-16px_var(--red-glow)]' : 'border-white/10',
                        )}
                      >
                        <div>
                          <p className="font-display text-2xl font-black uppercase sm:text-3xl">{ingressos[t].nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {ingressos[t].descricao} · <span className="font-semibold text-white">{brl(ingressos[t].preco)}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1" role="group" aria-label={`Quantidade ${ingressos[t].nome}`}>
                          <QtyBtn label={`Remover ingresso ${ingressos[t].nome}`} onClick={() => mudar(t, -1)} disabled={qtd[t] === 0}>
                            <Minus className="size-4" />
                          </QtyBtn>
                          <output className="font-display w-10 text-center text-3xl font-black tabular-nums" aria-live="polite">
                            {qtd[t]}
                          </output>
                          <QtyBtn label={`Adicionar ingresso ${ingressos[t].nome}`} onClick={() => mudar(t, 1)} disabled={qtd[t] >= maxPorTipo}>
                            <Plus className="size-4" />
                          </QtyBtn>
                        </div>
                      </div>
                    ))}
                  </div>
                  {tentou && erros.qtd && <p className="mt-3 text-sm text-primary">{erros.qtd}</p>}
                </fieldset>

                {/* 2. Comprador */}
                <fieldset aria-labelledby="passo-2">
                  <Step n={2} title="Seus dados" id="passo-2" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Os ingressos ficam no nome de quem compra. Use um e-mail pessoal que você acessa.
                  </p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field id="nome" label="Nome completo" error={tentou ? erros.nome : undefined}>
                      <Input
                        id="nome"
                        autoComplete="name"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-invalid={tentou && !!erros.nome}
                        aria-describedby={tentou && erros.nome ? 'nome-erro' : undefined}
                        placeholder="Seu nome e sobrenome"
                        className="h-12 rounded-sm bg-black/40 text-base"
                      />
                    </Field>
                    <Field id="email" label="E-mail pessoal" error={tentou ? erros.email : undefined}>
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={tentou && !!erros.email}
                        aria-describedby={tentou && erros.email ? 'email-erro' : undefined}
                        placeholder="voce@email.com"
                        className="h-12 rounded-sm bg-black/40 text-base"
                      />
                    </Field>
                  </div>
                </fieldset>
              </div>

              {/* Resumo */}
              <aside className="rounded-sm border border-white/10 bg-card/90 p-6 backdrop-blur-sm lg:sticky lg:top-24" aria-labelledby="resumo-titulo">
                <h2 id="resumo-titulo" className="font-display text-2xl font-black uppercase">
                  Resumo
                </h2>
                <ul className="mt-5 space-y-2 text-sm">
                  {tipos.map((t) => (
                    <li key={t} className="flex justify-between text-muted-foreground">
                      <span>
                        {qtd[t]}× {ingressos[t].nome}
                      </span>
                      <span className="tabular-nums text-white">{brl(qtd[t] * ingressos[t].preco)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <Label htmlFor="cupom" className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    Cupom promocional
                  </Label>
                  {cupom ? (
                    <div className="mt-2 flex items-center justify-between rounded-sm border border-primary/50 bg-primary/10 px-3 py-2.5 text-sm">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <Tag className="size-4 text-primary" /> {cupom} · {Math.round(taxa * 100)}% off
                      </span>
                      <button type="button" onClick={removerCupom} className="text-muted-foreground hover:text-white" aria-label="Remover cupom">
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="cupom"
                        value={cupomInput}
                        onChange={(e) => {
                          setCupomInput(e.target.value)
                          setCupomErro(null)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') aplicarCupom(e)
                        }}
                        placeholder="Digite seu cupom"
                        autoCapitalize="characters"
                        aria-invalid={!!cupomErro}
                        className="h-11 rounded-sm bg-black/40 uppercase placeholder:normal-case"
                      />
                      <button
                        type="button"
                        onClick={aplicarCupom}
                        className="rounded-sm border border-white/15 px-4 text-xs font-bold uppercase tracking-[0.18em] transition-colors hover:border-primary"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                  {cupomErro && <p className="mt-2 text-sm text-primary">{cupomErro}</p>}
                </div>

                <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                  <Row label="Valor original" value={brl(subtotal)} />
                  <Row label={`Desconto${cupom ? ` (${cupom})` : ''}`} value={desconto ? `− ${brl(desconto)}` : brl(0)} accent={!!desconto} />
                  <div className="flex items-end justify-between pt-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Total</dt>
                    <dd className="font-display text-5xl font-black tabular-nums text-white">{brl(total)}</dd>
                  </div>
                </dl>

                <button
                  type="submit"
                  className="btn-glow mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground disabled:opacity-60"
                >
                  <Ticket className="size-5" /> Ir para o pagamento
                </button>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Pagamento via Pix para {pix.favorecido}, organização do Baile do Fluxo FSA. O ingresso só vale depois que o
                  pagamento for confirmado.
                </p>
              </aside>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Pagamento({ pedido, onVoltar }: { pedido: Pedido; onVoltar: () => void }) {
  const [copiado, setCopiado] = useState(false)

  const itens = tipos.filter((t) => pedido.qtd[t] > 0).map((t) => `${pedido.qtd[t]}x ${ingressos[t].nome}`)

  const mensagem = [
    'Olá! Paguei o Pix do Baile do Fluxo FSA.',
    `Pedido: ${pedido.ref}`,
    `Ingressos: ${itens.join(' e ')}`,
    pedido.cupom ? `Cupom: ${pedido.cupom} (− ${brl(pedido.desconto)})` : null,
    `Total: ${brl(pedido.total)}`,
    `Nome: ${pedido.nome}`,
    `E-mail: ${pedido.email}`,
    'Segue o comprovante:',
  ]
    .filter(Boolean)
    .join('\n')
  const waHref = `https://wa.me/${links.whatsappOrganizacao}?text=${encodeURIComponent(mensagem)}`

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(pedido.pixCode)
      setCopiado(true)
      toast.success('Código Pix copiado')
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      toast.error('Não foi possível copiar. Selecione o código e copie manualmente.')
    }
  }

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
      <section className="space-y-8" aria-labelledby="pix-titulo">
        <div className="rounded-sm border border-white/10 bg-card/90 p-6 sm:p-8">
          <Step n={3} title="Pague com Pix" id="pix-titulo" />
          <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-[220px] rounded-sm bg-white p-3 shadow-[0_0_60px_-12px_var(--red-glow)]">
              <img src={pedido.qr} alt={`QR Code Pix de ${brl(pedido.total)}`} className="block w-full" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor a pagar</p>
              <p className="font-display text-6xl font-black text-white">{brl(pedido.total)}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Abra o app do seu banco, escolha <span className="text-white">Pix → Ler QR Code</span> ou use o código copia e cola.
                Favorecido: <span className="text-white">{pix.favorecido}</span>.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Label className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">Pix copia e cola</Label>
            <p className="mt-2 max-h-24 overflow-auto break-all rounded-sm border border-white/10 bg-black/50 p-3 font-mono text-xs text-white/80 select-all">
              {pedido.pixCode}
            </p>
            <button
              type="button"
              onClick={copiar}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/15 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-primary sm:w-auto"
            >
              {copiado ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
              {copiado ? 'Copiado!' : 'Copiar código Pix'}
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-primary/40 bg-primary/[0.08] p-6 sm:p-8">
          <Step n={4} title="Envie o comprovante" />
          <p className="mt-3 text-muted-foreground">
            Depois de pagar, mande o comprovante para a organização. A mensagem já vai pronta com o número do seu pedido, seus
            ingressos e seus dados.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground sm:w-auto"
          >
            <MessageCircle className="size-5" /> Enviar comprovante no WhatsApp
          </a>
          <p className="mt-5 text-sm text-white/80">
            Com o pagamento confirmado, a organização envia seus ingressos com QR Code individual. Apresente o QR Code na
            entrada do baile.
          </p>
        </div>

        <button type="button" onClick={onVoltar} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-white">
          <ArrowLeft className="size-4" /> Alterar pedido
        </button>
      </section>

      <aside className="rounded-sm border border-white/10 bg-card/90 p-6 lg:sticky lg:top-24" aria-labelledby="pedido-titulo">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary">Pedido {pedido.ref}</p>
        <h2 id="pedido-titulo" className="font-display mt-1 text-2xl font-black uppercase">
          Seu pedido
        </h2>
        <dl className="mt-5 space-y-2 text-sm">
          <Row label="Comprador" value={pedido.nome} />
          <Row label="E-mail" value={pedido.email} />
        </dl>
        <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">
          {tipos
            .filter((t) => pedido.qtd[t] > 0)
            .map((t) => (
              <li key={t} className="flex justify-between text-muted-foreground">
                <span>
                  {pedido.qtd[t]}× {ingressos[t].nome}
                </span>
                <span className="tabular-nums text-white">{brl(pedido.qtd[t] * ingressos[t].preco)}</span>
              </li>
            ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">
          <Row label="Valor original" value={brl(pedido.subtotal)} />
          <Row label={`Desconto${pedido.cupom ? ` (${pedido.cupom})` : ''}`} value={pedido.desconto ? `− ${brl(pedido.desconto)}` : brl(0)} accent={!!pedido.desconto} />
          <div className="flex items-end justify-between pt-3">
            <dt className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Total</dt>
            <dd className="font-display text-4xl font-black tabular-nums">{brl(pedido.total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}

function Step({ n, title, id }: { n: number; title: string; id?: string }) {
  return (
    <h2 id={id} className="flex items-center gap-3">
      <span className="font-display grid size-9 place-items-center rounded-full bg-primary text-lg font-black text-primary-foreground">{n}</span>
      <span className="font-display text-2xl font-black uppercase sm:text-3xl">{title}</span>
    </h2>
  )
}

function QtyBtn({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-all hover:border-primary hover:bg-primary hover:shadow-[0_0_24px_var(--red-glow)] active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        {label} <span className="text-primary">*</span>
      </Label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="mt-2 text-sm text-primary">
          {error}
        </p>
      )}
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('truncate text-right tabular-nums', accent ? 'text-primary' : 'text-white')}>{value}</dd>
    </div>
  )
}
