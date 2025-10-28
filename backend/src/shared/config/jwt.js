import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sobe 3 níveis: config → shared → src → backend
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

export default JWT_SECRET;
