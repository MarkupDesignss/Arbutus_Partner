
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

function fixHtmlFiles() {
  const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
  
  files.forEach(file => {
    const filePath = path.join(distDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(
      /src="\/assets\//g,
      'src="/arbutus-web/assets/'
    );
    
    content = content.replace(
      /href="\/assets\//g,
      'href="/arbutus-web/assets/'
    );
  
    content = content.replace(
      /src="assets\//g,
      'src="/arbutus-web/assets/'
    );
    
    content = content.replace(
      /href="assets\//g,
      'href="/arbutus-web/assets/'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(` Fixed: ${file}`);
  });
}

function create200Html() {
  const indexPath = path.join(distDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  const targetPath = path.join(distDir, '200.html');
  fs.writeFileSync(targetPath, content);
}

//  Create _redirects for Netlify
function createRedirects() {
  const redirectsPath = path.join(distDir, '_redirects');
  const content = `/* /arbutus-web/index.html 200`;
  fs.writeFileSync(redirectsPath, content);
}


fixHtmlFiles();
create200Html();
createRedirects();
