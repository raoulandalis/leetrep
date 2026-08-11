import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">LeetRep</h1>
        <p className="text-muted-foreground">Remember what you solve.</p>
      </div>
      <LoginForm />
    </main>
  );
}
