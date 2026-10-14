import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'sabaifight';

let cachedClient = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!uri) {
    console.error('MONGODB_URI não configurada no projeto Vercel.');
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  const body = req.body || {};
  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';
  const experiencia = typeof body.experiencia === 'string' ? body.experiencia.trim() : '';

  if (!nome || !whatsapp) {
    return res.status(400).json({ ok: false, error: 'missing_required_fields' });
  }

  try {
    const client = await getClient();
    const db = client.db(dbName);
    await db.collection('contatos').insertOne({
      nome,
      whatsapp,
      experiencia: experiencia || null,
      criadoEm: new Date(),
      origem: 'site'
    });

    // Encaminha também para a planilha do Google Sheets, se configurado.
    const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      try {
        const params = new URLSearchParams({ nome, whatsapp, experiencia });
        await fetch(sheetsUrl, { method: 'POST', body: params });
      } catch (sheetsErr) {
        console.error('Falha ao encaminhar para o Sheets:', sheetsErr.message);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar contato:', err.message);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
}
