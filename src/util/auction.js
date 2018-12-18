import { utils } from "web3";

// This function expect BN as input parameters
// https://github.com/indutny/bn.js/
export function calculateCurrentPrice(startPrice, endPrice, startDate, duration, currentDate) {
  if (currentDate === undefined) {
    const now = new Date();
    currentDate = new utils.BN(now.getTime() / 1000);
  }
  if (startPrice.eq(endPrice)) {
    return startPrice;
  }
  if (currentDate.gte(startDate.add(duration))) {
    return endPrice;
  }
  const elapsedTime = currentDate.sub(startDate);
  const priceDiff = endPrice.sub(startPrice);
  const t1 = priceDiff.mul(elapsedTime);
  const t2 = t1.div(duration);
  return startPrice.add(t2);
}
