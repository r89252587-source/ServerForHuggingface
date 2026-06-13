const handler = require('./api/match-store.js');

const req = {
  method: 'POST',
  body: { userLocation: 'Beur' }
};

const res = {
  setHeader: (key, value) => {
    // console.log(`Header set: ${key} = ${value}`);
  },
  status: (code) => {
    return {
      json: (data) => console.log(`Status ${code}:`, data),
      end: () => console.log(`Status ${code}: (empty response)`)
    };
  },
  json: (data) => console.log('Response:', data)
};

console.log("Running api/match-store.js handler...");
handler(req, res).catch(err => console.error("Error:", err));
