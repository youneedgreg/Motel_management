"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const validateSignup = (formData) => {
    if (!formData.name || !formData.empId || !formData.email || 
        !formData.phone || !formData.address || !formData.password || !formData.adminPassword) {
      setErrorMessage('All fields are required');
      setIsError(true);
      return false;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Invalid email format');
      setIsError(true);
      return false;
    }
    if (formData.phone.length < 10) {
      setErrorMessage('Invalid phone number');
      setIsError(true);
      return false;
    }
    if (formData.empId.length !== 6 || !/^\d+$/.test(formData.empId)) {
      setErrorMessage('Employee ID must be exactly 6 digits');
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
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
      adminPassword: form.adminPassword.value,
    };

    if (validateSignup(formData)) {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error signing up');
        }

        setIsError(false);
        form.reset();

        toast({
          title: "Successfully registered",
          description: "You may now proceed to log in",
          status: "success",
        });

      } catch (error) {
        setErrorMessage(error.message || 'Error signing up');
        setIsError(true);
      }
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const empId = form.loginId.value;
    const password = form.loginPassword.value;

    if (!empId || !password) {
      setErrorMessage('Please enter both ID and password');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error logging in');
      }

      // Store token in localStorage
      localStorage.setItem('authToken', data.token);

      setIsError(false);
      form.reset();

      // Redirect to the welcome page
      router.push('/welcome');

    } catch (error) {
      setErrorMessage(error.message || 'Error logging in');
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <img
            src="https://sevendaysinn.co.ke/wp-content/uploads/2024/10/7di-2-180x78.png"
            alt="Company Logo"
            className="h-12 w-auto"
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or create a new account</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="border border-white text-white hover:bg-white hover:text-gray-800 transition-colors duration-200">Login</TabsTrigger>
                <TabsTrigger value="signup" className="border border-white text-white hover:bg-white hover:text-gray-800 transition-colors duration-200">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
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
                    <Button type="submit" className="w-full border border-white text-white hover:bg-white hover:text-gray-800 transition-colors duration-200" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    {/* Signup fields here */}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            
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
