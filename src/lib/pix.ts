/**
 * Gera o código Pix "copia e cola" (BR Code estático, padrão EMV do Banco Central)
 * com valor definido. Mesmo formato usado no site anterior.
 */
const campo = (id: string, valor: string) =>
  id + String(valor.length).padStart(2, '0') + valor

function crc16(payload: string) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

const limpar = (s: string, max: number) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .slice(0, max)

export function gerarPix(opts: {
  chave: string
  nome: string
  cidade: string
  valor: number
  txid?: string
}) {
  const conta = campo('00', 'br.gov.bcb.pix') + campo('01', opts.chave)
  const txid = (opts.txid ?? '***').replace(/[^A-Za-z0-9*]/g, '').slice(0, 25) || '***'
  const base =
    campo('00', '01') +
    campo('26', conta) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('54', opts.valor.toFixed(2)) +
    campo('58', 'BR') +
    campo('59', limpar(opts.nome, 25)) +
    campo('60', limpar(opts.cidade, 15)) +
    campo('62', campo('05', txid)) +
    '6304'
  return base + crc16(base)
}
