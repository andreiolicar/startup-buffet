module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, telefone, email, mensagem } = req.body || {};

  const safeNome = String(nome || '').trim();
  const safeTelefone = String(telefone || '').trim();
  const safeEmail = String(email || '').trim();
  const safeMensagem = String(mensagem || '').trim();

  if (!safeNome || !safeTelefone || !safeEmail || !safeMensagem) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const toRaw = process.env.RESEND_TO;

  if (!apiKey || !from || !toRaw) {
    return res.status(500).json({ error: 'Resend não configurado no ambiente' });
  }

  const now = new Date();
  const sentAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'America/Sao_Paulo',
  }).format(now);

  const escaped = {
    nome: escapeHtml(safeNome),
    telefone: escapeHtml(safeTelefone),
    email: escapeHtml(safeEmail),
    mensagem: escapeHtml(safeMensagem).replace(/\n/g, '<br/>'),
    sentAt: escapeHtml(sentAt),
  };

  const subject = `Novo contato do site - ${safeNome}`;
  const html = buildEmailHtml(escaped);
  const text = [
    'Novo contato recebido pelo site Startup Buffet',
    '',
    `Nome: ${safeNome}`,
    `Telefone: ${safeTelefone}`,
    `E-mail: ${safeEmail}`,
    `Data e hora: ${sentAt}`,
    '',
    'Mensagem:',
    safeMensagem,
  ].join('\n');

  const to = toRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  try {
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: safeEmail,
      }),
    });

    if (!resendResp.ok) {
      const errorText = await resendResp.text();
      console.error('Resend error:', errorText);
      return res.status(502).json({ error: 'Falha ao enviar e-mail' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: 'Erro interno no envio' });
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(data) {
  return `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#0b0b0b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #e8e8e8;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:#0b0b0b;color:#ffffff;padding:24px 28px;">
                <div style="font-size:12px;letter-spacing:1.6px;opacity:.75;text-transform:uppercase;font-weight:700;">Startup Buffet</div>
                <h1 style="margin:10px 0 0 0;font-size:24px;line-height:1.2;">Novo contato pelo site</h1>
                <p style="margin:10px 0 0 0;font-size:13px;line-height:1.5;opacity:.85;">Registro enviado em ${data.sentAt}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #ececec;"><strong>Nome</strong><br/><span style="color:#333333;">${data.nome}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #ececec;"><strong>Telefone</strong><br/><span style="color:#333333;">${data.telefone}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #ececec;"><strong>E-mail</strong><br/><span style="color:#333333;">${data.email}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0 2px 0;"><strong>Mensagem</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;background:#fafafa;border:1px solid #ececec;border-radius:12px;color:#262626;line-height:1.6;">${data.mensagem}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

