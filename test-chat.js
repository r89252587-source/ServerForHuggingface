const handler = require('./api/chat.js');

const req = {
  method: 'POST',
  body: { 
    prompt: 'What is the capital of Bihar?',
    systemPrompt: 'You are a helpful assistant. Keep your answers short and concise.'
  }
};

const res = {
  setHeader: () => {},
  status: (code) => ({
    json: (data) => console.log(`Status ${code}:`, JSON.stringify(data, null, 2)),
    end: () => console.log(`Status ${code}: (empty)`)
  }),
  json: (data) => console.log('Response:', JSON.stringify(data, null, 2))
};

console.log("Testing /api/chat with prompt: 'What is the capital of Bihar?'");
handler(req, res).catch(err => console.error("Error:", err));
