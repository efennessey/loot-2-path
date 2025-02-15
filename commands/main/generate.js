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
    const apl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../loot-tables/average-party-level.json'))).apl[averageLevel-1];
    const treasure = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../loot-tables/treasure.json')));

    const totalWealth = parseFloat(apl.gold) * parseFloat(tableRoll(roll.rollValue('1d100'),treasure.percentWealth).percent);
    console.log(`total wealth ${totalWealth}`);
    const [gemQuantity,gemValue,artValue] = determineGemsAndArt(treasure,apl.gems);
    const finalWealth = Math.max(playerCount*totalWealth-gemValue-artValue,0);

    return `${finalWealth}gp, ${gemQuantity} gems worth ${gemValue}gp, art worth ${artValue}gp`;
};

// return the applicable JSON row for a roll on a table
function tableRoll(rollResult,tableArray) {
    for (let i = 0; i < tableArray.length; i++) {
        if (rollResult <= tableArray[i].maxRoll)
            return tableArray[i];
    };
};

function determineGemsAndArt(treasure, aplGems) {
    let gemValue = 0
      , gemQuantity = 0
      , artValue = 0;
    const result = tableRoll(roll.rollValue('1d100'),treasure.gemsAndArt).result;
    console.log(`gem and art result ${result}`);
    if (result == 'art') {
        artValue = rollArt(treasure.gemsAndArtValue);
    } else if (result == 'gems') {
        [gemQuantity,gemValue] = rollGems(aplGems,treasure.gemsAndArtValue);
    } else if (result == 'gems+art') {
        [gemQuantity,gemValue] = rollGems(aplGems,treasure.gemsAndArtValue);
        artValue = rollArt(treasure.gemsAndArtValue);
    };
    return [gemQuantity,gemValue,artValue];
};

function rollArt(table) {
    return 0.3 * roll.rollValue(tableRoll(roll.rollValue('1d100'),table).value);
};

function rollGems(aplGems,table) {
    let gemValue = 0;
    let gemQuantity = roll.rollValue(aplGems);
    for (let i = 0; i < gemQuantity; i++) {
        gemValue += roll.rollValue(tableRoll(roll.rollValue('1d100'),table).value);
    };
    return [gemQuantity,gemValue];
};