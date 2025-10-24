// api/index.js - 根路由
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  return res.status(200).json({
    service: "Telegram Manager Auth API",
    status: "online",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      health: "/api/health"
    },
    message: "服务正常运行"
  });
};