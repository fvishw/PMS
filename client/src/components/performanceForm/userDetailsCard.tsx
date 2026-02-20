import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { IconMail, IconUsersGroup } from "@tabler/icons-react";

type PerformanceUser =
  | string
  | {
      _id: string;
      fullName?: string;
      email?: string;
      role?: string;
      designation?: {
        _id: string;
        title: string;
        role?: string;
      } | null;
    };

interface UserDetailsCardProps {
  user?: PerformanceUser | null;
  stage?: string;
  parentReviewer?:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
      }
    | null;
  adminReviewer?:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
      }
    | null;
}

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatRole = (role?: string) => {
  if (!role) return "Unknown";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatStage = (stage?: string) => {
  if (!stage) return "Unknown";
  return stage
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getReviewer = (
  reviewer?: string | { _id: string; fullName?: string; email?: string } | null,
) => {
  if (!reviewer || typeof reviewer === "string") return null;
  return reviewer;
};

export const UserDetailsCard = ({
  user,
  stage,
  parentReviewer,
  adminReviewer,
}: UserDetailsCardProps) => {
  if (!user || typeof user === "string") {
    return null;
  }

  const manager = getReviewer(parentReviewer);
  const admin = getReviewer(adminReviewer);

  return (
    <Card className="border-muted/70 bg-card/80">
      <CardContent className="space-y-3 pt-0">
        <CardTitle className="text-sm">Review Context</CardTitle>
        <div className="flex items-center gap-2.5 rounded-md border bg-muted/30 p-4">
          <Avatar className="size-9 border bg-background">
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">
                {user.fullName || "-"}
              </p>
              <Badge variant="secondary" className="shrink-0">
                {formatStage(stage)}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{formatRole(user.role)}</Badge>
              <Badge variant="outline" className="max-w-full truncate">
                {user.designation?.title || "No designation"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-xs md:grid-cols-3 ">
          <div className="rounded-md border bg-background p-4">
            <p className="mb-1 flex items-center gap-1.5 font-medium uppercase tracking-wide text-muted-foreground">
              <IconMail size={14} /> Employee Email
            </p>
            <p className="break-words text-sm font-medium">
              {user.email || "-"}
            </p>
          </div>

          <div className="rounded-md border bg-background p-4">
            <p className="mb-1 flex items-center gap-1.5 font-medium uppercase tracking-wide text-muted-foreground">
              <IconUsersGroup size={14} /> Manager Reviewer
            </p>
            <p className="text-sm font-medium">
              {manager?.fullName || "Not assigned"}
            </p>
            <p className="text-muted-foreground">{manager?.email || "-"}</p>
          </div>

          <div className="rounded-md border bg-background p-4">
            <p className="mb-1 flex items-center gap-1.5 font-medium uppercase tracking-wide text-muted-foreground">
              <IconUsersGroup size={14} /> Admin Reviewer
            </p>
            <p className="text-sm font-medium">
              {admin?.fullName || "Not assigned"}
            </p>
            <p className="text-muted-foreground">{admin?.email || "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
