module.exports = {
  name: "Weekend Pricing",
  condition: (ctx) => ctx.isWeekend,
  apply: (price) => price * 1.1,
};
