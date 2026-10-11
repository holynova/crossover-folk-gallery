// Explicit production allowlist: historical originals and dev files stay private to the repo.
import { readFile, writeFile, copyFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(await readFile(path.join(root,'assets/js/data.js'),'utf8'),context);
const referenced=context.window.ARTWORKS_DATA.flatMap(item=>[item.thumbnail,item.thumbnailLarge,item.image]);
const files=['index.html','favicon.svg','_headers','assets/css/styles.css','assets/js/app.js','assets/js/data.js','assets/js/downloads.js',...new Set(referenced)];
const output=path.join(root,'dist');
await rm(output,{recursive:true,force:true});
for(const file of files){
  if(path.isAbsolute(file)||file.split('/').includes('..'))throw Error(`Unsafe asset path: ${file}`);
  const destination=path.join(output,file);
  await mkdir(path.dirname(destination),{recursive:true});
  if (file === 'index.html') {
    const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
    const themes = ['全部主题', ...new Set(context.window.ARTWORKS_DATA.map(item => item.theme))];
    const buttons = themes.map((theme,i) => `<button type="button" class="theme-tag" data-theme="${escape(theme)}" aria-pressed="${i===0}" aria-controls="gallery">${escape(theme)}</button>`).join('\n');
    const html = await readFile(path.join(root,file),'utf8');
    await writeFile(destination, html.replace(/(<nav class="themes" id="themes"[^>]*>)[\s\S]*?(<\/nav>)/, `$1\n${buttons}\n$2`));
  } else await copyFile(path.join(root,file),destination);
}
console.log(`Production output: ${files.length} files, ${context.window.ARTWORKS_DATA.length} artworks. No original PNGs.`);
