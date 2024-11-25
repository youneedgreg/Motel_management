"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/hooks/withauth";

const CreateUserPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const validateUser = (formData) => {
    if (
      !formData.name ||
      !formData.empId ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password
    ) {
      setErrorMessage("All fields are required");
      setIsError(true);
      return false;
    }
    if (!/^\d{6}$/.test(formData.empId)) {
      setErrorMessage("Employee ID must be exactly 6 digits");
      setIsError(true);
      return false;
    }
    if (!formData.email.includes("@")) {
      setErrorMessage("Invalid email format");
      setIsError(true);
      return false;
    }
    if (formData.phone.length < 10) {
      setErrorMessage("Invalid phone number");
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const formData = {
      name: form.name.value,
      empId: form.empId.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value,
      password: form.password.value,
    };

    if (validateUser(formData)) {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error creating user");
        }

        setIsError(false);
        form.reset();

        // Success toast
        toast({
          title: "User Created",
          description: `User ${data.name} has been created successfully!`,
          status: "success",
        });

        // Optionally redirect or refresh page
        router.push("/");
      } catch (error) {
        setErrorMessage(error.message || "Error creating user");
        setIsError(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Enter full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empId">Employee ID</Label>
                  <Input
                    id="empId"
                    name="empId"
                    type="text"
                    placeholder="6-digit ID"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="Enter phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" type="text" placeholder="Enter address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Enter password" required />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create User"}
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

export default withAuth(CreateUserPage);