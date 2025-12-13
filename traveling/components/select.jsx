function Select({
  label,
  options = [],
  value,
  onChange,
  className = "",
  error = "",
  icon: Icon = null,
  iconPosition = "right", // "left" o "right"
  id,
}) {
  const hasError = Boolean(error);
  const selectId = id || `select-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Icon />
          </div>
        )}

        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`
            block w-full px-3 py-2 text-sm border rounded-md
            shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
            ${Icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}
            ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
            appearance-none
            ${className}
          `}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {Icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <Icon />
          </div>
        )}
      </div>

      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Select;
