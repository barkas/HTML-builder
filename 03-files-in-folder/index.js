const fs = require('fs').promises;
const path = require('path');

const dirname = path.join(__dirname, 'secret-folder');

const readFiles = async function (dir) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const stats = await fs.stat(path.resolve(dir, file.name));
        console.log(
          `${file.name.split('.')[0]} - ${path
            .extname(file.name)
            .split('.')
            .pop()} - ${(stats.size / 1024).toFixed(3)}kb`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};

readFiles(dirname);
