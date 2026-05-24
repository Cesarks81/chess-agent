import { cva } from 'class-variance-authority'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        solid:   'bg-emerald-500 text-gray-950 hover:bg-emerald-400',
        outline: 'border border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-gray-800',
        ghost:   'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
        link:    'text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  }
)

export function Button({ variant, size, className = '', children, ...props }) {
  return (
    <button className={button({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}
