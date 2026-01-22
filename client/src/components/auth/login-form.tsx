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
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/api/publicApi";
import { useAuth } from "@/hooks/useAuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: LoginFormValues) =>
      publicApi.signInUser(email, password),
    onSuccess: (data) => {
      toast.success("Login successful!", {
        position: "top-right",
      });
      const accessToken = data.accessToken;
      const user = data.user;
      login(accessToken, user);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.", {
        position: "top-right",
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your NexForge account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="v@nexforge.tech"
                  {...register("email", { required: "Email is required" })}
                />
                <ErrorMessage errors={errors} name="email" as="p" />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordShow ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setIsPasswordShow((prev) => !prev)}
                    aria-label={
                      isPasswordShow ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordShow ? (
                      <IconEye size={18} />
                    ) : (
                      <IconEyeClosed size={18} />
                    )}
                  </button>
                  <ErrorMessage errors={errors} name="password" as="p" />
                </div>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
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
