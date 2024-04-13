import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";
config();

const botID = "1215566926806523924";
const serverID = "706188887814438972";
const TOKEN = process.env.DISCORD_TOKEN;

const rest = new REST().setToken(TOKEN);
const slashRegister = async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(botID, serverID), {
      body: [
        new SlashCommandBuilder()
          .setName("devig")
          .setDescription("Devig using LegOdds and FinalOdds")
          .addStringOption((option) =>
            option
              .setName("market")
              .setDescription("market name")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("legodds")
              .setDescription("format: +100/-110, +200/-300")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("finalodds")
              .setDescription("format: +2301")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("devigbook")
              .setDescription("devigged to:")
              .setRequired(false)
          ),
        new SlashCommandBuilder()
          .setName("golflist")
          .setDescription("populate golf list (PGA/Euro/KFT/opp/alt)")
          .addStringOption((option) =>
            option.setName("tour").setDescription("tour name").setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("market")
              .setDescription(
                "market name: win/top_5/top_10/top_20/mc/make_cut/frl"
              )
              .setRequired(true)
          ),
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

slashRegister();
