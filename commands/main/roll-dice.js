const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls dice')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('e.g. \'2d6+7\' or \'1d20\' or \'3d8+12d10\'')),
	async execute(interaction) {
        const input = interaction.options.getString('input');
		await interaction.reply({content: `Rolled ${input} and got ${rollValue(input)}`});
	},
    rollValue,
};

// take an input value and roll the results (if a dice roll) - 
// e.g. "1d20" or "2d6+4" or "27" or "3d6+2d10" or "2d4x10" (performed SEQUENTIALLY)
function rollValue(input) {
    let diceString = input.replace(/\s/g,'').replace(/x/g,'*');
    let prevOperator = '+';
    let operatorPosition, nextOperator;
    let totalVal = 0;
    console.log(`rollValue: Rolling ${diceString}`);

    while (prevOperator) {
        console.log(`Current total is ${totalVal}`);
        [nextOperator,operatorPosition] = findNextOp(diceString);
        if (prevOperator == '+') {
            console.log(`adding next value`);
            totalVal += rollSingleValue(diceString.slice(0,operatorPosition));
        } else if (prevOperator == '*') {
            console.log(`multiplying by next value`);
            totalVal = totalVal * rollSingleValue(diceString.slice(0,operatorPosition));
        };
        diceString = diceString.slice(operatorPosition+1);
        prevOperator = nextOperator;
    }
    console.log(`Final value: ${totalVal}`);
    console.log(`----------------------`);
    return totalVal;
}

// find the next operator (+ or *) in a string. return [operator, position in string]
function findNextOp(diceString) {
    const multPosition = diceString.indexOf('*');
    const plusPosition = diceString.indexOf('+');
    if (plusPosition < 0) {
        if (multPosition < 0) {
            return ['', diceString.length];
        } else {
            return ['*', multPosition];
        }
    } else if (multPosition < 0) {
        return ['+', plusPosition];
    } else if (plusPosition < multPosition) {
        return ['+', plusPosition];
    } else {
        return ['*', multPosition];
    }
}

//validate and roll a single value (e.g. "2d6" or "13")
function rollSingleValue(inputVal) {
    console.log(`evaluating ${inputVal}...`);
    const dPosition = inputVal.indexOf('d');
    if (dPosition < 0) {
        if (Number.isNaN(inputVal)) throw 'invalid input';
        return Number(inputVal);
    } else {
        const totalDice = inputVal.slice(0, dPosition);
        const diceSize = inputVal.slice(dPosition+1);
        if (Number.isNaN(totalDice) || Number.isNaN(diceSize)) throw 'invalid input';
        let totalVal = 0;
        let diceRoll = 0;
        for (let i = 0; i < totalDice; i++) {
            diceRoll = Math.floor(Math.random() * Number(diceSize))+1;
            totalVal += diceRoll;
            console.log(diceRoll);
        }
        console.log(`total: ${totalVal}`);
        return totalVal;
    }
}