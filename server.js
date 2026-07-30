const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
};

// 访问量计数器（内存存储 + 持久化到文件）
const VISITS_FILE = path.join(ROOT, '.visits.json');
const visits = {
  'index.html': 0,
  'data-dashboard.html': 0,
  'forest-achievement.html': 0,
  'forest-guardian.html': 0,
};

try {
  if (fs.existsSync(VISITS_FILE)) {
    const saved = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf-8'));
    Object.keys(visits).forEach(function(k) {
      if (saved[k] != null) visits[k] = saved[k];
    });
  }
} catch (e) { /* ignore */ }

function saveVisits() {
  try {
    fs.writeFileSync(VISITS_FILE, JSON.stringify(visits), 'utf-8');
  } catch (e) { /* ignore */ }
}

function handleApi(req, res) {
  const parsed = new url.URL(req.url, 'http://localhost:' + PORT);
  const pathname = parsed.pathname;

  // 获取访问量
  if (pathname === '/api/visits') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(visits));
    return true;
  }

  // 增加访问量
  if (pathname === '/api/increment') {
    const page = parsed.searchParams.get('page');
    if (page && visits.hasOwnProperty(page)) {
      visits[page]++;
      saveVisits();
    }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(visits));
    return true;
  }

  return false;
}

http.createServer((req, res) => {
  if (handleApi(req, res)) return;

  let filePath = path.join(ROOT, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT + '/');
  console.log('  导航页        - index.html');
  console.log('  森林数据榜单  - data-dashboard.html');
  console.log('  森林成就墙    - forest-achievement.html');
  console.log('  绿色能量榜    - forest-guardian.html');
  console.log('');
  console.log('已加载访问量数据:', JSON.stringify(visits));
});
