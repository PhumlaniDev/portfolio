// generate-env.js
const fs = require('fs');

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  process.exit(1);
}

const content = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  }
};
`;

fs.writeFileSync('./src/environments/environment.ts', content);
fs.writeFileSync('./src/environments/environment.prod.ts', content);
console.log('✅ environment.ts generated successfully');
console.log('Written content:', fs.readFileSync('./src/environments/environment.prod.ts', 'utf8'));
