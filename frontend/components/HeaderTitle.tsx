import React from "react";

interface HeaderTitleProps {
  children: React.ReactNode;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ children }) => {
  // Global css de header_text ucun clamp ile olcu yarat, jasper website ornekden bax
  return <h1 className="font-[600] header_text">{children}</h1>;
};

export default HeaderTitle;
