import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type CompetencyItemProps = {
  control: any;
  index: number;
  removeCompetency: (index: number) => void;
};

function CompetencyItem({
  control,
  index,
  removeCompetency,
}: CompetencyItemProps) {
  const {
    fields: indicatorFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `competencies.${index}.indicators`,
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Competency {index + 1}</h3>
        <Button
          type="button"
          variant="destructive"
          onClick={() => removeCompetency(index)}
        >
          Remove
        </Button>
      </div>

      {/* Title */}
      <Controller
        control={control}
        name={`competencies.${index}.title`}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Competency title"
            className="w-[300px]"
          />
        )}
      />

      {/* Indicators */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Indicators</Label>
          <Button type="button" variant="secondary" onClick={() => append("")}>
            + Add Indicator
          </Button>
        </div>

        {indicatorFields.map((indicator, indIndex) => (
          <div key={indicator.id} className="flex gap-2">
            <Controller
              control={control}
              name={`competencies.${index}.indicators.${indIndex}`}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Indicator"
                  className="w-[400px]"
                />
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(indIndex)}
            >
              −
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetencyItem;
