import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { performanceRatingOptions, remarkOptions } from "./option";

interface ICommenterNameProps {
  name: string;
}

const FinalDecisionAndRemark: React.FC<ICommenterNameProps> = ({ name }) => {
  return (
    <div className="border rounded p-4 ">
      <Label className="font-semibold pb-4">{name}'s Decision And Remark</Label>
      <div className="grid grid-cols-1 lg:grid-cols-2 space-y-4 space-x-3">
        <div>
          <Label className="mb-2">{name}'s Remark</Label>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select remark" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {remarkOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2">Appraiser's Recommendation</Label>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Recommendation" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {performanceRatingOptions.map((performance) => (
                  <SelectItem key={performance.value} value={performance.value}>
                    {performance.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="col-span-2 mt-4">
        <Label className=" pb-2">{name}'s Final Comments</Label>
        <Textarea placeholder="Enter final comments..." />
      </div>
    </div>
  );
};

export default FinalDecisionAndRemark;
