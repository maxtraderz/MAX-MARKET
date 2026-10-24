/**
 * Next 16.4 static exports on Windows can retain segment separators as folders
 * while the browser requests dot-separated segment filenames. Keep portable aliases.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
let count=0;
async function walk(dir){
  for(const item of await fs.readdir(dir,{withFileTypes:true})){
    const source=path.join(dir,item.name);
    if(item.isDirectory()){await walk(source);continue;}
    if(!item.name.endsWith('.txt'))continue;
    const parts=path.relative(root,source).split(path.sep);
    const index=parts.findIndex(part=>part.startsWith('__next.'));
    if(index<0||index===parts.length-1)continue;
    const dest=path.join(root,...parts.slice(0,index),parts.slice(index).join('.'));
    await fs.copyFile(source,dest);count++;
  }
}
await walk(root);
console.log('Static segment aliases prepared: '+count);
