import { EditPermissions } from "@/types/performance";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import SectionWrapper from "./sectionWrapper";

type AchievementRow = {
  id: string;
  projectName: string;
  achievement: string;
  difficulty: string;
};

interface AchievementSectionProps {
  achievements: AchievementRow[];
  permissions: EditPermissions;
  register: any;
  append: (value: {
    projectName: string;
    achievement: string;
    difficulty: string;
  }) => void;
  remove: (index: number) => void;
}

function AchievementSection({
  achievements,
  permissions,
  register,
  append,
  remove,
}: AchievementSectionProps) {
  return (
    <SectionWrapper title="Section B: Project Achievements">
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Project Achievements</h3>
            <p className="text-sm text-muted-foreground">
              Add the project wise achievement, functionality delivered, and the
              difficulty you faced.
            </p>
          </div>
          {permissions.canEditSelf ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  projectName: "",
                  achievement: "",
                  difficulty: "",
                })
              }
            >
              Add Achievement
            </Button>
          ) : null}
        </div>

        {achievements.length === 0 && !permissions.canEditSelf ? (
          <p className="text-sm text-muted-foreground">
            No achievements were submitted for this appraisal.
          </p>
        ) : null}

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="rounded-md border p-4 space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">Achievement {index + 1}</p>
                {permissions.canEditSelf ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    disabled={achievements.length === 1}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={`achievements.${index}.projectName`}>
                    Project / Module
                  </Label>
                  <Input
                    id={`achievements.${index}.projectName`}
                    disabled={!permissions.canEditSelf}
                    placeholder="Payroll automation"
                    {...register(`achievements.${index}.projectName`)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`achievements.${index}.achievement`}>
                    Achievement / Functionality
                  </Label>
                  <Textarea
                    id={`achievements.${index}.achievement`}
                    disabled={!permissions.canEditSelf}
                    placeholder="Delivered the payroll export flow and reduced manual processing time"
                    rows={3}
                    {...register(`achievements.${index}.achievement`)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`achievements.${index}.difficulty`}>
                  Difficulties / Challenges
                </Label>
                <Textarea
                  id={`achievements.${index}.difficulty`}
                  disabled={!permissions.canEditSelf}
                  placeholder="Integration issues with the legacy API and data cleanup"
                  rows={3}
                  {...register(`achievements.${index}.difficulty`)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default AchievementSection;
