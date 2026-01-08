const { calculateDynamicPrice } = require("../services/pricing.service");

describe("Dynamic Pricing Algorithm", () => {
  test("Low occupancy → price decreases", () => {
    const price = calculateDynamicPrice({
      basePrice: 200,
      occupancy: 0.2,
      daysToCheckin: 10,
    });

    expect(price).toBeLessThan(200);
  });

  test("High occupancy → price increases", () => {
    const price = calculateDynamicPrice({
      basePrice: 200,
      occupancy: 0.85,
      daysToCheckin: 5,
    });

    expect(price).toBeGreaterThan(200);
  });

  test("Last-minute booking → price surge", () => {
    const price = calculateDynamicPrice({
      basePrice: 200,
      occupancy: 0.5,
      daysToCheckin: 1,
    });

    expect(price).toBeGreaterThan(200);
  });
});
