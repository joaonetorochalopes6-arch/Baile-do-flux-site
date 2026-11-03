import { MessageCircle } from 'lucide-react'
import { Instagram } from './brand-icons'
import { Logo } from './header'
import { evento, links } from '@/content/event'

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-black">
      <div className="mx-auto grid max-w-content gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {evento.tagline}. {evento.lema}
          </p>
        </div>
        <div>
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-primary">Evento</h2>
          <dl className="mt-4 space-y-2 text-sm text-white/80">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Data</dt>
              <dd>{evento.data}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Horário</dt>
              <dd>{evento.horario}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Local</dt>
              <dd>{evento.local}</dd>
            </div>
            <div className="text-muted-foreground">{evento.edicao}</div>
          </dl>
        </div>
        <div>
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-primary">Comunidade</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                <Instagram className="size-4" /> {links.instagramHandle}
              </a>
            </li>
            <li>
              <a href={links.whatsappGroup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                <MessageCircle className="size-4" /> Grupo oficial no WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-content px-5 py-6 text-xs text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} Baile do Fluxo FSA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
