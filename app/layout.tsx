import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ez Creator",
  description: "Ai powered idea generator for content creators",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {user ? (
            children
          ) : (
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full flex justify-between items-center px-10 py-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={"/"}>EzCreator</Link>
                    </div>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </nav>
                <div className="flex flex-col gap-20 p-5">{children}</div>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  FOOTER FOOTER
                </footer>
              </div>
            </main>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
