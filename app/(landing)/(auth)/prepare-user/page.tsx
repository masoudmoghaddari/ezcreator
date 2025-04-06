"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { syncUserToDatabase } from "./syncUserToDatabase";

export default function AccountSetupPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState("syncing"); // 'syncing', 'success', 'error'
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupUserAccount() {
      if (!isLoaded || !user) return;

      try {
        // Get user data from Clerk
        const userId = user.id;
        const email = user.primaryEmailAddress?.emailAddress || "";
        const firstName = user.firstName || undefined;
        const lastName = user.lastName || undefined;

        // Sync user to database
        const result = await syncUserToDatabase(
          userId,
          email,
          firstName,
          lastName
        );

        if (result.success) {
          setStatus("success");
          // Redirect to studio after a short delay to show success message
          setTimeout(() => {
            router.push("/studio");
          }, 1500);
        } else {
          setStatus("error");
          setError("Failed to set up your account. Please try again.");
        }
      } catch (err) {
        console.error("Error in account setup:", err);
        setStatus("error");
        setError("An unexpected error occurred. Please try again.");
      }
    }

    setupUserAccount();
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <LoadingState message="Loading your information..." />;
  }

  if (status === "error") {
    return <ErrorState message={error || "Something went wrong"} />;
  }

  if (status === "success") {
    return <SuccessState />;
  }

  return <LoadingState message="Setting up your account..." />;
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Setting up your account</CardTitle>
          <CardDescription>
            We're getting everything ready for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p>{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Account Ready!</CardTitle>
          <CardDescription>
            Your account has been successfully set up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <p className="text-muted-foreground">
            Redirecting you to the studio...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Setup Failed</CardTitle>
          <CardDescription>
            We encountered an issue setting up your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <p className="text-muted-foreground">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mx-auto mt-4 rounded-md bg-primary px-4 py-2 text-white"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
