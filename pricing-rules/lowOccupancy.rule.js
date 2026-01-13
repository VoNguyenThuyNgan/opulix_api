module.exports = {
  name: "Low Occupancy",
  condition: (ctx) => ctx.occupancyRate <= 0.3,
  apply: (price) => price * 0.9,
};
