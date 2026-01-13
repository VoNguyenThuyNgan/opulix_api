module.exports = {
  name: "High Occupancy",
  condition: (ctx) => ctx.occupancyRate >= 0.7,
  apply: (price) => price * 1.2,
};
