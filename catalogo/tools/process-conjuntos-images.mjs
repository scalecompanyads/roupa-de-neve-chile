import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(
  'C:',
  'Users',
  'Matheus',
  '.cursor',
  'projects',
  'c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile',
  'assets'
);
const outDir = path.join(projectRoot, 'img-conjuntos');

const jobs = [
  { match: 'Branco_e_preto', dest: 'conjunto-estampa-preto-branco' },
  { match: 'Conjunto_off_e_branco', dest: 'conjunto-off-white-estampa' },
  { match: 'Conjunto_vermelho', dest: 'conjunto-vermelho-full' },
  { match: 'Conjunto_preto', dest: 'conjunto-ski-preto-branco' },
];

async function processFile(srcPath, destBase, maxDim = 1100) {
  const outWebp = path.join(outDir, `${destBase}.webp`);
  await sharp(srcPath)
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(outWebp);
  return outWebp;
}

async function main() {
  if (!fs.existsSync(assetsDir)) {
    console.error('Pasta de assets não encontrada:', assetsDir);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(assetsDir);

  for (const job of jobs) {
    const name = files.find((f) => f.includes(job.match) && f.endsWith('.png'));
    if (!name) {
      console.error('Arquivo não encontrado contendo:', job.match);
      process.exit(1);
    }
    const src = path.join(assetsDir, name);
    const out = await processFile(src, job.dest);
    const st = fs.statSync(out);
    console.log(job.dest, '<-', name.substring(0, 60) + '…', '→', (st.size / 1024).toFixed(1), 'KB');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
