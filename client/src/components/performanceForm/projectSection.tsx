import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { UseFormRegister, Control, useFieldArray } from "react-hook-form";
import { PerformanceFormValue, EditPermissions } from "@/types/performance";

interface ProjectSectionProps {
  projectIndex: number;
  control: Control<PerformanceFormValue>;
  register: UseFormRegister<PerformanceFormValue>;
  permissions: EditPermissions;
  removeProject: (index: number) => void;
  projectFieldsLength: number;
}

const createAchievementItem = () => ({
  achievement: "",
  difficulty: "",
});

export const ProjectSection = ({
  projectIndex,
  control,
  register,
  permissions,
  removeProject,
  projectFieldsLength,
}: ProjectSectionProps) => {
  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: `projects.${projectIndex}.achievements`,
  });

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">Project {projectIndex + 1}</p>
        {permissions.canEditSelf ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeProject(projectIndex)}
            disabled={projectFieldsLength === 1}
          >
            Remove Project
          </Button>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`projects.${projectIndex}.name`}>
          Project / Module Name *
        </Label>
        <Input
          id={`projects.${projectIndex}.name`}
          disabled={!permissions.canEditSelf}
          placeholder="e.g., Payroll automation, CRM integration"
          {...register(`projects.${projectIndex}.name`)}
        />
      </div>

      <div className="border-l-2 border-primary/30 pl-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Achievements:</p>
          {permissions.canEditSelf && achievementFields.length > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => appendAchievement(createAchievementItem())}
            >
              + Add Achievement
            </Button>
          ) : null}
        </div>

        {achievementFields.length === 0 && permissions.canEditSelf ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => appendAchievement(createAchievementItem())}
          >
            + Add First Achievement
          </Button>
        ) : null}

        <div className="space-y-3">
          {achievementFields.map((achievement, achIndex) => (
            <div
              key={achievement.id}
              className="bg-muted/50 p-3 rounded-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Achievement {achIndex + 1}
                </p>
                {permissions.canEditSelf ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAchievement(achIndex)}
                    disabled={achievementFields.length === 1}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor={`projects.${projectIndex}.achievements.${achIndex}.achievement`}
                  >
                    Achievement / Functionality *
                  </Label>
                  <Textarea
                    id={`projects.${projectIndex}.achievements.${achIndex}.achievement`}
                    disabled={!permissions.canEditSelf}
                    placeholder="Describe what you delivered or accomplished"
                    rows={2}
                    {...register(
                      `projects.${projectIndex}.achievements.${achIndex}.achievement`,
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`projects.${projectIndex}.achievements.${achIndex}.difficulty`}
                  >
                    Difficulty / Challenges Faced *
                  </Label>
                  <Textarea
                    id={`projects.${projectIndex}.achievements.${achIndex}.difficulty`}
                    disabled={!permissions.canEditSelf}
                    placeholder="What challenges did you face?"
                    rows={2}
                    {...register(
                      `projects.${projectIndex}.achievements.${achIndex}.difficulty`,
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
