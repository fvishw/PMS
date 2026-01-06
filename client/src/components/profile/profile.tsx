import { useAuth } from "@/hooks/useAuthContext";
import { Label } from "@radix-ui/react-label";

function Profile() {
  const { user } = useAuth();
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center  w-xl border rounded p-4 bg-muted">
        {/* profile pic */}
        <div className="w-[150px] h-[150px] rounded-full flex  bg-gray-300 overflow-hidden">
          <img
            src={"https://avatars.githubusercontent.com/u/103122966?v=4"}
            alt="user avatar"
          />
        </div>
        {/* user info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full bg-muted">
          <div className="border rounded p-4 w-full col-span-2 space-x-2.5 bg-background">
            <Label className="font-bold text-md">Full Name:</Label>
            <span>{user?.fullName}</span>
          </div>
          <div className="border rounded p-4 w-full bg-background">
            <Label className="font-bold text-md">Role: </Label>
            <span>{user?.role || "Unknown"}</span>
          </div>
          <div className="border rounded p-4 w-full bg-background">
            <Label className="font-bold text-md">Email: </Label>
            <span>{user?.email}</span>
          </div>
          <div className="border rounded p-4 w-full col-span-2 bg-background">
            <Label className="font-bold text-md">Designation: </Label>
            <span>{"Software Engineer"}</span>
          </div>
          <div className="border rounded p-4 col-span-2 w-full bg-background">
            <Label className="font-bold text-md ">Parent Reviewer Name: </Label>
            <span>{"Aniket Panchal"}</span>
          </div>
          <div className="border rounded p-4 col-span-2 w-full bg-background">
            <Label className="font-bold text-md ">Reviewer Name: </Label>
            <span>{"Akhil Ramani"}</span>
          </div>
          <div className="border rounded p-4 col-span-2 w-full bg-background">
            <Label className="font-bold text-md ">Appraiser Name: </Label>
            <span>{"Aniket Panchal"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
