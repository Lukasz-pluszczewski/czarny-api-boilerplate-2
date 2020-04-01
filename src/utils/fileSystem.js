import fs from 'fs';
import path from 'path';

export const resolvePath = (...targetPath) => path.resolve(process.env.NODE_PATH, '..', ...targetPath);

export const listFiles = (...targetPath) => fs.readdirSync(resolvePath(...targetPath));
