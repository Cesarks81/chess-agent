export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export function InputField({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>}
      <Input {...props} />
    </div>
  )
}
