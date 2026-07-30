const { execSync } = require('child_process');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

try {
  const result = execSync(
    `npx -y mcporter call mcp-on-edge.edgeone.app/mcp-server.deploy-html`,
    {
      input: JSON.stringify({ value: html }),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000,
    }
  );
  console.log(result.toString());
} catch (err) {
  console.error('Deploy failed:', err.stderr?.toString() || err.message);
}
