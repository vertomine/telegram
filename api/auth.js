// 在线授权验证 API
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

// 数据文件路径
const authFile = path.join('/tmp', 'auth_data.json');
const keysFile = path.join('/tmp', 'keys_data.json');

// 初始化数据文件
function initDataFiles() {
  if (!fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, JSON.stringify({
      devices: {},
      used_keys: []
    }));
  }
  
  if (!fs.existsSync(keysFile)) {
    // 这里放置您的 500 个密钥
    const keys = [
      "A1B2C3D4E5F6G7H8", "I9J0K1L2M3N4O5P6", "Q7R8S9T0U1V2W3X4", 
      "Y5Z6A7B8C9D0E1F2", "G3H4I5J6K7L8M9N0", "O1P2Q3R4S5T6U7V8",
      // ... 这里应该有500个密钥，您可以从 keys_plaintext.txt 复制过来
      // 为了测试，我先写几个示例
      "TESTKEY1234567890", "DEMOKEY1234567890"
    ];
    
    fs.writeFileSync(keysFile, JSON.stringify({
      keys: keys,
      generated_at: new Date().toISOString(),
      total_keys: keys.length
    }));
  }
}

module.exports = async (req, res) => {
  // 设置允许跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 初始化数据文件
  initDataFiles();
  
  try {
    const { action, device_id, license_key } = req.body;
    
    console.log('收到请求:', { action, device_id, license_key: license_key ? '***' + license_key.slice(-4) : '无' });
    
    switch (action) {
      case 'check_auth':
        return await handleCheckAuth(req, res);
      case 'verify_key':
        return await handleVerifyKey(req, res);
      case 'activate':
        return await handleActivate(req, res);
      case 'get_status':
        return await handleGetStatus(req, res);
      default:
        return res.status(400).json({ success: false, message: '未知操作' });
    }
  } catch (error) {
    console.error('服务器错误:', error);
    return res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

// 检查授权状态
async function handleCheckAuth(req, res) {
  const { device_id } = req.body;
  
  if (!device_id) {
    return res.json({ authorized: false, message: '缺少设备ID' });
  }
  
  const authData = jsonfile.readFileSync(authFile);
  const deviceAuth = authData.devices[device_id];
  
  if (!deviceAuth || !deviceAuth.authorized) {
    return res.json({ authorized: false, message: '未授权' });
  }
  
  const expiryDate = new Date(deviceAuth.expiry_date);
  const now = new Date();
  
  if (now > expiryDate) {
    return res.json({ 
      authorized: false, 
      message: `授权已过期 (${expiryDate.toLocaleDateString()})` 
    });
  }
  
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return res.json({
    authorized: true,
    message: '授权有效',
    expiry_date: deviceAuth.expiry_date,
    total_used_keys: deviceAuth.total_used_keys,
    days_remaining: daysRemaining,
    first_activation: deviceAuth.first_activation,
    last_activation: deviceAuth.last_activation
  });
}

// 验证密钥
async function handleVerifyKey(req, res) {
  const { license_key } = req.body;
  
  if (!license_key) {
    return res.json({ valid: false, message: '请输入许可证密钥' });
  }
  
  if (license_key.length !== 16) {
    return res.json({ valid: false, message: '许可证密钥必须是16位' });
  }
  
  const keysData = jsonfile.readFileSync(keysFile);
  const authData = jsonfile.readFileSync(authFile);
  
  const keyIndex = keysData.keys.indexOf(license_key);
  
  if (keyIndex === -1) {
    return res.json({ valid: false, message: '无效的许可证密钥' });
  }
  
  if (authData.used_keys.includes(license_key)) {
    return res.json({ valid: false, message: '该密钥已被使用' });
  }
  
  return res.json({ 
    valid: true, 
    message: '密钥验证成功',
    key_index: keyIndex 
  });
}

// 激活许可证
async function handleActivate(req, res) {
  const { device_id, license_key } = req.body;
  
  if (!device_id || !license_key) {
    return res.json({ success: false, message: '缺少必要参数' });
  }
  
  // 先验证密钥
  const keysData = jsonfile.readFileSync(keysFile);
  const authData = jsonfile.readFileSync(authFile);
  
  const keyIndex = keysData.keys.indexOf(license_key);
  
  if (keyIndex === -1) {
    return res.json({ success: false, message: '无效的许可证密钥' });
  }
  
  if (authData.used_keys.includes(license_key)) {
    return res.json({ success: false, message: '该密钥已被使用' });
  }
  
  // 初始化数据结构
  if (!authData.devices) authData.devices = {};
  if (!authData.used_keys) authData.used_keys = [];
  
  const deviceAuth = authData.devices[device_id] || {
    authorized: false,
    total_used_keys: 0,
    first_activation: null,
    last_activation: null,
    expiry_date: null
  };
  
  // 标记密钥为已使用
  authData.used_keys.push(license_key);
  
  // 更新设备授权信息
  deviceAuth.total_used_keys += 1;
  deviceAuth.last_activation = new Date().toISOString();
  
  if (!deviceAuth.first_activation) {
    deviceAuth.first_activation = deviceAuth.last_activation;
  }
  
  // 计算到期时间
  const baseDays = 30;
  const additionalDays = (deviceAuth.total_used_keys - 1) * 30;
  const totalDays = baseDays + additionalDays;
  
  let newExpiry;
  if (deviceAuth.expiry_date) {
    const currentExpiry = new Date(deviceAuth.expiry_date);
    newExpiry = currentExpiry < new Date() ? 
      new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000) :
      new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else {
    newExpiry = new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000);
  }
  
  deviceAuth.expiry_date = newExpiry.toISOString();
  deviceAuth.authorized = true;
  authData.devices[device_id] = deviceAuth;
  
  // 保存数据
  jsonfile.writeFileSync(authFile, authData, { spaces: 2 });
  
  return res.json({
    success: true,
    message: `授权激活成功！总使用密钥: ${deviceAuth.total_used_keys}个，有效期至：${newExpiry.toLocaleDateString()}`,
    expiry_date: deviceAuth.expiry_date,
    total_used_keys: deviceAuth.total_used_keys
  });
}

// 获取状态
async function handleGetStatus(req, res) {
  const { device_id } = req.body;
  
  if (!device_id) {
    return res.json({
      authorized: false,
      message: '缺少设备ID',
      total_used_keys: 0,
      expiry_date: null,
      days_remaining: 0
    });
  }
  
  const authData = jsonfile.readFileSync(authFile);
  const deviceAuth = authData.devices[device_id];
  
  if (!deviceAuth) {
    return res.json({
      authorized: false,
      message: '设备未激活',
      total_used_keys: 0,
      expiry_date: null,
      days_remaining: 0
    });
  }
  
  const expiryDate = new Date(deviceAuth.expiry_date);
  const now = new Date();
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return res.json({
    authorized: deviceAuth.authorized && now <= expiryDate,
    message: deviceAuth.authorized && now <= expiryDate ? '授权有效' : '授权无效',
    total_used_keys: deviceAuth.total_used_keys,
    expiry_date: deviceAuth.expiry_date,
    days_remaining: Math.max(0, daysRemaining),
    first_activation: deviceAuth.first_activation,
    last_activation: deviceAuth.last_activation
  });
}