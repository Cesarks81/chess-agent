export function Tabs({ value, onChange, options, className = '' }) {
  return (
    <div className={`flex rounded-xl bg-gray-800/60 p-1 gap-1 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            value === opt.value
              ? 'bg-gray-950 text-emerald-400 shadow-sm'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
