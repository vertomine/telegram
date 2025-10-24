export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(200).json({
    status: 'healthy',
    service: 'Telegram Auth API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}