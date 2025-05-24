import React from 'react';

interface DashboardGridProps {
  children: React.ReactNode;
}
const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="grid justify-items-center gap-y-20 w-full h-full grid-cols-2 px-12 ">
      {children}
    </div>
  );
};

export default DashboardGrid;
