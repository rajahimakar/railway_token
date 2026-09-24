const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

const checks = [
  ['Login screen', /id="loginScreen"/.test(html)],
  ['Site owner account', /siteowner/.test(html) && /owner123/.test(html)],
  ['Site employee account', /siteemployee/.test(html) && /employee123/.test(html)],
  ['Business demo account', /business/.test(html) && /business123/.test(html)],
  ['Master admin account', /master/.test(html) && /master123/.test(html)],
  ['Vehicle type selector', /id="vehicleType"/.test(html)],
  ['Bike hourly rate', /Bike 1 Hour/.test(html) && /20/.test(html)],
  ['Car hourly rate', /Car 1 Hour/.test(html) && /40/.test(html)],
  ['Bike daily max', /Bike 24 Hours/.test(html) && /100/.test(html)],
  ['Car daily max', /Car 24 Hours/.test(html) && /200/.test(html)],
  ['Monthly pass', /Monthly Pass \(30 Days\)/.test(html) && /2000/.test(html)],
  ['Monthly lock-in date', /Locked-in Date/.test(html) || /lockedInDate/.test(html)]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Feature validation failed:');
  failed.forEach(([name]) => console.error('-', name));
  process.exit(1);
}

console.log('All access-role and pricing checks passed');
