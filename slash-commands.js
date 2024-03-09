import { REST, Routes } from "discord.js";
import { config } from "dotenv";
config();

const botID = "1215566926806523924";
const serverID = "752730590658428938";
const TOKEN = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(TOKEN);
const slashRegister = async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(botID, serverID), {
      body: [
        {
          name: "devig",
          description: "Devig using LegOdds, FinalOdds",
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

slashRegister();
