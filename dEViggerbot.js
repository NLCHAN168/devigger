import { config } from "dotenv";
import { Client, Embed, EmbedBuilder } from "discord.js";
import { generate, builder } from "./querybuilder.js";
import { outrightOdds, matchup3ballOdds, allPairings } from "./datagolf.js";
import { threeball } from "./example3ball.js";
//TODO: Check if importing arrays is necessary or redundant
import {
  pgaEv,
  pgawin,
  pgatop5,
  pgatop10,
  pgatop20,
  winev,
  top5ev,
  top10ev,
  top20ev,
} from "./dgfetcher.js";

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
        let queryString = baseUrl + generate(builder(...list)) + endUrl;
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
      await interaction.deferReply();
      let embed;
      const tour = interaction.options.getString("tour");
      const market = interaction.options.getString("market");
      let list = ["tour", tour, "market", market];
      //TODO: refactor code to populate win/top5/top10/top20 on startup
      try {
        // const baseUrl = "https://feeds.datagolf.com/betting-tools/outrights?";
        // const endUrl = `&odds_format=american&file_format=json&key=${process.env.DG_TOKEN}`;
        // const queryString = baseUrl + generate(builder(...list)) + endUrl;
        // await fetch(queryString)
        //   .then((res) => {
        //     return res.json();
        //   })
        //   .then((data) => {
        //TODO: Add embed reply for each command
        if (market === "win") {
          //output to ev array here
          embed = new EmbedBuilder().setColor(0x0099ff).setTitle(" ");
          console.log("pgawin before pgaEV call: " + pgawin);
          console.log("winev before pgaEV call: " + winev);
          pgaEv("win", pgawin, winev);
          //TODO: Fix loop (key into obj.odds correctly)
          for (let obj of winev) {
            embed.addFields({
              name:
                pgawin.event_name + " " + obj.player_name + " " + pgawin.market,
              value: " ",
            });
          }
          interaction.editReply({ embeds: [embed] });
        }
        if (market === "top5") {
          pgaEv("top5", pgatop5, top5ev);
        }
        if (market === "top10") {
          pgaEv("top10", pgatop10, top10ev);
        }
        if (market === "top20") {
          pgaEv("top20", pgatop20, top20ev);
        }
        // interaction.editReply(embed);
        // });
      } catch (e) {
        console.log(e);
        interaction.editReply("An error occurred");
      }
    }
  }
});
