// api/health.js - 健康检查端点
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "auth-api"
  });
};