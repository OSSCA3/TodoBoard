'use client';

import { useState, ComponentPropsWithRef, ChangeEvent } from 'react';

interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
  maxLength?: number;
}

const TextArea = ({
  className,
  maxLength,
  onChange,
  value,
  ...props
}: TextAreaProps) => {
  const [internalValue, setInternalValue] = useState(value || ''); // NOTE : 비제어 input에서도 글자수를 표시하기 위한 내부 상태

  const isControlled = value !== undefined;
  const isCheckMaxLength = maxLength !== undefined;
  const currentLength = isControlled
    ? value.toString().length
    : internalValue.toString().length;

  const changeValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (maxLength) {
      // 글자수가 maxLength를 초과하지 않도록 제한
      if (newValue.length > maxLength) {
        event.target.value = newValue.slice(0, maxLength);
        return; // 글자수가 초과하면 상태 업데이트를 하지 않음
      }
    }
    if (!isControlled) {
      setInternalValue(newValue); // 비제어 컴포넌트인 경우 내부 상태 업데이트
    }
    if (onChange) {
      onChange(event); // 부모 컴포넌트의 onChange 핸들러 호출
    }
  };

  return (
    <div
      className={`w-full px-3 py-2.5 rounded-md border border-[#8B5CF6] ${className || ''}`}
    >
      <textarea
        className="w-full px-1 text-black placeholder:text-[#989898] focus:outline-[#6f4ac5] focus-visible:outline-[#6f4ac5]"
        onChange={changeValue}
        value={isControlled ? value : undefined} // 제어 컴포넌트인 경우 부모 컴포넌트의 value 사용
        {...props}
      />
      {isCheckMaxLength && (
        <div className="mt-1 text-right text-xs text-[#989898]">
          {currentLength}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;
