/** Formats recognized Peruvian mobile numbers for display only. */
export function formatPeruvianPhone(value?: string | null): string {
  if (!value || !value.trim()) return "";

  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return value;

  const digits = trimmed.replace(/[\s()-]/g, "").replace(/^\+/, "");
  const match = /^(?:51)?(9\d{2})(\d{3})(\d{3})$/.exec(digits);

  return match ? `+51 ${match[1]} ${match[2]} ${match[3]}` : value;
}
