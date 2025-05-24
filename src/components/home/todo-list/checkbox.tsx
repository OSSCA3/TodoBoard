import React from 'react';
import { FaCheck } from 'react-icons/fa6';
interface CheckBoxProps {
  isCompleted: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const CheckBox = ({ isCompleted, onClick }: CheckBoxProps) => {
  const boxClasses =
    'w-[22px] h-[22px] border border-[#65558f] rounded cursor-pointer flex justify-center items-center ' +
    (isCompleted ? 'bg-[#65558f] text-white' : 'bg-transparent');

  return (
    <div className={boxClasses} onClick={onClick}>
      {isCompleted && <FaCheck className="text-white" />}
    </div>
  );
};

export default CheckBox;
