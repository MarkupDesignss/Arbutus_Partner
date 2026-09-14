
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use('/arbutus-web', express.static(path.join(__dirname, 'dist', 'arbutus-web')));
app.use('/arbutus-web/assets', express.static(path.join(__dirname, 'dist', 'arbutus-web', 'assets')));


app.get('/arbutus-web/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}/arbutus-web/`);
});