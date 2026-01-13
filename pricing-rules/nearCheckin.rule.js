module.exports = {
  name: "Near Check-in",
  condition: (ctx) => ctx.daysToCheckIn <= 2,
  apply: (price) => price * 1.15,
};
