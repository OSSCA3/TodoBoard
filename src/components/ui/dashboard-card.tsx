import React from 'react';

interface CardProps {
  children: React.ReactNode;
}
const Card = ({ children }: CardProps) => {
  return (
    <div className="max-w-[480px] min-h-80 w-full bg-[#FFFEFE] rounded-lg shadow px-8 py-[26px] dashboard-card">
      {children}
    </div>
  );
};

export default Card;
