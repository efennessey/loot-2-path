const { SlashCommandBuilder } = require("discord.js");
const roll = require("../../helper/rolls.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls dice")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("e.g. '2d6+7' or '1d20' or '3d8+12d10'"),
    ),
  async execute(interaction) {
    const input = interaction.options.getString("input");
    await interaction.reply({
      content: `Rolled ${input} and got ${roll.rollValue(input)}`,
    });
  }
};
