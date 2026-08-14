import type { ProfileFieldErrors, ProfileInput } from "./types";

const NAME_MAX = 80;

export function parseProfileForm(
  formData: FormData
):
  | { ok: true; value: ProfileInput }
  | { ok: false; error: string; fieldErrors: ProfileFieldErrors } {
  const first_name = String(formData.get("first_name") ?? "").trim();
  const last_name = String(formData.get("last_name") ?? "").trim();
  const fieldErrors: ProfileFieldErrors = {};

  if (!first_name) {
    fieldErrors.first_name = "Enter your first name.";
  } else if (first_name.length > NAME_MAX) {
    fieldErrors.first_name = "Keep this to 80 characters.";
  }

  if (!last_name) {
    fieldErrors.last_name = "Enter your last name.";
  } else if (last_name.length > NAME_MAX) {
    fieldErrors.last_name = "Keep this to 80 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  return { ok: true, value: { first_name, last_name } };
}
