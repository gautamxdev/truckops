/** Digits-only E.164 for wa.me / tel deep links (Indian mobiles stored as +91 …). */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D+/g, '')
}

/** tel: link for a stored phone number, or null when it has no digits. */
export function telHref(phone: string | undefined): string | null {
  const digits = phone ? phoneDigits(phone) : ''
  return digits ? `tel:+${digits}` : null
}
