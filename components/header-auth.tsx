import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { WandSparkles } from "lucide-react";

export default async function AuthButton() {
  return (
    <div className="flex gap-2">
      <SignedOut>
        <Link
          href={"/sign-in"}
          className="flex items-center px-3 gap-2 hover:bg-accent rounded-md"
        >
          Sign In
        </Link>
        <Link
          href={"/sign-up"}
          className="flex items-center px-3 gap-2 hover:bg-accent rounded-md"
        >
          Sign Up
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href={"/studio"}
          className="flex items-center px-3 gap-2 bg-accent hover:bg-primary rounded-md"
        >
          <WandSparkles className="w-4" />
          Studio
        </Link>
        <UserButton />
      </SignedIn>
      <ThemeSwitcher />
    </div>
  );
}
