# 🎭 Humanity Protocol Discord Bot

## 🔥 Overview

This **Discord bot** automates the **issuance and verification of credentials** using **Humanity Protocol**. With a simple `/issuecredential` command, users can **verify if a credential exists** and **issue one if it doesn’t**—all on-chain! 🚀

## 🌍 Why This?

In Web3, verifying and issuing **trustless credentials** is crucial. Instead of manually managing credentials, this bot provides an **automated solution** for:

- **Checking if a credential exists on-chain** ✅
- **Issuing new credentials via Humanity Protocol** 🔗
- **Providing transaction hash for on-chain verification** 🛠

## 🛠 Tech Stack

- **Backend:** Node.js (Express)
- **Blockchain:** Solidity, Humanity Protocol, Ethereum (JSON-RPC)
- **Bot Framework:** Discord.js (Slash Commands)
- **API Calls:** Axios

---

## 🎮 Features

- **Verify Credentials:** Checks if a user already has a credential.
- **Issue Credentials:** Issues credentials if not already present.
- **Ethereum Integration:** Uses Humanity Protocol’s API to verify and issue on-chain credentials.
- **Dynamic Guild Support:** Automatically fetches the Guild ID—no manual setup required.

---

## 📌 Setup Guide

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/yourusername/humanity-protocol-discord-bot.git
cd humanity-protocol-discord-bot
```

### 2️⃣ **Install Dependencies**

```bash
npm install
```

### 3️⃣ **Create a `.env` File**

```ini
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_bot_client_id_here
GUILD_ID=your_guild_id_here
BACKEND_URL=http://localhost:3000/api/issue-credential
```

### 4️⃣ **Run the Bot**

```bash
node index.js
```

---

## 🚀 Usage

### **🎭 Issue a Credential**

In Discord, use the slash command:

```
/issuecredential <address> <credentialType>
```

📌 **Example:**

```
/issuecredential 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f music_artist
```

✅ **Response:**

```
Credential issued successfully. Transaction hash: 0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff
```

⚠️ If the credential already exists:

```
Credential is already issued for 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f.
```

---

## 🏗 How It Works

1️⃣ **User sends `/issuecredential` in Discord.**  
2️⃣ The bot **calls the backend API**, which:

- Checks if the credential exists (`hasCredential`).
- If **not issued**, it **requests issuance & marks it on-chain**.
- If **already issued**, it returns the **status**.  
  3️⃣ The bot **replies with the result** (transaction hash or "already issued").

---

## 🔗 Smart Contract

The Solidity contract tracks issued credentials and allows:

- **Checking credential status:** `hasCredential(address, credentialType)`
- **Issuing new credentials:** `markCredentialIssued()`

📌 Contract Address: **`0x5d362a651DB6Ec1c1A70F4Bd79DF57927B352348`**

---

## 🤖 API Reference

The bot interacts with this backend API:

### **1️⃣ Issue Credential**

**`POST /api/issue-credential`**  
📌 **Payload:**

```json
{
  "subject_address": "0xF09b95815aA7f20854a9B1792bb7C44e33b3816f",
  "credentialType": "music_artist"
}
```

📌 **Response:**

```json
{
  "success": true,
  "txHash": "0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff"
}
```

⚠️ If already issued:

```json
{
  "success": true,
  "txHash": "Credential already issued"
}
```

---

## 🌐 Deployment

### **1️⃣ Hosting the Bot**

To keep the bot running 24/7, use a cloud provider like:

- [Heroku](https://www.heroku.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Railway](https://railway.app/)
- [VPS (DigitalOcean, Linode, etc.)](https://www.digitalocean.com/)

### **2️⃣ Register Slash Commands Globally**

Modify `index.js` to use:

```js
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands,
});
```

⏳ **Note:** Global commands take **up to 1 hour** to update.

---

## 📜 Roadmap

- ✅ Issue & verify credentials via Discord
- 🔜 Add support for revoking credentials
- 🔜 Enable user authentication with Humanity Protocol
- 🔜 Frontend dashboard for tracking issued credentials

---

## 🛡 Security & Considerations

- 🔐 Ensure your **bot token & private keys** are **never exposed** in code.
- ⚠️ Use **rate limits** to prevent spam or abuse.
- 🚀 Deploy using **environment variables** instead of hardcoded secrets.

---

## 💬 Contact & Support

Need help or want to connect?  
📩 **Twitter**: [@yourhandle](https://x.com/Jas529)  
🌍 **LinkedIn**: [yourwebsite.com](https://www.linkedin.com/in/jas-shah-709854233/)

---

**🚀 Happy Building!** 🎭
