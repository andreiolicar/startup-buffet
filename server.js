const http = require('http');
const url = require('url');

// Importa o handler da API
const contactHandler = require('./api/contact');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // Rota da API de contato
  if (parsed.pathname === '/api/contact') {
    // Lê o body da requisição
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        req.body = {};
      }

      // Headers CORS para o front-end
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
      }

      // Adapta para o formato do handler
      const mockRes = {
        statusCode: 200,
        headers: {},
        setHeader(k, v) { this.headers[k] = v; res.setHeader(k, v); },
        status(code) { this.statusCode = code; return this; },
        json(data) {
          res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        }
      };

      await contactHandler(req, mockRes);
    });
    return;
  }

  // Rota de health check
  if (parsed.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});