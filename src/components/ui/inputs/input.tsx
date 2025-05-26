import { ComponentPropsWithRef, InputHTMLAttributes } from 'react';

interface InputProps extends ComponentPropsWithRef<'input'> {}

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={`w-full rounded-md border border-[#8B5CF6] px-3 py-2.5 text-black placeholder:text-[#989898] focus:outline-[#6f4ac5] focus-visible:outline-[#6f4ac5] ${className || ''}`}
      {...props}
    />
  );
};

export default Input;
