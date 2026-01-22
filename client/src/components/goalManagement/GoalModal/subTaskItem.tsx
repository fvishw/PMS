import { Input } from "@/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { Controller } from "react-hook-form";

interface SubTaskItemProps {
  index: number;
  control: any;
  removeSubTask: (index: number) => void;
}

export default function SubTaskItem({
  index,
  control,
  removeSubTask,
}: SubTaskItemProps) {
  return (
    <>
      <div className="flex justify-around items-center space-x-3 mt-2">
        <Controller
          control={control}
          name={`subTasks.${index}.title`}
          render={({ field }) => <Input {...field} />}
        />
        <IconTrash
          className="text-red-600 cursor-pointer hover:text-red-700 h-5"
          onClick={() => removeSubTask(index)}
        />
      </div>
    </>
  );
}
