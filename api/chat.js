// ============================================================
// api/chat.js — Vercel Serverless Function（AI 代理）
// Vercel 会自动将环境变量 DASHSCOPE_API_KEY 注入
// ============================================================

const https = require('https');

module.exports = async (req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只接受 POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: '仅支持 POST 请求' });
    return;
  }

  const API_KEY = process.env.DASHSCOPE_API_KEY;
  const BASE_URL = 'ws-btc1dd34uhakwcc3.cn-beijing.maas.aliyuncs.com';
  const MODEL = 'qwen-turbo';
  const SYSTEM_PROMPT = '你是华北电力大学氢能科学与工程专业的智能助手。请基于已有知识回答用户问题，回答要简洁准确。如果不知道就说不知道，不要编造。';

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ error: '消息不能为空' });
      return;
    }

    if (!API_KEY) {
      res.status(500).json({ error: '服务端未配置 API Key（请在 Vercel 环境变量中设置 DASHSCOPE_API_KEY）' });
      return;
    }

    const postData = JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    });

    const options = {
      hostname: BASE_URL,
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const aiResponse = await new Promise((resolve, reject) => {
      const reqAI = https.request(options, (resAI) => {
        let data = '';
        resAI.on('data', chunk => data += chunk);
        resAI.on('end', () => {
          try {
            resolve({ status: resAI.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: resAI.statusCode, body: data });
          }
        });
      });
      reqAI.on('error', reject);
      reqAI.write(postData);
      reqAI.end();
    });

    if (aiResponse.status !== 200) {
      res.status(502).json({
        error: `AI 服务响应错误: ${aiResponse.status}`,
        detail: JSON.stringify(aiResponse.body).substring(0, 500)
      });
      return;
    }

    res.status(200).json(aiResponse.body);

  } catch (err) {
    res.status(500).json({ error: '代理请求失败: ' + err.message });
  }
};
