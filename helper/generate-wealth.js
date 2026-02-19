const fs = require("fs");
const path = require("path");
const roll = require("./rolls.js");

module.exports = { generateWealth };

//(PW-(G+A))+G+A
function generateWealth(playerCount, averageLevel) {
  const apl = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../loot-tables/average-party-level.json"),
    ),
  ).apl[averageLevel - 1];
  const treasure = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../loot-tables/treasure.json")),
  );

  const totalWealth =
    parseFloat(apl.gold) *
    parseFloat(roll.tableRoll("1d100", treasure.percentWealth).percent);
  console.log(`total wealth ${totalWealth}`);

  const [gemQuantity, gemValue, artValue] = determineGemsAndArt(
    treasure,
    apl.gems,
  );

  const finalGold = Math.max(
    playerCount * totalWealth - gemValue - artValue,
    0,
  );

  return `${finalGold}gp, ${gemQuantity} gems worth ${gemValue}gp, art worth ${artValue}gp`;
}

function determineGemsAndArt(treasure, aplGems) {
  let gemValue = 0,
    gemQuantity = 0,
    artValue = 0;
  const result = roll.tableRoll("1d100", treasure.gemsAndArt).result;
  console.log(`gem and art result ${result}`);
  if (result == "art") {
    artValue = rollArt(treasure.gemsAndArtValue);
  } else if (result == "gems") {
    [gemQuantity, gemValue] = rollGems(aplGems, treasure.gemsAndArtValue);
  } else if (result == "gems+art") {
    [gemQuantity, gemValue] = rollGems(aplGems, treasure.gemsAndArtValue);
    artValue = rollArt(treasure.gemsAndArtValue);
  }
  return [gemQuantity, gemValue, artValue];
}

function rollArt(table) {
  return 0.3 * roll.rollValue(roll.tableRoll("1d100", table).value);
}

function rollGems(aplGems, table) {
  let gemValue = 0;
  let gemQuantity = roll.rollValue(aplGems);
  for (let i = 0; i < gemQuantity; i++) {
    gemValue += roll.rollValue(roll.tableRoll("1d100", table).value);
  }
  return [gemQuantity, gemValue];
}
