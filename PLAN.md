# Roadmap — Site oficial Baile do Fluxo FSA

O site foi organizado em etapas. A primeira entrega é a nova cara do baile e a compra
funcionando no mesmo fluxo que o site anterior já usava (Pix + comprovante no WhatsApp).
As etapas seguintes trocam esse fluxo manual por um sistema de ingressos completo, com
banco de dados, QR Codes individuais, e-mail, painel e leitor de portaria.

Regra geral para todas as etapas: não inventar datas, endereço, atrações ou patrocinadores.
Tudo que é conteúdo oficial fica em `src/content/event.ts` (até virar dado editável no painel).

---

## ✅ Etapa 1 — Nova identidade e experiência (entregue)

- Identidade preta/vermelha, tipografia condensada, morcegos, fumaça, lasers, partículas,
  luzes pulsando, entrada de títulos, seções surgindo na rolagem, zoom nas imagens,
  botões com brilho; tudo desligado com "reduzir movimento".
- Página inicial: primeira tela "A NOITE É NOSSA", Sobre, Atrações & DJs (estado "em breve"),
  Ingressos, Galeria, Comunidade (WhatsApp + Instagram oficiais), rodapé.
- `/ingressos`: Feminino R$ 20 / Masculino R$ 30, quantidade, cupom FLUXO15 (15%) com
  validação, resumo com valor original/desconto/total, nome completo e e-mail obrigatórios,
  Pix copia e cola + QR Code com o valor exato e mensagem pronta de comprovante no WhatsApp.

## Etapa 2 — Banco de dados e estoque de 500 ingressos

- Netlify Database (Postgres) com Drizzle: tabelas `orders`, `tickets`, `validations`,
  `admin_audit`.
- `tickets`: 500 linhas pré-criadas (`BF-001` … `BF-500`), `status`
  (`disponivel` | `vendido` | `utilizado` | `cancelado`), `order_id`, `token_hash`
  (SHA-256 de um token aleatório de 32 bytes, índice único), `issued_at`, `used_at`.
- Nome/e-mail do comprador ficam no pedido; o QR carrega só o token (sem dados pessoais).
- Reserva atômica: `UPDATE … WHERE status='disponivel' … LIMIT n FOR UPDATE SKIP LOCKED`
  em transação — impossível vender o 501º ou o mesmo ingresso duas vezes.

## Etapa 3 — Checkout no servidor

- Função server-side cria o pedido: recalcula preços e cupom no servidor (o navegador não
  decide o valor), reserva os ingressos com prazo de expiração e devolve o Pix.
- Contador real de ingressos restantes na página.
- **Decisão pendente:** provedor de pagamento.
  - Opção A: Mercado Pago / Efí / Asaas (Pix dinâmico com webhook → confirmação automática).
  - Opção B: manter Pix estático e confirmar manualmente no painel (etapa 5).

## Etapa 4 — Emissão de QR Codes e e-mail

- Somente após pagamento confirmado: gerar token por ingresso, gravar o hash, marcar
  `vendido` e enviar e-mail com a identidade visual, nome do comprador, um QR Code por
  ingresso, identificador `BF-xxx` e orientações para a portaria.
- Provedor de e-mail (ex.: Resend) com chave guardada em variável de ambiente.
- Reenvio sob demanda (usado pelo painel).

## Etapa 5 — Painel administrativo

- Login com Netlify Identity, papel `admin`; todas as ações em funções server-side.
- Lista dos 500 ingressos com filtros (status) e busca por nome, e-mail ou código.
- Confirmar pagamento (se Opção B), reenviar QR Code, cancelar ingresso.
- Indicadores: vendidos, disponíveis, entradas utilizadas; histórico de validações.
- Exportar CSV de vendas e de entradas.
- Editar atrações/DJs e fotos da galeria (imagens no Netlify Blobs).

## Etapa 6 — Leitor de portaria

- Página `/portaria` mobile-first, acesso com papel `portaria`.
- Câmera via `BarcodeDetector` com fallback (ex.: `qr-scanner`).
- Validação no servidor com um único `UPDATE tickets SET status='utilizado', used_at=now()
  WHERE token_hash=$1 AND status='vendido' RETURNING …` — se dois celulares lerem ao mesmo
  tempo, só um recebe APROVADO; o outro recebe JÁ UTILIZADO.
- Telas: APROVADO (nome + identificador + horário), JÁ UTILIZADO, ACESSO NEGADO.
- Cada leitura gravada em `validations` (aparelho, horário, resultado).

## Etapa 7 — Acabamento

- Rate limiting no checkout e no leitor, testes do fluxo de reserva/validação,
  revisão de acessibilidade e desempenho.
