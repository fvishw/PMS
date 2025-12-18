import React from "react";

interface SectionHeadingProps {
  children?: React.ReactNode;
  title: string;
}
const SectionWrapper: React.FC<SectionHeadingProps> = ({ children, title }) => {
  return (
    <div className="w-full px-4 lg:px-6">
      <div className="  w-full px-4 mb-4 text-white">
        <h1 className="font-bold text-lg dark:text-white text-black">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
};

export default SectionWrapper;
