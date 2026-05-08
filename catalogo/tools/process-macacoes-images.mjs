import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('C:/Users/Matheus/Desktop/Clientes/Nevou no Chile');
const outDir = path.join(projectRoot, 'img-macacoes');

const sources = [
  {
    src: 'C:/Users/Matheus/.cursor/projects/c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile/assets/c__Users_Matheus_AppData_Roaming_Cursor_User_workspaceStorage_bbd06f8f8163b1998d2d663b78ffd352_images_WhatsApp_Image_2026-04-23_at_10.50.16-58cef881-d1d2-4715-9334-be0624049a4e.png',
    out: 'macacao-pink.webp',
  },
  {
    src: 'C:/Users/Matheus/.cursor/projects/c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile/assets/c__Users_Matheus_AppData_Roaming_Cursor_User_workspaceStorage_bbd06f8f8163b1998d2d663b78ffd352_images_WhatsApp_Image_2026-04-23_at_10.54.24-1617ee7d-5225-4d13-977e-b5f1cd3aa5a7.png',
    out: 'macacao-laranja.webp',
  },
  {
    src: 'C:/Users/Matheus/.cursor/projects/c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile/assets/c__Users_Matheus_AppData_Roaming_Cursor_User_workspaceStorage_bbd06f8f8163b1998d2d663b78ffd352_images_WhatsApp_Image_2026-04-23_at_10.56.03-71eb23a6-a56b-43f4-af26-b0ddf43fa8a2.png',
    out: 'macacao-vermelho.webp',
  },
  {
    src: 'C:/Users/Matheus/.cursor/projects/c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile/assets/c__Users_Matheus_AppData_Roaming_Cursor_User_workspaceStorage_bbd06f8f8163b1998d2d663b78ffd352_images_WhatsApp_Image_2026-04-23_at_11.00.28-6fc2f3f5-3d88-4e8f-844f-5cb1becb808b.png',
    out: 'macacao-grafite.webp',
  },
  {
    src: 'C:/Users/Matheus/.cursor/projects/c-Users-Matheus-Desktop-Clientes-Nevou-no-Chile/assets/c__Users_Matheus_AppData_Roaming_Cursor_User_workspaceStorage_bbd06f8f8163b1998d2d663b78ffd352_images_WhatsApp_Image_2026-04-23_at_11.02.18-bd725a4a-a944-4e67-8136-9a90750338a3.png',
    out: 'macacao-bege.webp',
  },
];

async function run() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const item of sources) {
    if (!fs.existsSync(item.src)) {
      throw new Error(`Arquivo não encontrado: ${item.src}`);
    }

    const outPath = path.join(outDir, item.out);
    const inputBuffer = fs.readFileSync(item.src);
    await sharp(inputBuffer)
      .flatten({ background: { r: 230, g: 230, b: 230 } })
      .resize(1100, 1100, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(outPath);

    const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`${item.out} -> ${sizeKb} KB`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
