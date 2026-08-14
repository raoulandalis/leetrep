export type Profile = {
  first_name: string | null;
  last_name: string | null;
};

export type ProfileInput = {
  first_name: string;
  last_name: string;
};

export type ProfileFieldErrors = Partial<
  Record<keyof ProfileInput | "form", string>
>;

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ProfileFieldErrors };
