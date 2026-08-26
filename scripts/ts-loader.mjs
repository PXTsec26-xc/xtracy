import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('@/')) {
      let targetPath = specifier;
      if (specifier.startsWith('@/')) {
        targetPath = path.join(process.cwd(), 'src', specifier.slice(2));
      } else if (context.parentURL) {
        const parentDir = path.dirname(fileURLToPath(context.parentURL));
        targetPath = path.resolve(parentDir, specifier);
      }

      const extensions = ['.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.js'];
      for (const ext of extensions) {
        const candidate = targetPath + ext;
        if (fs.existsSync(candidate)) {
          return {
            url: pathToFileURL(candidate).href,
            shortCircuit: true,
          };
        }
      }
    }
    throw err;
  }
}
