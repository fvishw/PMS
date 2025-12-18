import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { publicApi } from "@/api/publicApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      publicApi.signUpUser(email, password),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Signup successful! Please log in.", {
        position: "top-right",
      });
      // Handle successful signup (e.g., redirect to login or dashboard)
    },
    onError: (error) => {
      console.log("error", error.message);
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup className="">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="v@nexforge.tech"
                  required
                  name="email"
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-1 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={isPasswordShow ? "text" : "password"}
                        required
                        name="password"
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setIsPasswordShow((prev) => !prev)}
                      >
                        {isPasswordShow ? (
                          <IconEye size={18} />
                        ) : (
                          <IconEyeClosed size={18} />
                        )}
                      </span>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={isConfirmPasswordShow ? "text" : "password"}
                        required
                        name="confirmPassword"
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() =>
                          setIsConfirmPasswordShow((prev) => !prev)
                        }
                      >
                        {isConfirmPasswordShow ? (
                          <IconEye size={18} />
                        ) : (
                          <IconEyeClosed size={18} />
                        )}
                      </span>
                    </div>
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
