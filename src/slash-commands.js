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
          .setDescription("Calculate EV from PGA/Euro/KFT/opp/alt outrights")
          .addStringOption((option) =>
            option
              .setName("tour")
              .setDescription("tour name")
              .setRequired(true)
              .setChoices(
                { name: "PGA", value: "pga" },
                { name: "Euro", value: "euro" },
                { name: "KFT", value: "kft" },
                { name: "Opp", value: "opp" },
                { name: "Alt", value: "liv" }
              )
          )
          .addStringOption((option) =>
            option
              .setName("market")
              .setDescription(
                "market name: win/top_5/top_10/top_20/mc/make_cut/frl"
              )
              .setChoices(
                { name: "win", value: "win" },
                { name: "top 5", value: "top_5" },
                { name: "top 10", value: "top_10" },
                { name: "top 20", value: "top_20" }
              )
              .setRequired(true)
          )
          .addNumberOption((option) =>
            option.setName("ev").setDescription("EV Percentage in decimal")
          ),
        new SlashCommandBuilder()
          .setName("threeballs")
          .setDescription("Calculate EV of 3 balls")
          .addStringOption((option) =>
            option
              .setName("tour")
              .setDescription("tour name - pga, euro, opp, alt")
              .setChoices(
                { name: "PGA", value: "pga" },
                { name: "Euro", value: "euro" },
                { name: "KFT", value: "kft" },
                { name: "Alt", value: "liv" }
              )
              .setRequired(true)
          )
          .addNumberOption((option) =>
            option.setName("ev").setDescription("EV Percentage in decimal")
          ),
        new SlashCommandBuilder()
          .setName("matchups")
          .setDescription("Calculate EV of matchups")
          .addStringOption((option) =>
            option
              .setName("tour")
              .setDescription("tour name - pga, euro, opp, alt")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("market")
              .setDescription("tournament_matchups, round_matchups")
              .setRequired(true)
          )
          .addNumberOption((option) =>
            option.setName("ev").setDescription("EV Percentage in decimal")
          ),
        new SlashCommandBuilder()
          .setName("schedule")
          .setDescription(
            "Lists all golf tournaments for the year - default all"
          )
          .addStringOption((option) =>
            option
              .setName("tour")
              .setDescription("Tournament")
              .setRequired(true)
              .addChoices(
                { name: "All", value: "all" },
                { name: "PGA", value: "pga" },
                { name: "Euro", value: "euro" },
                { name: "KFT", value: "kft" },
                { name: "Alt", value: "liv" }
              )
          ),
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

slashRegister();
