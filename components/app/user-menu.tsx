import { Button } from "@/components/ui/button";

type UserMenuProps = {
  email: string | undefined;
  displayName: string;
};

export function UserMenu({ email, displayName }: UserMenuProps) {
  return (
    <div className="border-t border-asphalt/10 pt-4">
      <p className="font-display px-3 text-xs font-bold tracking-[0.16em] text-asphalt/45 uppercase">
        Signed in
      </p>
      <p className="mt-1 truncate px-3 text-sm font-medium text-asphalt">
        {displayName}
      </p>
      {email && displayName !== email ? (
        <p className="mt-0.5 truncate px-3 text-xs text-asphalt/55">{email}</p>
      ) : null}
      <form action="/auth/signout" method="post" className="mt-3 px-1">
        <Button
          type="submit"
          variant="outline"
          className="font-display h-10 w-full rounded-none border-asphalt/20 bg-transparent text-xs font-bold tracking-[0.12em] text-asphalt uppercase hover:bg-asphalt hover:text-rail"
        >
          Log out
        </Button>
      </form>
    </div>
  );
}
