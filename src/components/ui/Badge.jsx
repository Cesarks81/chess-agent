import { cva } from 'class-variance-authority'

const badge = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
  {
    variants: {
      variant: {
        emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        blue:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
        purple:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
        red:     'bg-red-500/15 text-red-400 border-red-500/30',
        gray:    'bg-gray-800 text-gray-400 border-gray-700',
      },
    },
    defaultVariants: { variant: 'gray' },
  }
)

export function Badge({ variant, className = '', children }) {
  return <span className={badge({ variant, className })}>{children}</span>
}
