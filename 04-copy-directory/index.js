const fs = require('fs').promises;
const path = require('path');

const inputdir = path.join(__dirname, 'files');
const outputdir = path.join(__dirname, 'files-copy');

const copyDir = async function (input, output) {
  try {
    await fs.access(output);
    await fs.rm(output, { recursive: true });
  } catch (err) {
    // nothing to do, directory will be created
  }

  await fs.mkdir(output, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });
  const files = await fs.readdir(input, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      try {
        await fs.copyFile(
          path.resolve(input, file.name),
          path.resolve(output, file.name),
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      await copyDir(
        path.resolve(input, file.name),
        path.resolve(output, file.name),
      );
    }
  }
};

copyDir(inputdir, outputdir);
