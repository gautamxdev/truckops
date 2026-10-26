/** Digits-only E.164 for wa.me / tel deep links (Indian mobiles stored as +91 …). */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D+/g, '')
}

/**
 * Digits with the India country code, so numbers saved as "98220 11455" or
 * "098220 11455" still dial and open WhatsApp correctly. Anything else is left as typed.
 */
export function indianE164Digits(phone: string): string {
  const digits = phoneDigits(phone)
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`
  if (/^0[6-9]\d{9}$/.test(digits)) return `91${digits.slice(1)}`
  return digits
}

/** tel: link for a stored phone number, or null when it has no digits. */
export function telHref(phone: string | undefined): string | null {
  const digits = phone ? indianE164Digits(phone) : ''
  return digits ? `tel:+${digits}` : null
}

/** WhatsApp chat link for a stored phone number, or null when it has no digits. */
export function whatsappHref(phone: string | undefined): string | null {
  const digits = phone ? indianE164Digits(phone) : ''
  return digits ? `https://wa.me/${digits}` : null
}
