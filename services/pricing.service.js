exports.calculateDynamicPrice = ({
  basePrice,
  occupancy,
  daysToCheckin,
  season = "NORMAL",
}) => {
  let price = basePrice;

  // season
  if (season === "HIGH") price *= 1.3;
  if (season === "LOW") price *= 0.9;

  // occupancy
  if (occupancy > 0.7) price *= 1.2;
  else if (occupancy < 0.3) price *= 0.9;

  // time
  if (daysToCheckin < 7) price *= 1.25;
  else if (daysToCheckin < 14) price *= 1.1;

  return Math.round(price);
};
