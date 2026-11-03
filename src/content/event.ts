/**
 * Conteúdo oficial do Baile do Fluxo FSA.
 *
 * Tudo o que aparece no site sobre o evento vem deste arquivo — links oficiais,
 * data, valores, atrações e galeria. Não invente informações: o que ainda não foi
 * anunciado fica vazio ou como "em breve". Numa etapa futura, atrações e galeria
 * passam a ser editadas pelo painel administrativo (ver PLAN.md).
 */

export const links = {
  instagram: 'https://www.instagram.com/bailedofluxo_fsa/',
  instagramHandle: '@bailedofluxo_fsa',
  whatsappGroup:
    'https://chat.whatsapp.com/BeSpGwc6TT7HtBRlSBkJE4?s=cl&p=a&mlu=4&ilr=4',
  /** Número da organização para envio de comprovantes (DDI + DDD + número). */
  whatsappOrganizacao: '5561994633046',
} as const

/** Informações publicadas no site e nas artes oficiais. */
export const evento = {
  nome: 'Baile do Fluxo FSA',
  edicao: '1ª edição oficial em Formosa',
  data: '20 de novembro',
  horario: '21h',
  local: 'Divulgado em breve pela organização',
  tagline: 'Funk • Resenha • Amizade • Som Automotivo',
  lema: 'Só os fortes.',
} as const

export type TipoIngresso = 'feminino' | 'masculino'

export const ingressos: Record<
  TipoIngresso,
  { nome: string; preco: number; descricao: string }
> = {
  feminino: { nome: 'Feminino', preco: 20, descricao: 'Entrada individual' },
  masculino: { nome: 'Masculino', preco: 30, descricao: 'Entrada individual' },
}

/** Limite por tipo em um único pedido. */
export const maxPorTipo = 10

/** Lote total de ingressos individuais do evento. */
export const totalIngressos = 500

/**
 * Cupons aceitos no site. O desconto é recalculado aqui no navegador para o
 * resumo; quando o checkout passar para o servidor (PLAN.md, etapa 3), a
 * validação definitiva acontece lá.
 */
export const cupons: Record<string, number> = {
  FLUXO15: 0.15,
}

/** Recebimento via Pix (mesma chave do site anterior). */
export const pix = {
  chave: 'bailedofluxofsa@gmail.com',
  favorecido: 'Renato Ribeiro',
  cidade: 'FORMOSA',
} as const

export type Atracao = { nome: string; papel: string; imagem: string }

/**
 * Atrações e DJs confirmados. Lista vazia até a organização anunciar —
 * a seção mostra "Line-up em breve" enquanto isso.
 */
export const atracoes: Atracao[] = []

export type FotoGaleria = {
  src: string
  alt: string
  /** Layout no grid: tall = 2 linhas, wide = 2 colunas. */
  forma?: 'tall' | 'wide'
}

export const galeria: FotoGaleria[] = [
  { src: '/img/arte-oficial.jpg', alt: 'Arte oficial do Baile do Fluxo FSA' },
  { src: '/img/som.png', alt: 'Som automotivo e galera curtindo na rua', forma: 'wide' },
  { src: '/img/dj.png', alt: 'DJ comandando o som sob luz vermelha', forma: 'tall' },
  { src: '/img/arte-20-novembro.jpg', alt: 'Arte de divulgação: 20 de novembro, 1ª edição', forma: 'tall' },
  { src: '/img/lasers.png', alt: 'Público pulando sob lasers vermelhos' },
  { src: '/img/crowd.png', alt: 'Amigos dançando juntos no baile', forma: 'wide' },
  { src: '/img/arte-primeira-edicao.jpg', alt: 'Arte da 1ª edição oficial em Formosa', forma: 'tall' },
  { src: '/img/resenha.png', alt: 'Resenha entre amigos no baile' },
]

/** URL otimizada pelo Netlify Image CDN. */
export function img(src: string, w: number, q = 72) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=${q}`
}

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
