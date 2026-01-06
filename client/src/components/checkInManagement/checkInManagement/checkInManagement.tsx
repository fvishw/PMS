import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionManagement from "../questionSet/Question";
import { UserCheckIns } from "../userCheckIns/userCheckIns";

export const CheckInManagement = () => {
  return (
    <Tabs defaultValue="user_check_ins" className="w-full">
      <TabsList>
        <TabsTrigger className="py-2" value="user_check_ins">
          User Check-Ins
        </TabsTrigger>
        <TabsTrigger className="py-2" value="question_sets">
          Question Sets
        </TabsTrigger>
      </TabsList>
      <TabsContent value="user_check_ins">
        <UserCheckIns />
      </TabsContent>
      <TabsContent value="question_sets">
        <QuestionManagement />
      </TabsContent>
    </Tabs>
  );
};
