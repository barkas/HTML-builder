const fs = require('fs').promises;
const path = require('path');

const buildCSS = async function (input, output) {
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

const buildPage = async function (dest) {
  try {
    await fs.access(input, dest);
    await fs.rm(dest, { recursive: true });
  } catch (err) {
    // nothing to do, directory will be created
  }

  await fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });

  try {
    let data = await fs.readFile(input, 'utf8');
    const templateTags = data.match(/{{\s*([\w-]+)\s*}}/g);
    for (let tag of templateTags) {
      const componentName = tag.match(/{{\s*([\w-]+)\s*}}/)[1];
      const componentFilePath = path.join(components, `${componentName}.html`);
      try {
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        data = data.replace(tag, componentContent);
      } catch (error) {
        console.error(error);
      }
    }
    await fs.writeFile(htmlOut, data);
  } catch (err) {
    console.error(err);
  }
};

const input = path.join(__dirname, 'template.html');
const htmlOut = path.join(__dirname, 'project-dist', 'index.html');
const cssOut = path.join(__dirname, 'project-dist', 'style.css');
const destination = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');

(async () => {
  await buildPage(destination);
  buildCSS(path.join(__dirname, 'styles'), cssOut);
  copyDir(path.join(__dirname, 'assets'), path.join(destination, 'assets'));
})();
