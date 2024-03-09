import { config } from "dotenv";
import { exampleFunction, list } from "./devigger.js";
import { Client } from "discord.js";

console.log(list);
exampleFunction(list);
config();
const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildMembers"],
});
const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN).catch((e) => console.error(e));
client.on("ready", () => {
  console.log("The bot is logged in.");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "devig") {
      const market = interaction.options.getString("market");
      const legodds = interaction.options.getString("legodds");
      const finalodds = interaction.options.getString("finalodds");
      const devigbook = interactions.options.getString("devigbook");
      await interaction.reply();
    }
  }
});
