const fs = require("fs");
const path = require("path");
const roll = require("./rolls.js");

module.exports = { generateItems };

function determineItems(averageLevel) {
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
      mundane = rollMundaneItems();
    } else if (itemRarities[i] == "minor") {
      minor = rollMinorItems();
    } else if (itemRarities[i] == "medium") {
      medium = rollMediumItems();
    } else if (itemRarities[i] == "major") {
      major = rollMajorItems();
    }
  }

  return [...mundane, ...minor, ...medium, ...major];
}