import { Spinner } from "@/components/ui/spinner";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  console.log(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL);
  return <SignUp fallback={<Spinner />} />;
}
