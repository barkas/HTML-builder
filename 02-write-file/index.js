const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

const filename = path.join(__dirname, 'output.txt');

fs.appendFile(filename, '', (err) => {
  if (err) throw err;
});

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.log('Please, enter some text:');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
    process.exit();
  } else {
    fs.appendFile(filename, input + '\n', (err) => {
      if (err) throw err;
      console.log('Please, enter some text:');
    });
  }
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit();
});
