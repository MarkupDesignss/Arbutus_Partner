const fs = require('fs');
const path = require('path');

const routes = [
  '/',
  '/Aboutmain',
  '/AltDatabaseMain',
  '/Newsmain',
  '/Contactmain',
  '/Levelmain',
  '/Resarchmain',
  '/Privacypolicy',
  '/TremsandCondition',
];

const routesFilePath = path.join(__dirname, 'routes.json');
fs.writeFileSync(routesFilePath, JSON.stringify(routes, null, 2));

