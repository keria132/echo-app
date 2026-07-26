import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

const inputVariants = cva(
  `border-input file:text-foreground placeholder:text-muted-foreground placeholder:truncate focus-visible:border-ring focus-visible:ring-ring/50
  disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30
  dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/20
  w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none
  file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
  {
    variants: {
      variant: {
        default:
          'focus-visible:ring-echo-p/20 border-echo-border text-echo-t1 rounded-xl border border-solid transition-[border-color,box-shadow] duration-200 outline-none',
      },
      variantSize: {
        default: 'h-10 md:h-12 w-full text-sm ',
      },
    },
    defaultVariants: {
      variant: 'default',
      variantSize: 'default',
    },
  },
);

function Input({
  className,
  type,
  variant = 'default',
  variantSize = 'default',
  ...props
}: ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, variantSize, className }))}
      {...props}
    />
  );
}

export { Input };
