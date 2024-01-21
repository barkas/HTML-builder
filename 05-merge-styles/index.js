const fs = require('fs').promises;
const path = require('path');

const build = async function (input, output) {
  try {
    await fs.writeFile(output, '');
    const files = await fs.readdir(input, { withFileTypes: true });
    files.forEach(async (file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const buffer = await fs.readFile(path.resolve(input, file.name));
        await fs.appendFile(output, buffer);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const inputdir = path.join(__dirname, 'styles');
const output = path.join(__dirname, 'project-dist', 'bundle.css');

build(inputdir, output);
