import {fileURLToPath} from "url";
import { dirname  } from "path";
export const __filename = fileURLToPath(import.meta.url);//Devuelve la ruta actual del archivo
export const __dirname = dirname(__filename)