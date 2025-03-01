# Humanity Protocol Discord Bot

## 🔥 Overview

This **Discord bot** automates the **issuance, verification, and revocation of credentials** using **Humanity Protocol**. With several slash commands—`/issuecredential`, `/checkverification`, `/revokecredential`, `/credentialcount`, and `/verifycredential`—users can:

- **Issue credentials** on-chain and off-chain via Humanity Protocol.
- **Check on-chain verification** status for a given address.
- **Revoke credentials** from both your smart contract and Humanity’s registry.
- **Verify stored credentials** using just an address and credential type.
- **Retrieve credential details** (count and types).

All operations are automated via our backend API, smart contract integration, and a caching mechanism that stores issued credential JSON for later revocation and verification. 🚀

---

## 🌍 Why This?

In Web3, managing **trustless credentials** is crucial. Instead of manually handling credentials, this bot provides an **automated solution** for:

- **Issuing credentials via Humanity Protocol** (off-chain) and recording them on-chain.
- **Checking verification status** directly on-chain.
- **Revoking credentials** on both Humanity and your smart contract.
- **Verifying credentials** with just an address and credential type (no need to paste full JSON).
- **Retrieving detailed credential data** (number and types).

---

## 🛠 Tech Stack

- **Backend:** Node.js (Express)
- **Blockchain:** Solidity, Humanity Protocol, Ethereum (JSON-RPC)
- **Bot Framework:** Discord.js (Slash Commands)
- **API Calls:** Axios, node-fetch

---

## 🎮 Features

- **Issue Credentials:**  
  Use the `/issuecredential` command to:

  - Call Humanity Protocol’s API for off-chain credential issuance.
  - Cache the entire credential JSON (including its unique `id`).
  - Mark credentials as issued on-chain via a smart contract.

- **Check Verification:**  
  Use the `/checkverification` command to query if a given Ethereum address is verified on Humanity Protocol (via on-chain check).

- **Revoke Credentials:**  
  Use the `/revokecredential` command to:

  - Revoke credentials on-chain using your smart contract.
  - Revoke the corresponding credential off-chain on Humanity (using the cached `credentialId`).
  - Remove the credential from the cache after revocation.

- **Verify Credential:**  
  Use the `/verifycredential` command to verify an issued credential off-chain using only the address and credential type.  
  The backend retrieves the stored credential JSON and sends it to Humanity’s verification endpoint.

- **Credential Count:**  
  Use the `/credentialcount` command to get the number and list of credential types issued to an address.

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
# Discord Bot Config
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_bot_client_id_here
GUILD_ID=your_guild_id_here

# Backend API Endpoints
BACKEND_URL=http://localhost:3000/api/issue-credential
BACKEND_CHECK_URL=http://localhost:3000/api/check-verification
BACKEND_REVOKE_URL=http://localhost:3000/api/revoke-credential
BACKEND_COUNT_URL=http://localhost:3000/api/credential-details
BACKEND_VERIFY_URL=http://localhost:3000/api/verify-credential

# Blockchain & Humanity Protocol Config
HUMANITY_RPC_URL=your_rpc_url_here
HUMANITY_API_KEY=your_humanity_api_key_here
CONTRACT_ADDRESS=your_smart_contract_address_here
VC_CONTRACT_ADDRESS=your_vc_contract_address_here
PRIVATE_KEY=your_private_key_here
CHAIN_ID=1942999413
```

### 4️⃣ **Run the Backend & Discord Bot**

In one terminal, run your backend server:

```bash
node server.js
```

In another terminal, start the Discord bot:

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

- If successful, you'll receive a transaction hash:
  ```
  Credential issued successfully. Transaction hash: 0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff
  ```
- If already issued:
  ```
  Credential is already issued for 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f.
  ```

---

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

### **🔓 Revoke Credential**

Use the slash command:

```
/revokecredential <address> <credentialType>
```

**Example:**

```
/revokecredential 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f music_artist
```

**Response:**

- If successful, you'll see a message like:
  ```
  Credential revoked successfully on-chain (TX: 0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff) and on Humanity (message: Credential revoked successfully).
  ```

---

### **📝 Credential Count**

Use the slash command:

```
/credentialcount <address>
```

**Example:**

```
/credentialcount 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f
```

**Response:**

- Displays the total number of credentials and the list of credential types:
  ```
  The address 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f has 2 credential(s): music_artist, another_type
  ```

---

### **🔎 Verify Credential**

Use the slash command:

```
/verifycredential <address> <credentialType>
```

**Example:**

```
/verifycredential 0xF09b95815aA7f20854a9B1792bb7C44e33b3816f music_artist
```

**Response:**

- The bot will retrieve the stored credential JSON and send it to Humanity’s verification endpoint, returning the result.

---

## 🏗 How It Works

1. **User Interaction:**
   - Users send one of the slash commands in Discord.
2. **Backend API:**
   - For issuing credentials:
     - The bot calls Humanity’s API to issue a credential off-chain.
     - The credential JSON is cached (for future revocation and verification).
     - The backend then marks the credential on-chain via a smart contract.
   - For revoking credentials:
     - The backend retrieves the stored credential JSON.
     - It revokes the credential on-chain and then calls Humanity’s revoke endpoint using the cached `credentialId`.
   - For verification:
     - The backend retrieves the cached credential JSON and verifies it off-chain via Humanity’s API.
   - For credential details:
     - The backend queries the smart contract for credential count and types.
3. **Smart Contract Integration:**
   - The smart contract tracks credentials and verifies addresses using functions such as `hasCredential()`, `markCredentialIssued()`, and `revokeCredential()`.
4. **Bot Response:**
   - The bot replies with transaction hashes, revocation messages, verification status, or credential details.

---

## 🔗 Smart Contract

The Solidity contract tracks issued credentials and allows:

- **Checking credential status:** `hasCredential(address, credentialType)`
- **Issuing new credentials:** `markCredentialIssued()`
- **Revoking credentials:** `revokeCredential()`

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

---

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

### **3️⃣ Revoke Credential**

**`POST /api/revoke-credential`**  
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
  "txHash": "0x312c53209c5d853563ca4487c738a588fa973f64a30527d389abb230e1669bff",
  "humanityMessage": "Credential revoked successfully"
}
```

---

### **4️⃣ Credential Details**

**`POST /api/credential-details`**  
**Payload:**

```json
{
  "subject_address": "0xF09b95815aA7f20854a9B1792bb7C44e33b3816f"
}
```

**Response:**

```json
{
  "count": "2",
  "types": ["music_artist", "another_type"]
}
```

---

### **5️⃣ Verify Credential**

**`POST /api/verify-credential`**  
**Payload:**

```json
{
  "subject_address": "0xF09b95815aA7f20854a9B1792bb7C44e33b3816f",
  "credentialType": "music_artist"
}
```

**Response:**

The response will include the verification result from Humanity’s API.

---

## 🌐 Deployment

### **1️⃣ Hosting the Backend & Bot**

To keep the backend API and the Discord bot running 24/7, consider using:

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
- ✅ Revoke credentials on-chain and off-chain (Humanity)
- ✅ Retrieve credential count & details
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
