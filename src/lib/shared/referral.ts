export function generateReferralCode(phone: string) {
  return "REF" + phone.slice(-4) + Math.random().toString(36).substring(2, 6).toUpperCase();
}
