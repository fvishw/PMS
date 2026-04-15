import Api from "@/api/api";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription as UiCardDescription,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  IconBriefcase,
  IconCalendarEvent,
  IconEye,
  IconEyeClosed,
  IconKey,
  IconMail,
  IconPhone,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useState } from "react";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getInitials(name?: string) {
  if (!name) return "NA";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatRole(role?: string) {
  if (!role) return "Unknown";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function ProfileField({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-4">
      <div className="rounded-md bg-muted p-2 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Profile() {
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => Api.getUserProfile(),
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const { mutate: changePassword, isPending: isChangingPassword } =
    useMutation({
      mutationFn: ({
        oldPassword,
        newPassword,
      }: {
        oldPassword: string;
        newPassword: string;
      }) => Api.changePassword(oldPassword, newPassword),
      onSuccess: () => {
        toast.success("Password changed successfully", {
          position: "top-right",
        });
        reset();
      },
      onError: (mutationError) => {
        toast.error(mutationError.message, {
          position: "top-right",
        });
      },
    });

  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return <ApiErrorMessage message={error.message} />;
  }

  if (!user) {
    return <ApiErrorMessage message="Profile data not available." />;
  }

  const role = formatRole(user?.role);
  const designation = user?.designation?.title || "Not assigned";
  const joiningDate = user?.joiningDate
    ? dayjs(user.joiningDate).format("D MMM YYYY")
    : "Not available";

  const onSubmit = (formData: ChangePasswordFormValues) => {
    changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="w-full space-y-4">
      <Card className="mx-auto w-full max-w-5xl overflow-hidden p-0">
        <CardHeader className="border-b bg-gradient-to-r from-muted/70 to-background px-6 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20 border-2 border-background shadow-sm">
                <AvatarImage alt={user?.fullName || "User"} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  {user?.fullName || "-"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <IconMail size={14} />
                  {user?.email || "-"}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="secondary">{role}</Badge>
                  <Badge variant="outline">{designation}</Badge>
                </div>
              </div>
            </div>
            <CardAction className="col-start-auto row-span-1 row-start-auto self-auto justify-self-auto md:self-start">
              <div className="rounded-lg border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                Account Profile
              </div>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground">
              Personal Information
            </p>
            <ProfileField
              icon={<IconUser size={16} />}
              title="Full Name"
              value={user?.fullName || "-"}
            />
            <ProfileField
              icon={<IconMail size={16} />}
              title="Email"
              value={user?.email || "-"}
            />
            <ProfileField
              icon={<IconPhone size={16} />}
              title="Phone Number"
              value={user?.phoneNumber || "Not available"}
            />
            <ProfileField
              icon={<IconShieldCheck size={16} />}
              title="Role"
              value={role}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground">
              Organization Information
            </p>
            <ProfileField
              icon={<IconBriefcase size={16} />}
              title="Designation"
              value={designation}
            />
            <ProfileField
              icon={<IconCalendarEvent size={16} />}
              title="Joining Date"
              value={joiningDate}
            />
            <ProfileField
              icon={<IconUsersGroup size={16} />}
              title="Parent Reviewer"
              value={user?.parentReviewer?.fullName || "Not assigned"}
            />
            <ProfileField
              icon={<IconRosetteDiscountCheck size={16} />}
              title="Admin Reviewer"
              value={user?.adminReviewer?.fullName || "Not assigned"}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconKey size={18} />
            Change Password
          </CardTitle>
          <UiCardDescription>
            Update your password by entering your current password and a new
            one.
          </UiCardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Field>
              <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={isOldPasswordVisible ? "text" : "password"}
                  {...register("oldPassword", {
                    required: "Current password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() =>
                    setIsOldPasswordVisible((previous) => !previous)
                  }
                  aria-label={
                    isOldPasswordVisible
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {isOldPasswordVisible ? (
                    <IconEye size={18} />
                  ) : (
                    <IconEyeClosed size={18} />
                  )}
                </button>
              </div>
              <FieldError errors={[errors.oldPassword]} />
            </Field>

            <div className="hidden md:block" />

            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={isNewPasswordVisible ? "text" : "password"}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "New password must be at least 8 characters long",
                    },
                    validate: (value) =>
                      value !== watch("oldPassword") ||
                      "New password must be different from your current password",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() =>
                    setIsNewPasswordVisible((previous) => !previous)
                  }
                  aria-label={
                    isNewPasswordVisible
                      ? "Hide new password"
                      : "Show new password"
                  }
                >
                  {isNewPasswordVisible ? (
                    <IconEye size={18} />
                  ) : (
                    <IconEyeClosed size={18} />
                  )}
                </button>
              </div>
              <FieldError errors={[errors.newPassword]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPasswordValue || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() =>
                    setIsConfirmPasswordVisible((previous) => !previous)
                  }
                  aria-label={
                    isConfirmPasswordVisible
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {isConfirmPasswordVisible ? (
                    <IconEye size={18} />
                  ) : (
                    <IconEyeClosed size={18} />
                  )}
                </button>
              </div>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <div className="md:col-span-2">
              <FieldGroup className="gap-3">
                <FieldDescription>
                  Use at least 8 characters for your new password.
                </FieldDescription>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <Spinner className="size-4" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </FieldGroup>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
