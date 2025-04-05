// import { Sidebar } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

const StudioLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = true;
  if (!user) {
    return redirect("/sign-in");
  }

  return children;
};

export default StudioLayout;
