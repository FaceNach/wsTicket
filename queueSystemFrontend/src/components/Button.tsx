import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-white/20 to-white/10 text-white ring-white/15 hover:from-white/25 hover:to-white/15',
  secondary: 'bg-white/5 text-white/85 ring-white/10 hover:bg-white/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'primary', className, ...props }, ref) {
    const variantClassName = variants[variant];
    const mergedClassName = [baseClassName, variantClassName, className]
      .filter(Boolean)
      .join(' ');

    return <button ref={ref} className={mergedClassName} {...props} />;
  }
);

Button.displayName = 'Button';
