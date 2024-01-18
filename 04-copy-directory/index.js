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
  const files = await fs.readdir(input);
  for (const file of files) {
    try {
      await fs.copyFile(path.resolve(input, file), path.resolve(output, file));
    } catch (err) {
      console.error(err);
    }
  }
};

copyDir(inputdir, outputdir);
