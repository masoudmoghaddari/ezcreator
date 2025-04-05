import { Spinner } from "@/components/ui/spinner";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp fallback={<Spinner />} />;
}
