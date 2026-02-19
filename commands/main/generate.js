const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const roll = require("../../helper/rolls.js");
const wealth = require("../../helper/generate-wealth.js");
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
    const playerCount = interaction.options.getInteger("player-characters");
    const averageLevel = interaction.options.getInteger("average-party-level");
    const ephemeral = interaction.options.getBoolean("private");
    const region = interaction.options.getString("region");

    // inside a command, event listener, etc.
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Some title")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription("Some description here")
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true },
      )
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    //T=(PW-(G+A))+G+A+M
    await interaction.reply({
      content: `Player count: ${playerCount}
Average level: ${averageLevel}
Region: ${region}
Output: "${wealth.generateWealth(playerCount, averageLevel)}"`,
      ephemeral: ephemeral,
      embeds: [exampleEmbed],
    });
  },
};
