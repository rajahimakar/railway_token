const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

const checks = [
  ['Login screen', /id="loginScreen"/.test(html)],
  ['Private login copy', /Enter your secure credentials to continue\./.test(html)],
  ['Role-based permissions', /siteowner: \['overview'/.test(html) && /siteemployee: \['overview'/.test(html) && /business: \['overview'/.test(html) && /master: \['overview'/.test(html)],
  ['Vehicle type selector', /id="vehicleType"/.test(html)],
  ['Bike hourly rate', /Bike 1 Hour/.test(html) && /<span id="bikeHourlyRate">20<\/span>/.test(html)],
  ['Car hourly rate', /Car 1 Hour/.test(html) && /<span id="carHourlyRate">40<\/span>/.test(html)],
  ['Bike daily max', /Bike 24 Hours/.test(html) && /<span id="bikeDailyRate">100<\/span>/.test(html)],
  ['Car daily max', /Car 24 Hours/.test(html) && /<span id="carDailyRate">200<\/span>/.test(html)],
  ['Monthly pass', /Monthly Pass \(30 Days\)/.test(html) && /<span id="monthlyPassRate">2000<\/span>/.test(html)],
  ['Monthly lock-in date', /Locked-in Date/.test(html) || /lockedInDate/.test(html)]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Feature validation failed:');
  failed.forEach(([name]) => console.error('-', name));
  process.exit(1);
}

console.log('All access-role and pricing checks passed');
