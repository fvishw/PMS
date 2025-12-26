import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewCheckIn from "./newCheckIn";
import PastCheckIn from "./pastCheckIn";

function CheckIns() {
  return (
    <Tabs defaultValue="my_new_check_in" className="w-full">
      <TabsList>
        <TabsTrigger className="py-2" value="my_new_check_in">
          My New CheckIns
        </TabsTrigger>
        <TabsTrigger className="py-2" value="my_completed_check_ins">
          My Completed CheckIns
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my_new_check_in">
        <NewCheckIn />
      </TabsContent>
      <TabsContent value="my_completed_check_ins">
        <PastCheckIn />
      </TabsContent>
    </Tabs>
  );
}

export default CheckIns;
