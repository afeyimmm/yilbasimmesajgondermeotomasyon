const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ------------------ FILES ------------------
const contactsPath = path.join(__dirname, "contacts.json");
const configPath = path.join(__dirname, "config.json");
const successLog = path.join(__dirname, "success.log");
const failLog = path.join(__dirname, "fail.log");

// ------------------ READ DATA ------------------
let contacts = JSON.parse(fs.readFileSync(contactsPath, "utf8"));
if (!Array.isArray(contacts)) contacts = [contacts];

const { myNumber: MY_NUMBER } = JSON.parse(
  fs.readFileSync(configPath, "utf8")
);

// ------------------ UTILS ------------------
const delay = ms => new Promise(r => setTimeout(r, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ------------------ CLIENT ------------------
const client = new Client({
  authStrategy: new LocalAuth()
});

// ------------------ QR ------------------
client.on("qr", qr => {
  console.clear();
  console.log(chalk.yellow("QR kodu telefondan okut"));
  qrcode.generate(qr, { small: true });
});

// ------------------ READY ------------------
client.on("ready", () => {
  console.clear();
  console.log(chalk.green.bold("WhatsApp hazır\n"));
  showMenu();
});

// ------------------ MENU ------------------
function showMenu() {
  console.log(chalk.cyan.bold("=== ANA MENÜ ==="));
  console.log(chalk.green("1) Test modu (kendime gönder)"));
  console.log(chalk.blue("2) Normal test (hemen gönder)"));
  console.log(chalk.magenta("3) Yılbaşı modu (31 Aralık 00:00)"));
  console.log(chalk.red("4) Çıkış\n"));

  rl.question(chalk.white("Seçim (1/2/3/4): "), choice => {
    if (choice === "4") {
      console.log(chalk.red("Çıkılıyor..."));
      rl.close();
      client.destroy();
      return;
    }

    rl.question(
      chalk.white("Mesajı yaz ({name} kullanabilirsin): "),
      message => {
        if (choice === "1") testMode(message);
        else if (choice === "2") sendAll(message);
        else if (choice === "3") newYearMode(message);
        else {
          console.log(chalk.red("Geçersiz seçim\n"));
          showMenu();
        }
      }
    );
  });
}

// ------------------ TEST MODE ------------------
async function testMode(template) {
  const chatId = MY_NUMBER + "@c.us";
  const msg = template.replace("{name}", "TEST");

  await client.sendMessage(chatId, msg);
  console.log(chalk.yellow("Test mesajı gönderildi"));

  rl.question(chalk.white("Mesaj geldi mi? (E/H): "), ans => {
    if (ans.toLowerCase() === "e") {
      console.log(chalk.green("Test başarılı, sistem hazır\n"));
    } else {
      console.log(chalk.red("Test başarısız\n"));
    }
    showMenu();
  });
}

// ------------------ SEND ALL ------------------
async function sendAll(template) {
  console.log(chalk.cyan("\nGönderim başladı...\n"));

  for (const person of contacts) {
    const chatId = person.phone + "@c.us";
    const msg = template.replace("{name}", person.name);

    try {
      await client.sendMessage(chatId, msg);
      fs.appendFileSync(successLog, `${person.name} | ${person.phone}\n`);
      console.log(chalk.green(`✓ Gönderildi: ${person.name}`));
    } catch {
      fs.appendFileSync(failLog, `${person.name} | ${person.phone}\n`);
      console.log(chalk.red(`✗ Hata: ${person.name}`));
    }

    await delay(4000);
  }

  console.log(chalk.green.bold("\nGönderim tamamlandı\n"));
  showMenu();
}

// ------------------ NEW YEAR MODE ------------------
async function newYearMode(template) {
  console.log(chalk.magenta("31 Aralık 00:00 bekleniyor...\n"));
  await waitUntilNewYear();
  await sendAll(template);
}

// ------------------ TIME ------------------
function waitUntilNewYear() {
  return new Promise(resolve => {
    const now = new Date();
    const target = new Date(now.getFullYear(), 11, 31, 0, 0, 0);
    if (now >= target) target.setFullYear(target.getFullYear() + 1);
    setTimeout(resolve, target - now);
  });
}

// ------------------ START ------------------
client.initialize();
