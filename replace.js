const { resolve } = require('path');
const fs = require('fs');

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

getFiles(__dirname)
  .then(files => files
    .filter(fileName => /\.json$/.test(fileName))
    .map(fileName => {
      let data = fs.readFileSync(fileName, { encoding:'utf8' });
      data = data.replace(/^{/, `{"mock-file-path": "${fileName.split('\\').join('\\\\')}",`);
      fs.writeFileSync(fileName, data, { encoding:'utf8' });
    })
  )
  .catch(e => console.error(e));
