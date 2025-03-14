"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import UsersTable from "@/components/UsersTable";
import { FiLogOut } from "react-icons/fi";

const CreateUserPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const goToReports = () => {
    router.push('/reports');
  };

  const goToApp = () => {
    router.push('/welcome');
  };

  const validateUser = (formData: { name: string; empId: string; email: string; phone: string; address: string; password: string }) => {
    if (!formData.name || !formData.empId || !formData.email || !formData.phone || !formData.address || !formData.password) {
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

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    const form = e.target as HTMLFormElement;

    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      empId: (form.elements.namedItem("empId") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      if (validateUser(formData)) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error creating user");
        }

        form.reset();

        toast({
          title: "User Created",
          description: `User ${data.name} has been created successfully!`,
          status: "success",
        });

        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Error creating user");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <header className="w-full bg-gray-900 p-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-blue-500"
            onClick={goToReports}
          >
            Reports
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-blue-500"
            onClick={goToApp}
          >
            Back to app
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:text-red-500 flex items-center"
            onClick={handleLogout}
          >
            <FiLogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <div className="max-w-md w-full">
        <p>Welcome to the admin panel</p>
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
      <UsersTable />
    </div>
  );
};

export default CreateUserPage;
