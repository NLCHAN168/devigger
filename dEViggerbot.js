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
      try {
        const baseUrl =
          "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&";
        const endUrl = "DevigMethod=4&Args=ev_p,fo_o,kelly,dm";
        let queryString = baseUrl + generate(builder(...list)) + endUrl;
        await fetch(queryString)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            if (data.Final.FairValue_Odds > 0) {
              data.Final.FairValue_Odds =
                "+" + Math.round(data.Final.FairValue_Odds);
            }
            embed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle(`${market}` + " " + `${finalodds}`)
              .addFields(
                {
                  name: "\t",
                  value: "\t",
                },
                {
                  name:
                    "EV: " + (data.Final.EV_Percentage * 100).toFixed(2) + "%",
                  value: " ",
                  inline: true,
                },
                {
                  name: "QK: " + (data.Final.Kelly_Full / 4).toFixed(2),
                  value: " ",
                  inline: true,
                },
                {
                  name: "\t",
                  value: "\t",
                },
                {
                  name: "FV: " + data.Final.FairValue_Odds,
                  value: " ",
                  inline: true,
                },
                {
                  name: "WIN: " + (data.Final.FairValue * 100).toFixed(2) + "%",
                  value: " ",
                  inline: true,
                }
              );
            for (let key in data) {
              if (key.startsWith("Leg")) {
                let fairvalueodds;
                if (data[key].FairValue > 0.5) {
                  fairvalueodds =
                    (-2 + (1 - data[key].FairValue) / data[key].FairValue) *
                    100;
                } else {
                  fairvalueodds =
                    ((1 - data[key].FairValue) / data[key].FairValue) * 100;
                }
                embed.addFields(
                  {
                    name: key,
                    value: " ",
                    inline: false,
                  },
                  {
                    name: "Odds: " + data[key].Odds,
                    value: " ",
                    inline: true,
                  },
                  {
                    name: "Fair Value Odds: " + Math.round(fairvalueodds),
                    value: " ",
                    inline: true,
                  }
                );
                console.log("added field");
              }
            }
            embed.addFields({
              name: "Devig book: " + `${devigbook}`,
              value: " ",
              inline: false,
            });
          });
        interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        interaction.editReply("An error occurred");
      }
    }
  }
});
