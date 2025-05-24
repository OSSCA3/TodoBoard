import React from 'react';

interface CardProps {
  children: React.ReactNode;
}
const Card = ({ children }: CardProps) => {
  return (
    <div className="max-w-[480px] min-h-96 w-full p-4 rounded-lg shadow">
      {children}
    </div>
  );
};

export default Card;
