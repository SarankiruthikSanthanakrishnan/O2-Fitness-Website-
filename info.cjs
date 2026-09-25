const sharp = require('sharp');

async function info() {
  const metadata = await sharp('public/ChatGPT Image Sep 24, 2026, 08_22_59 PM.png').metadata();
  console.log(metadata);
}
info();
