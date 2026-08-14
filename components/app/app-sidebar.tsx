import { AppNav, Wordmark } from "@/components/app/app-nav";
import { UserMenu } from "@/components/app/user-menu";

type AppSidebarProps = {
  email: string | undefined;
  fullName: string;
};

export function AppSidebar({ email, fullName }: AppSidebarProps) {
  return (
    <aside className="hidden h-svh w-60 shrink-0 flex-col border-r border-asphalt/10 bg-rail text-asphalt lg:flex">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-8 px-3">
          <Wordmark />
        </div>
        <AppNav />
        <UserMenu email={email} fullName={fullName} />
      </div>
    </aside>
  );
}
