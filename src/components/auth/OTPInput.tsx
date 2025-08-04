
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  className,
  onKeyDown
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize refs array based on maxLength
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, maxLength);
    while (inputRefs.current.length < maxLength) {
      inputRefs.current.push(null);
    }
  }, [maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const target = e.target;
    let updatedValue = target.value;
    
    // Only allow numbers
    updatedValue = updatedValue.replace(/\D/g, '');
    
    // Take only the last character if multiple are pasted or entered
    if (updatedValue.length > 1) {
      updatedValue = updatedValue.slice(-1);
    }
    
    // Update the input value
    target.value = updatedValue;
    
    // Create new OTP value
    const newOtp = value.split('');
    newOtp[index] = updatedValue;
    const newOtpValue = newOtp.join('');
    
    // Call onChange with new OTP value
    onChange(newOtpValue);
    
    // Move to next input if this one is filled
    if (updatedValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle the parent onKeyDown prop if it exists
    if (onKeyDown && e.key === 'Enter') {
      onKeyDown(e);
    }
    
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < maxLength - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if it looks like an OTP
    if (!/^\d+$/.test(pastedData)) return;
    
    // Take only what we need
    const otpCharacters = pastedData.substring(0, maxLength).split('');
    
    // Update OTP value
    const newOtp = value.split('');
    
    // Fill from current position
    for (let i = 0; i < otpCharacters.length; i++) {
      const targetIndex = index + i;
      if (targetIndex < maxLength) {
        newOtp[targetIndex] = otpCharacters[i];
      }
    }
    
    const newOtpValue = newOtp.join('');
    onChange(newOtpValue);
    
    // Focus the appropriate input
    const focusIndex = Math.min(index + otpCharacters.length, maxLength - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <div 
          key={index}
          className="relative w-full max-w-[56px] aspect-square"
        >
          <input
            ref={(el) => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            disabled={disabled}
            className={cn(
              "w-full h-full text-center text-2xl font-bold bg-background border rounded-md transition-all duration-200",
              "focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              value[index] ? "border-primary" : "border-input"
            )}
            autoComplete="one-time-code"
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
