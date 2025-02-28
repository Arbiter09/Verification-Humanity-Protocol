# Humanity Protocol Discord Bot

## 🔥 Overview

This **Discord bot** automates the **issuance and verification of credentials** using **Humanity Protocol**. With two slash commands—`/issuecredential` and `/checkverification`—users can:

- **Issue credentials** on-chain.
- **Check if an address is verified** on Humanity Protocol.

All operations are automated via our backend API and smart contract integration. 🚀

## 🌍 Why This?

In Web3, verifying and issuing **trustless credentials** is crucial. Instead of manually managing credentials, this bot provides an **automated solution** for:

- **Checking if a credential exists on-chain** ✅
- **Issuing new credentials via Humanity Protocol** 🔗
- **Verifying if an address is approved on Humanity Protocol** 🔍
- **Providing transaction hash for on-chain verification** 🛠

## 🛠 Tech Stack

- **Backend:** Node.js (Express)
- **Blockchain:** Solidity, Humanity Protocol, Ethereum (JSON-RPC)
- **Bot Framework:** Discord.js (Slash Commands)
- **API Calls:** Axios

---

## 🎮 Features

- **Issue Credentials:**  
  Uses the `/issuecredential` command to:
  - Call Humanity Protocol’s API for off-chain credential issuance.
  - Mark credentials on-chain via a smart contract.
- **Check Verification:**  
  Uses the `/checkverification` command to query if a given Ethereum address is verified on Humanity Protocol.
- **Dynamic Guild Support:**  
  The bot automatically works with multiple servers without hardcoding the Guild ID.

---

## 📌 Setup Guide

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Arbiter09/Verification-Humanity-Protocol.git
cd Verification-Humanity-Protocol
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
BACKEND_CHECK_URL=http://localhost:3000/api/check-verification
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

**Example:**

```
/issuecredential 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f music_artist
```

**Response:**

- If successful:
  ```
  Credential issued successfully. Transaction hash: 0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff
  ```
- If already issued:
  ```
  Credential is already issued for 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f.
  ```

### **🔍 Check Verification**

Use the slash command:

```
/checkverification <address>
```

**Example:**

```
/checkverification 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f
```

**Response:**

- If verified:
  ```
  The address 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f is verified on Humanity Protocol.
  ```
- If not verified:
  ```
  The address 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f is NOT verified on Humanity Protocol.
  ```

---

## 🏗 How It Works

1. **User Interaction:**
   - Users send `/issuecredential` or `/checkverification` commands in Discord.
2. **Backend API:**
   - For issuing credentials:
     - The bot calls the Humanity API to issue a credential off-chain.
     - Then, it marks the credential on-chain via a smart contract.
   - For checking verification:
     - The bot calls a dedicated endpoint that queries the IVC contract to check if the address is verified.
3. **Smart Contract Integration:**
   - The smart contract tracks credentials and verifies addresses using functions such as `hasCredential()` and `markCredentialIssued()`.
4. **Bot Response:**
   - The bot replies with either a transaction hash, an "already issued" message, or the verification status.

---

## 🔗 Smart Contract

The Solidity contract tracks issued credentials and allows:

- **Checking credential status:** `hasCredential(address, credentialType)`
- **Issuing new credentials:** `markCredentialIssued()`

📌 Contract Address: **`0x5d362a651DB6Ec1c1A70F4Bd79DF57927B352348`**

---

## 🤖 API Reference

The bot interacts with these backend endpoints:

### **1️⃣ Issue Credential**

**`POST /api/issue-credential`**  
**Payload:**

```json
{
  "subject_address": "0xF09b95815aA7f20854a9B1792bb7C44e33b3816f",
  "credentialType": "music_artist"
}
```

**Response:**

```json
{
  "success": true,
  "txHash": "0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff"
}
```

_Or, if already issued:_

```json
{
  "success": true,
  "txHash": "Credential already issued"
}
```

### **2️⃣ Check Verification**

**`POST /api/check-verification`**  
**Payload:**

```json
{
  "subject_address": "0xF09b95815aA7f20854a9B1792bb7C44e33b3816f"
}
```

**Response:**

```json
{
  "verified": true
}
```

_Or, if not verified:_

```json
{
  "verified": false
}
```

---

## 🌐 Deployment

### **1️⃣ Hosting the Bot**

To keep the bot running 24/7, consider using:

- [Heroku](https://www.heroku.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Railway](https://railway.app/)
- [DigitalOcean](https://www.digitalocean.com/)

### **2️⃣ Global Slash Commands**

For global command registration, update the registration in `index.js` to:

```js
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands,
});
```

_Note: Global commands may take up to 1 hour to update._

---

## 📜 Roadmap

- ✅ Issue & verify credentials via Discord
- 🔜 Add support for revoking credentials
- 🔜 Enable user authentication with Humanity Protocol
- 🔜 Frontend dashboard for tracking issued credentials

---

## 🛡 Security & Considerations

- 🔐 Keep your **bot token & private keys** secure.
- ⚠️ Use **rate limits** to prevent abuse.
- 🚀 Use **environment variables** for sensitive data instead of hardcoding them.

---

## 💬 Contact & Support

Need help or want to connect?  
📩 **Twitter:** [@Jas529](https://x.com/Jas529)  
🌍 **LinkedIn:** [Jas Shah](https://www.linkedin.com/in/jas-shah-709854233/)
