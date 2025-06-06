'use client';

import Link, { LinkProps } from 'next/link';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  Ref,
} from 'react';

const BUTTON_VARIANTS = {
  primary: 'bg-[#8B5CF6] text-[#FFFEFE] hover:bg-[#7d53dd]',
  secondary: 'bg-[#ECECEC] text-black hover:bg-[#D9D9D9]',
  outline: 'border border-[#747775] text-[#1F1F1F] bg-transparent', // NOTE : google 로그인 버튼 디자인 참고 (https://developers.google.com/identity/branding-guidelines)
  link: 'bg-transparent border-none cursor-pointer p-1 flex items-center justify-center rounded transition-colors duration-200 hover:bg-gray-100',
} as const;

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  href?: never;
}

interface LinkButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>, // LinkProps의 href와 충돌하지 않도록 제외함.
    LinkProps {
  variant?: keyof typeof BUTTON_VARIANTS;
}

type ButtonProps = BaseButtonProps | LinkButtonProps;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const baseClasses = `px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer ${BUTTON_VARIANTS[variant]} ${className || ''}`;

    // href가 있는 경우 Link로 렌더링
    if ('href' in props) {
      const { variant, ...linkProps } = props as LinkButtonProps;

      return (
        <Link
          className={baseClasses}
          ref={ref as Ref<HTMLAnchorElement>} // ref는 HTMLAnchorElement로 전달
          {...linkProps}
        >
          {children}
        </Link>
      );
    }

    // href가 없는 경우 button으로 렌더링
    const { type = 'button', ...buttonProps } = props as BaseButtonProps;
    return (
      <button
        className={`px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer ${BUTTON_VARIANTS[variant]} ${className || ''}`}
        type={type} // NOTE: 기본값을 'button'으로 설정해서 의도치않은 submit 방지
        ref={ref}
        {...buttonProps}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
