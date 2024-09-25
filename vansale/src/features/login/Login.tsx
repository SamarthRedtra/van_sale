import { SetStateAction, useEffect, useState } from "react";
import Input from "./components/Input.tsx";
import Label from "./components/Label.tsx";
import { Alert, AlertDescription, AlertTitle } from "./components/Alert.tsx";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useFrappeAuth } from "frappe-react-sdk";
import Button from "./components/Button.tsx";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../Loader/LoadingOverlay.tsx";

export default function LoginScreen() {
  const { login, currentUser, isLoading } = useFrappeAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    try {
      await login({
        username: email,
        password,
      });
      setNotification({ type: "success", message: "Login successful!" });

      navigate("/vansale");
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error.message || "Login failed. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate(-1);
    }
  }, [currentUser]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="h-full bg-gray-100 flex flex-col justify-start py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary p-2">
            <svg
              className="w-8 h-8 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mx-4">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setEmail(e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setPassword(e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>

          {notification && (
            <Alert
              variant={
                notification.type === "success" ? "default" : "destructive"
              }
              className="mt-6"
            >
              {notification.type === "success" ? (
                <CheckCircledIcon className="h-4 w-4" />
              ) : (
                <CrossCircledIcon className="h-4 w-4" />
              )}
              <AlertTitle>
                {notification.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          {/* <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign up
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
