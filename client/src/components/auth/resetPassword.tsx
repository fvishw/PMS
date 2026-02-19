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
import { Link, useLocation, useNavigate } from "react-router";
import { publicApi } from "@/api/publicApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Logo from "@/assets/nf-logo.svg";
import { ErrorMessage } from "@hookform/error-message";
import { Spinner } from "@/components/ui/spinner";
interface ResetFormValues {
  password: string;
  repeatPassword: string;
}

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] =
    useState<boolean>(false);
  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const {
    handleSubmit,
    reset,
    register,
    watch,
    setError,
    formState: { errors },
  } = useForm<ResetFormValues>({
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      publicApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successful. Please log in.", {
        position: "top-right",
      });
      reset();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: (resetToken: string) => publicApi.verifyPasswordResetToken(resetToken),
    onSuccess: () => {
      setIsTokenVerified(true);
      setTokenError("");
    },
    onError: (error) => {
      setIsTokenVerified(false);
      setTokenError(error.message || "Invalid or expired reset link.");
    },
    onSettled: () => {
      setIsVerifyingToken(false);
    },
  });

  useEffect(() => {
    if (!token) {
      setIsVerifyingToken(false);
      setIsTokenVerified(false);
      setTokenError("Reset token is missing.");
      return;
    }
    verifyTokenMutation.mutate(token);
  }, [token]);

  const onSubmit = (data: ResetFormValues) => {
    if (data.password !== data.repeatPassword) {
      setError("repeatPassword", {
        type: "validate",
        message: "Passwords do not match",
      });
      return;
    }
    if (!token) {
      toast.error("Reset token is missing.", {
        position: "top-right",
      });
      return;
    }
    mutate({ token, password: data.password });
  };

  if (isVerifyingToken) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-6 place-items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              Verifying reset link...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTokenVerified) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-6">
            <FieldGroup className="items-center text-center">
              <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
              <FieldDescription>{tokenError || "Invalid or expired reset link."}</FieldDescription>
              <Button asChild>
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passwordValue = watch("password");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Set New Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password and confirm it.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordShow ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setIsPasswordShow((prev) => !prev)}
                    type="button"
                    aria-label={isPasswordShow ? "Hide password" : "Show password"}
                  >
                    {isPasswordShow ? <IconEye size={18} /> : <IconEyeClosed size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <p className="text-sm text-red-600">{message}</p>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="repeatPassword">Repeat Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="repeatPassword"
                    type={isConfirmPasswordShow ? "text" : "password"}
                    {...register("repeatPassword", {
                      required: "Please repeat your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setIsConfirmPasswordShow((prev) => !prev)}
                    type="button"
                    aria-label={
                      isConfirmPasswordShow ? "Hide repeated password" : "Show repeated password"
                    }
                  >
                    {isConfirmPasswordShow ? <IconEye size={18} /> : <IconEyeClosed size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="repeatPassword"
                  render={({ message }) => (
                    <p className="text-sm text-red-600">{message}</p>
                  )}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner className="size-4" /> : "Reset Password"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={Logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-contains  "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
