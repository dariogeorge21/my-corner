import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">shadcn/ui is ready 🚀</h1>
        <Button>Click me</Button>
      </div>
    </main>
  );
}