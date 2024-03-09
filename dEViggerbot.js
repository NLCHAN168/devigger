import { config } from "dotenv";
import { Client, Embed, EmbedBuilder } from "discord.js";
import { generate, builder } from "./querybuilder.js";

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
      await interaction.deferReply();
      let embed;
      const market = interaction.options.getString("market");
      const legodds = interaction.options.getString("legodds");
      const finalodds = interaction.options.getString("finalodds");
      const devigbook = interaction.options.getString("devigbook");
      let list = ["LegOdds", legodds, "FinalOdds", finalodds];
      const baseUrl =
        "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
      const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";
      let queryString = baseUrl + generate(builder(...list)) + endUrl;
      await fetch(queryString)
        .then((res) => res.json())
        .then((data) => {
          embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${market}` + " " + `${finalodds}`)
            .addFields(
              {
                name: "EV: " + data.Final.EV_Percentage * 100 + "%",
                value: " ",
                inline: true,
              },
              {
                name: "QK: " + data.Final.Kelly_Full / 4,
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name: "FV " + data.Final.FairValue_Odds,
                value: " ",
                inline: true,
              },
              {
                name: "WIN: " + data.Final.FairValue * 100 + "%",
                value: " ",
                inline: true,
              },
              {
                name: "Devig book: " + `${devigbook}`,
                value: " ",
                inline: false,
              }
            );
        });
      interaction.editReply({ embeds: [embed] });
    }
  }
});
