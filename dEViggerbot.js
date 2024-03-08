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
