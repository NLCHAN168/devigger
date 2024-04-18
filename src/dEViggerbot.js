import { config } from "dotenv";
import { Client, Embed, EmbedBuilder } from "discord.js";
import { generateDeviggerUrl, arrayToObjectBuilder } from "./querybuilder.js";
import { findEV } from "./dgfetcher.js";

//TODO: add caching data
//TODO: cache on startup, call golf command on mondays at 1:30pm est
config();
const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildMembers"],
});
const TOKEN = process.env.DISCORD_TOKEN;
client.login(TOKEN).catch((e) => console.error(e));
client.on("ready", () => {
  console.log("The bot is logged in.");
});

//populate win,top5,top10,top20 arrays on startup

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
        let queryString =
          baseUrl + generateDeviggerUrl(arrayToObjectBuilder(...list)) + endUrl;
        await fetch(queryString)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            let datalength = Object.keys(data).length;
            Math.round(data.Final.FairValue_Odds);
            if (data.Final.FairValue_Odds > 0) {
              data.Final.FairValue_Odds = "+" + data.Final.FairValue_Odds;
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
                  name: " ",
                  value:
                    "```" +
                    "EV: " +
                    (data.Final.EV_Percentage * 100).toFixed(2) +
                    "%" +
                    "```",
                  inline: true,
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "FV: " +
                    Math.round(data.Final.FairValue_Odds) +
                    "```",
                  inline: true,
                },
                {
                  name: "\t",
                  value: "\t",
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "HK: " +
                    (data.Final.Kelly_Full / 2).toFixed(2) +
                    "```",
                  inline: true,
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "QK: " +
                    (data.Final.Kelly_Full / 4).toFixed(2) +
                    "```",
                  inline: true,
                },
                {
                  name: "\t",
                  value: "\t",
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "SK: " +
                    (data.Final.Kelly_Full / 6).toFixed(2) +
                    "```",
                  inline: true,
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "EK: " +
                    (data.Final.Kelly_Full / 8).toFixed(2) +
                    "```",
                  inline: true,
                },
                {
                  name: "\t",
                  value: "\t",
                },
                {
                  name: " ",
                  value:
                    "```" +
                    "WIN: " +
                    (data.Final.FairValue * 100).toFixed(2) +
                    "%" +
                    "```",
                  inline: true,
                }
              );
            if (datalength > 2) {
              for (let key in data) {
                let fairvalueodds;
                if (key.startsWith("Leg")) {
                  if (data[key].FairValue > 0.5) {
                    fairvalueodds =
                      (-2 + (1 - data[key].FairValue) / data[key].FairValue) *
                      100;
                  } else {
                    fairvalueodds =
                      "+" +
                      Math.round(
                        ((1 - data[key].FairValue) / data[key].FairValue) * 100
                      );
                  }
                  if (data[key].Odds > 100) {
                    data[key].Odds = "+" + data[key].Odds.trim();
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
            }
            embed.addFields({
              name: "Devig book: " + `${devigbook}`,
              value: " ",
              inline: false,
            });
            interaction.editReply({ embeds: [embed] });
          });
      } catch (error) {
        console.log(error);
        interaction.editReply("An error occurred");
      }
    }
  }
});

//populate win/top5/top10/top20 array with slash command
client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "golflist") {
      let markets = [
        "win",
        "top_5",
        "top_10",
        "top_20",
        "mc",
        "make_cut",
        "frl",
      ];
      let tours = ["pga", "euro", "kft", "opp", "alt"];
      await interaction.deferReply();
      let embed;
      const tour = interaction.options.getString("tour");
      const market = interaction.options.getString("market");
      if (
        (tour.toLowerCase() === "kft" && market.toLowerCase() !== "win") ||
        "top_5"
      ) {
        interaction.editReply("No available Massachusetts lines");
      }
      if (tours.includes(tour) && markets.includes(market)) {
        let evarray = await findEV(tour, market);
        if (evarray.length === 0) {
          interaction.editReply("NO EV");
          return;
        }
        for (let i = 0; i < evarray.length; i++) {
          embed = new EmbedBuilder().setColor(0x0099ff).setTitle(" ");
          if (evarray[i].hasOwnProperty("fanduel")) {
            embed.addFields(
              {
                name: evarray[i].event_name,
                value:
                  evarray[i].player_name +
                  " " +
                  evarray[i].market +
                  " " +
                  evarray[i].fanduel +
                  " FanDuel",
              },
              {
                name:
                  "```" +
                  "EV: " +
                  Math.round(
                    evarray[i].devig.Final.EV_Percentage.toFixed(2) * 100
                  ) +
                  "%" +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "FV: " +
                  Math.round(evarray[i].devig.Final.FairValue_Odds) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "HK : " +
                  (evarray[i].devig.Final.Kelly_Full / 2).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "QK : " +
                  (evarray[i].devig.Final.Kelly_Full / 4).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "SK : " +
                  (evarray[i].devig.Final.Kelly_Full / 6).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "EK : " +
                  (evarray[i].devig.Final.Kelly_Full / 8).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "WIN: " +
                  (evarray[i].devig.Final.FairValue * 100).toFixed(2) +
                  "%" +
                  "```",
                value: " ",
                inline: true,
              }
            );
          } else {
            embed.addFields(
              {
                name: evarray[i].event_name,
                value:
                  evarray[i].player_name +
                  " " +
                  evarray[i].market +
                  " " +
                  evarray[i].draftkings +
                  " DraftKings",
              },
              {
                name:
                  "```" +
                  "EV: " +
                  Math.round(
                    evarray[i].devig.Final.EV_Percentage.toFixed(2) * 100
                  ) +
                  "%" +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "FV: " +
                  Math.round(evarray[i].devig.Final.FairValue_Odds) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "HK : " +
                  (evarray[i].devig.Final.Kelly_Full / 2).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "QK : " +
                  (evarray[i].devig.Final.Kelly_Full / 4).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "SK : " +
                  (evarray[i].devig.Final.Kelly_Full / 6).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name:
                  "```" +
                  "EK : " +
                  (evarray[i].devig.Final.Kelly_Full / 8).toFixed(2) +
                  "```",
                value: " ",
                inline: true,
              },
              {
                name: "\t",
                value: "\t",
              },
              {
                name:
                  "```" +
                  "WIN: " +
                  (evarray[i].devig.Final.FairValue * 100).toFixed(2) +
                  "%" +
                  "```",
                value: " ",
                inline: true,
              }
            );
          }
          interaction.followUp({ embeds: [embed] });
        }
      } else {
        interaction.editReply("Please enter a valid tour/market");
      }
    }
  }
});
