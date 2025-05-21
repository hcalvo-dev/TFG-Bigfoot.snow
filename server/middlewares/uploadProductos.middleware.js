import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegura que el directorio exista
const productosDir = path.join('public/uploads/productos');
fs.mkdirSync(productosDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productosDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `producto_${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadProductos = multer({ storage });
