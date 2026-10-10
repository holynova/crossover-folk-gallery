// Explicit production allowlist: historical originals and dev files stay private to the repo.
import { readFile, copyFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(await readFile(path.join(root,'assets/js/data.js'),'utf8'),context);
const referenced=context.window.ARTWORKS_DATA.flatMap(item=>[item.thumbnail,item.thumbnailLarge,item.image]);
const files=['index.html','favicon.svg','_headers','assets/css/styles.css','assets/js/app.js','assets/js/data.js',...new Set(referenced)];
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
for(const file of files){
  if(path.isAbsolute(file)||file.split('/').includes('..'))throw Error(`Unsafe asset path: ${file}`);
  const destination=path.join(output,file);
  await mkdir(path.dirname(destination),{recursive:true});
  await copyFile(path.join(root,file),destination);
}
console.log(`Production output: ${files.length} files, ${context.window.ARTWORKS_DATA.length} artworks. No original PNGs.`);
