function generateCoupon() {
  const prefix = 'ZT-';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let coupon = prefix;

  for (let i = 0; i < 6; i++) {
    coupon += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return coupon;
}

module.exports = {
  generateCoupon,
};
