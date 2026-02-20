const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const wealth = require("../../helper/generate-wealth.js");
const items = require("../../helper/generate-items.js");
const { EmbedBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("generate-loot")
  .setDescription(
    "Generates loot for a Pathfinder party based on number of players and average party level",
  )
  .addIntegerOption((option) =>
    option
      .setName("player-characters")
      .setDescription("Number of Player Characters in the party")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(20),
  )
  .addIntegerOption((option) =>
    option
      .setName("average-party-level")
      .setDescription("Average Party Level")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(20),
  )
  .addStringOption((option) =>
    option
      .setName("region")
      .setDescription(
        "Which region is this for? This may affect which items are found.",
      )
      .addChoices(
        { name: "Kinidzau (default)", value: "Kinidzau" },
        { name: "Atalan", value: "Atalan" },
        { name: "Cerell", value: "Cerell" },
        { name: "Chthorre", value: "Chthorre" },
        { name: "Desert", value: "Desert" },
        { name: "Gelmoor", value: "Gelmoor" },
        { name: "Great Fang", value: "Great Fang" },
        { name: "Highwatch", value: "Highwatch" },
        { name: "Icarian Range", value: "Icarian Range" },
        { name: "Kairese", value: "Kairese" },
        { name: "Moordune", value: "Moordune" },
        { name: "Rhyncia", value: "Rhyncia" },
        { name: "Saltopolis", value: "Saltopolis" },
        { name: "Thorn City", value: "Thorn City" },
      ),
  )
  .addBooleanOption((option) =>
    option
      .setName("private")
      .setDescription("Are the results visible to others? (default is true)"),
  );

module.exports = {
  data: data,
  async execute(interaction) {
    // arguments
    const playerCount = interaction.options.getInteger("player-characters");
    const averageLevel = interaction.options.getInteger("average-party-level");
    const ephemeral = interaction.options.getBoolean("private");
    const region = interaction.options.getString("region") || "Kinidzau";

    const titles = [
      "Look at all that loot!",
      "Don't spend it all in one place.",
      "It's dangerous to go alone! Take this.",
      "Quite.",
      "Fancy!",
      "Mister Moneybags over here.",
      "Are you gonna share that?",
    ];

    // calculated values
    let gold, gemQuantity, gemValue, artValue;
    [gold, gemQuantity, gemValue, artValue] = wealth.generateWealth(
      playerCount,
      averageLevel,
    );

    const wealthFields = []
    if (gold > 0) {wealthFields.push({name:"Gold", value:`${gold} gp`})};
    if (gemQuantity > 0) {wealthFields.push({name:"Gems", value:`${gemValue} gp (${gemQuantity} gems)`})};
    if (artValue > 0) {wealthFields.push({name:"Art", value:`${artValue} gp`})};

    //items.generateItems(averageLevel, region)

    const lootEmbed = new EmbedBuilder()
      .setColor("8b91cf")
      .setTitle(titles[Math.floor(Math.random() * titles.length)])
      //.setURL("https://discord.js.org/")
      .setAuthor({
        name: "Verst Loot Generator",
        iconURL:
          "https://cdn.pixabay.com/photo/2017/08/31/04/01/d20-2699387_960_720.png",
        // url: "https://discord.js.org",
      })
      .setDescription(
        `Generated loot for a ***party of ${playerCount}*** with an ***average level of ${averageLevel}*** in the ***${region}*** region:`,
      )
      //.setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
       // { name: "\u200B", value: "\u200B", inline: true },
        wealthFields
      )
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      //.setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp();
    //.setFooter({
    //  text: "Some footer text here",
    //  iconURL: "https://i.imgur.com/AfFp7pu.png",
    //})
    //T=(PW-(G+A))+G+A+M
    await interaction.reply({
      ephemeral: ephemeral,
      embeds: [lootEmbed],
    });
  },
};
