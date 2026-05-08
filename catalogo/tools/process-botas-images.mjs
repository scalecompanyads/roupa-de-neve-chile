import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const accBase = path.join(projectRoot, 'chapeus-acessorios');
const outDir = path.join(projectRoot, 'img-botas');

const sub = fs.existsSync(accBase)
  ? fs.readdirSync(accBase).find((d) => d.startsWith('drive-download'))
  : null;
const srcDir = sub ? path.join(accBase, sub) : null;

/** Redimensiona e exporta WebP mantendo o fundo da foto (sem recorte por flood-fill). */
async function processFile(srcPath, destBase, maxDim = 1100) {
  const outWebp = path.join(outDir, `${destBase}.webp`);
  let pipeline = sharp(srcPath)
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true });
  await pipeline.webp({ quality: 86, effort: 6 }).toFile(outWebp);
  return outWebp;
}

function findFile(dir, includes, excludes = []) {
  const files = fs.readdirSync(dir);
  const lower = (s) => s.toLowerCase();
  return files.find((f) => {
    const l = lower(f);
    if (!l.endsWith('.png')) return false;
    if (!includes.every((inc) => l.includes(lower(inc)))) return false;
    if (excludes.some((exc) => l.includes(lower(exc)))) return false;
    return true;
  });
}

async function main() {
  if (!srcDir || !fs.existsSync(srcDir)) {
    console.error('Pasta de origem não encontrada:', srcDir);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const jobs = [
    { dest: 'bota-preta', includes: ['bota'], excludes: ['branca', 'dourada'] },
    { dest: 'bota-preta-branca', includes: ['bota', 'branca'] },
    { dest: 'bota-dourada', includes: ['dourada'] },
    { dest: 'oculos-prata', includes: ['culo'], excludes: ['color'] },
    { dest: 'oculos-colorido', includes: ['color'] },
    { dest: 'chapeu-preto', includes: ['chap'] },
  ];

  for (const job of jobs) {
    const name = findFile(srcDir, job.includes, job.excludes);
    if (!name) {
      console.error('Arquivo não encontrado para', job.dest, 'em', srcDir);
      process.exit(1);
    }
    const src = path.join(srcDir, name);
    const out = await processFile(src, job.dest);
    const st = fs.statSync(out);
    console.log(job.dest, '<-', name, '→', (st.size / 1024).toFixed(1), 'KB');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
