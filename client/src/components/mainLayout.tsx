import React from "react";

interface OutletWrapperProps {
  children: React.ReactNode;
}

const OutletWrapper: React.FC<OutletWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col  md:gap-6 md:py-6 w-full px-4 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OutletWrapper;
