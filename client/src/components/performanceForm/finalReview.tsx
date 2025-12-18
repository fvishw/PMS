import { Label } from "../ui/label";
import FinalDecisionAndRemark from "./finalDecisionAndRemark";
import SectionWrapper from "./sectionWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { agreementOptions } from "./option";
import { Textarea } from "../ui/textarea";

function FinalReview() {
  return (
    <SectionWrapper title="Section C: Final Comments">
      <div>
        {/* appraiser & reviewer comments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 space-x-4">
          <FinalDecisionAndRemark name="Appraiser" />
          <FinalDecisionAndRemark name="Reviewer" />
        </div>
        <div className="w-full rounded border p-4 mt-4 ">
          <Label className="pb-4 font-semibold">Appraiser's Comment</Label>
          <div className="space-y-4 grid md:grid-cols-2 grid-cols-1">
            <div>
              <Label className="pb-2">Employee Remark</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Recommendation" />
                </SelectTrigger>
                <SelectContent onChange={() => {}}>
                  <SelectGroup>
                    {agreementOptions.map((performance) => (
                      <SelectItem
                        key={performance.value}
                        value={performance.value}
                      >
                        {performance.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="pb-2">Employee Final Comment</Label>
              <Textarea placeholder="Enter final comments..." />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default FinalReview;
