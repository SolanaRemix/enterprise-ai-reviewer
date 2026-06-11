
const fs = require('fs');

/**
 * Minimal JQ Fallback for REPO BRAIN HOSPITAL
 * Support basic dot-notation and JSON extraction.
 */

function main() {
  const args = process.argv.slice(2);
  let input = '';

  // Handle stdin or file input
  const readInput = () => {
    return new Promise((resolve) => {
      if (args.length > 1 && fs.existsSync(args[args.length - 1])) {
        resolve(fs.readFileSync(args[args.length - 1], 'utf8'));
      } else {
        process.stdin.on('data', (data) => { input += data; });
        process.stdin.on('end', () => { resolve(input); });
      }
    });
  };

  readInput().then((jsonStr) => {
    if (!jsonStr) return;
    try {
      const data = JSON.parse(jsonStr);
      const query = args[0] || '.';

      if (query === '.') {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      // Basic dot-notation support: .framework or .languages[0]
      const parts = query.replace(/^\./, '').split('.');
      let result = data;
      for (const part of parts) {
        if (result && result.hasOwnProperty(part)) {
          result = result[part];
        } else {
          result = null;
          break;
        }
      }

      if (typeof result === 'object') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result);
      }
    } catch (e) {
      process.exit(1);
    }
  });
}

main();
