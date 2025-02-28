// index.js
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Define slash commands for issuing credentials and checking verification
const commands = [
  new SlashCommandBuilder()
    .setName("issuecredential")
    .setDescription("Issue a credential to a given Ethereum address")
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription(
          "The Ethereum address (or DID) to issue the credential to"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("credential")
        .setDescription("The type of credential (e.g., music_artist)")
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("checkverification")
    .setDescription(
      "Check if the given address is verified on Humanity Protocol"
    )
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription("The Ethereum address (or DID) to check")
        .setRequired(true)
    )
    .toJSON(),
];

// Register slash commands with Discord
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("Slash commands registered successfully!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();

// Listen for interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "issuecredential") {
    await interaction.deferReply(); // Defer the reply if processing takes time

    // Get the command options
    const address = interaction.options.getString("address");
    const credential = interaction.options.getString("credential");

    try {
      // Call your backend API to issue the credential
      const response = await axios.post(process.env.BACKEND_URL, {
        subject_address: address,
        credentialType: credential,
      });
      const result = response.data;

      if (result.txHash && result.txHash !== "Credential already issued") {
        await interaction.editReply(
          `Credential issued successfully. Transaction hash: ${result.txHash}`
        );
      } else if (
        result.txHash === "Credential already issued" ||
        result.message === "Credential already issued"
      ) {
        await interaction.editReply(
          `Credential is already issued for ${address}.`
        );
      } else {
        await interaction.editReply(`Result: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("Error issuing credential:", error);
      await interaction.editReply(
        "There was an error issuing the credential. Please try again later."
      );
    }
  } else if (interaction.commandName === "checkverification") {
    await interaction.deferReply();

    const address = interaction.options.getString("address");

    try {
      // Use BACKEND_CHECK_URL if provided, otherwise default to localhost endpoint.
      const backendCheckUrl =
        process.env.BACKEND_CHECK_URL ||
        "http://localhost:3000/api/check-verification";
      const response = await axios.post(backendCheckUrl, {
        subject_address: address,
      });
      const result = response.data;

      if (result.verified) {
        await interaction.editReply(
          `The address ${address} is verified on Humanity Protocol.`
        );
      } else {
        await interaction.editReply(
          `The address ${address} is NOT verified on Humanity Protocol.`
        );
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      await interaction.editReply(
        "There was an error checking the verification. Please try again later."
      );
    }
  }
});

// Log in to Discord
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
