import Api from "@/api/api";
import ApiErrorMessage from "@/components/ApiErrorMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  IconBriefcase,
  IconCalendarEvent,
  IconMail,
  IconPhone,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import dayjs from "dayjs";

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => Api.getUserProfile(),
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
    </div>
  );
}

export default Profile;
