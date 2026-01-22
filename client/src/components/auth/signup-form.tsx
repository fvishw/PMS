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
import { publicApi } from "@/api/publicApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Logo from "@/assets/nf-logo.svg";
import { ErrorMessage } from "@hookform/error-message";
import { Spinner } from "@/components/ui/spinner";
interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordShow, setIsPasswordShow] = useState<boolean>(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      publicApi.signUpUser(email, password),
    onSuccess: () => {
      toast.success("Signup successful! Please log in.", {
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

  const onSubmit = (data: SignupFormValues) => {
    mutate({ email: data.email, password: data.password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                <ErrorMessage errors={errors} name="email" />
              </Field>
              <Field>
                <Field className="grid grid-cols-1 gap-4">
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
                            message:
                              "Password must be at least 8 characters long",
                          },
                        })}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setIsPasswordShow((prev) => !prev)}
                        type="button"
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
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative ">
                      <Input
                        id="confirm-password"
                        type={isConfirmPasswordShow ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: true,
                          minLength: 8,
                          validate: (value, formValues) =>
                            value === formValues.password ||
                            "Passwords do not match",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="confirmPassword"
                        as="p"
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() =>
                          setIsConfirmPasswordShow((prev) => !prev)
                        }
                        type="button"
                        aria-label={
                          isConfirmPasswordShow
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {isConfirmPasswordShow ? (
                          <IconEye size={18} />
                        ) : (
                          <IconEyeClosed size={18} />
                        )}
                      </button>
                    </div>
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Create Account"}
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
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
