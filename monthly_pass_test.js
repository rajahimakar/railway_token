const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

if (!html.includes('Monthly Pass')) {
  throw new Error('Monthly pass option is missing');
}

if (!html.includes('₹2000') && !html.includes('2000')) {
  throw new Error('Monthly pass amount is missing');
}

if (!html.includes('lockedInDate') && !html.includes('Locked-in date')) {
  throw new Error('Monthly pass lock-in date field is missing');
}

console.log('Monthly pass feature check passed');
