# Deploy com Resend (formulário)

Este projeto agora envia o formulário para `POST /api/contact`.

## Variáveis de ambiente
Use os valores abaixo no provedor de deploy:

- `RESEND_API_KEY`
- `RESEND_FROM` (ex.: `Startup Buffet <no-reply@seu-dominio.com>`)
- `RESEND_TO` (pode ser 1 ou mais e-mails separados por vírgula)

Arquivo de referência local: `.env.example`.

## Importante
- Não coloque a API key do Resend no front-end.
- O domínio do `RESEND_FROM` precisa estar validado no painel do Resend.

## Fluxo
1. Usuário envia formulário na home.
2. `main.js` faz `fetch('/api/contact')`.
3. A função server-side usa Resend para enviar e-mail com:
   - Nome
   - Telefone
   - E-mail
   - Mensagem
   - Data/hora (America/Sao_Paulo)

## Teste rápido
1. Configure as variáveis no ambiente de deploy.
2. Publique o site.
3. Envie um teste pelo formulário.
4. Verifique caixa de entrada e logs do endpoint `/api/contact`.