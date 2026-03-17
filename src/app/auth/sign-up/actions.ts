"use server";

export async function verifyRegistrationCode(
  code: string
): Promise<{ valid: boolean }> {
  const expected = process.env.REGISTRATION_CODE;
  if (!expected) {
    return { valid: false };
  }
  return { valid: code === expected };
}
