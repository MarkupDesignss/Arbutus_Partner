const fs = require('fs');
const path = require('path');

function moveAssets() {
  const distDir = path.join(__dirname, 'dist');
  const assetsDir = path.join(distDir, 'assets');
  const targetDir = path.join(distDir, 'arbutus-web', 'assets');

  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Move all assets including folders
  if (fs.existsSync(assetsDir)) {
    const items = fs.readdirSync(assetsDir);
    items.forEach(item => {
      const oldPath = path.join(assetsDir, item);
      const newPath = path.join(targetDir, item);
      fs.renameSync(oldPath, newPath);
    });
    fs.rmdirSync(assetsDir);
  }

  // Move all JS and CSS files from root
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map')) {
      const oldPath = path.join(distDir, file);
      const newPath = path.join(targetDir, file);
      if (fs.existsSync(oldPath) && !fs.statSync(oldPath).isDirectory()) {
        fs.renameSync(oldPath, newPath);
      }
    }
  });

}

moveAssets();