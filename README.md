# Baile do Fluxo FSA — site oficial

Site oficial do **Baile do Fluxo FSA** (Formosa): funk, resenha, amizade e som automotivo.
Visual noturno preto e vermelho com morcegos, fumaça, lasers e fotografia de baile, e uma
página de compra de ingressos rápida.

## O que já funciona

- **Página inicial** (`/`): primeira tela "A NOITE É NOSSA", Sobre, Atrações & DJs,
  Ingressos, Galeria, Comunidade (grupo oficial do WhatsApp e Instagram) e rodapé.
- **Compra** (`/ingressos`): Feminino R$ 20 e Masculino R$ 30, escolha de quantidade, cupom
  promocional (FLUXO15 = 15%), resumo com valor original, desconto e total, cadastro com nome
  completo e e-mail, Pix copia e cola + QR Code com o valor exato e envio do comprovante
  pronto para o WhatsApp da organização.

## Tecnologias

TanStack Start (React 19) · Tailwind CSS 4 · shadcn/ui · Netlify (deploy e Image CDN) ·
`qrcode` para o QR Code do Pix. Animações em CSS puro, respeitando "reduzir movimento".

## Rodando localmente

```bash
pnpm install
netlify dev        # ou: pnpm dev (porta 3000)
```

## Onde editar o conteúdo

Tudo que é informação oficial — links, data, horário, local, preços, cupons, atrações e
fotos da galeria — está em `src/content/event.ts`. Para anunciar uma atração, adicione
um item em `atracoes` com nome, papel e imagem (em `public/img`).

## Próximas etapas

Veja [PLAN.md](PLAN.md): banco de dados com os 500 ingressos, checkout no servidor,
QR Codes individuais por e-mail, painel administrativo e leitor de portaria.
