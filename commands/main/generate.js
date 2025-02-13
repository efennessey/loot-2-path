const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const roll = require('./roll-dice.js');

const data = new SlashCommandBuilder()
    .setName('generate-loot')
    .setDescription('Generates loot for a Pathfinder party based on number of players and average party level')
    .addIntegerOption(option =>
        option.setName('player-characters')
            .setDescription('Number of Player Characters in the party')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(20))
    .addIntegerOption(option =>
        option.setName('average-party-level')
            .setDescription('Average Party Level')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(20))
    .addBooleanOption(option =>
        option.setName('private')
            .setDescription('Are the results visible to others? (default is true)'));


module.exports = {
	data: data,
	async execute(interaction) {
        const playerCount = interaction.options.getInteger('player-characters');
        const averageLevel = interaction.options.getInteger('average-party-level');
        const ephemeral = interaction.options.getBoolean('private');

		await interaction.reply({content: `Player count: ${playerCount}, Average level: ${averageLevel}, Output: "${generateWealth(playerCount,averageLevel)}"`, ephemeral: ephemeral});
	},
};

//T=(PW-(G+A))+G+A+M
function generateWealth(playerCount,averageLevel) {
    const apl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../loot-tables/average-party-level.json'))).apl;
    //return roll.rollValue('2d4');
    //const totalGoldGemsArtValue = determineWealthValue();
    const gemsQuantity = roll.rollValue(apl[averageLevel-1].gems);
    //const gold = 1;
    return `apl - ${apl[averageLevel-1].apl}, gold - ${apl[averageLevel-1].gold}, gems - ${roll.rollValue(apl[averageLevel-1].gems)}`;
}