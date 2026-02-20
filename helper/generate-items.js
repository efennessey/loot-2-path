const fs = require("fs");
const path = require("path");
const roll = require("./rolls.js");

module.exports = { generateItems };

function generateItems(averageLevel, region) {
  const apl = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../loot-tables/average-party-level.json"),
    ),
  ).apl[averageLevel - 1];
  const treasure = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../loot-tables/treasure.json")),
  );

  const itemRarities = tableRoll(
    roll.rollValue("1d100"),
    treasure.items,
  ).rarity;

  let mundane = [],
    minor = [],
    medium = [],
    major = [];

  for (let i = 0; i < itemRarities.length; i++) {
    if (itemRarities[i] == "mundane") {
      mundane = rollMundaneItems(roll.tableRoll(apl.mundane), region);
    } else if (itemRarities[i] == "minor") {
      minor = rollMinorItems(roll.tableRoll(apl.minor));
    } else if (itemRarities[i] == "medium") {
      medium = rollMediumItems(roll.tableRoll(apl.medium));
    } else if (itemRarities[i] == "major") {
      major = rollMajorItems(roll.tableRoll(apl.major));
    }
  }

  return [...mundane, ...minor, ...medium, ...major];
}

function rollMundaneItems(numItems, region) {

}