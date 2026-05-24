export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-800 bg-gray-900 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return (
    <h3 className={`text-base font-semibold text-white ${className}`}>{children}</h3>
  )
}

export function CardContent({ className = '', children }) {
  return <div className={`px-4 pb-4 sm:px-6 sm:pb-6 ${className}`}>{children}</div>
}
