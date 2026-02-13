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
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/api/publicApi";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Logo from "@/assets/nf-logo.svg";

interface ResetPasswordFormValues {
  email: string;
}

export function SendRestPasswordEmail({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: ResetPasswordFormValues) =>
      publicApi.forgotPassword(email),
    onSuccess: () => {
      toast.success("Reset link sent successfully!", {
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to send reset link. Please try again.",
        {
          position: "top-right",
        },
      );
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
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your work email and we&apos;ll send a reset link.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="v@nexforge.tech"
                  {...register("email", { required: "Email is required" })}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <p className="text-sm text-red-600">{message}</p>
                  )}
                />
              </Field>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner className="size-4" /> : "Send Reset Link"}
              </Button>

              <FieldDescription className="text-center">
                Remember your password? <Link to="/">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={Logo}
              alt="NexForge logo"
              className="absolute inset-0 h-full w-full object-contain"
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
