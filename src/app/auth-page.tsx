"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const AuthPage = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const empId = form.loginId.value;
    const password = form.loginPassword.value;

    if (!empId || !password) {
      setErrorMessage("Please enter both ID and password");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error logging in");
      }

      console.log("Login successful", data);
      setIsError(false);
      form.reset();

      router.push("/welcome");
    } catch (error: any) {
      setErrorMessage(error.message || "Error logging in");
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Image
            src="https://sevendaysinn.co.ke/wp-content/uploads/2024/10/7di-2-180x78.png"
            alt="Company Logo"
            width={180}
            height={78}
            layout="responsive"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Log in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginId">Employee ID</Label>
                  <Input id="loginId" name="loginId" type="text" placeholder="Enter your 6-digit ID" maxLength={6} pattern="\d{6}" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input id="loginPassword" name="loginPassword" type="password" placeholder="Enter your password" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            </form>

            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
