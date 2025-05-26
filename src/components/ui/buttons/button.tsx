'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

const BUTTON_VARIANTS = {
  primary: 'bg-[#8B5CF6] text-[#FFFEFE] hover:bg-[#7d53dd]',
  secondary: 'bg-[#ECECEC] text-black hover:bg-[#D9D9D9]',
  outline: 'border border-[#747775] text-[#1F1F1F] bg-transparent', // NOTE : google 로그인 버튼 디자인 참고 (https://developers.google.com/identity/branding-guidelines)
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', className, type = 'button', children, ...props },
    ref,
  ) => {
    return (
      <button
        className={`px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer ${BUTTON_VARIANTS[variant]} ${className || ''}`}
        type={type} // NOTE: 기본값을 'button'으로 설정해서 의도치않은 submit 방지
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
