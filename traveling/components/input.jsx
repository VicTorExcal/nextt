export default function Input({
  id = "",
  name = "",
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  error = "",
  label = "",
  icon: Icon = null,
  iconPosition = "left"
}) {
  const hasError = Boolean(error);
  const inputId = `input-${name || Math.random().toString(36).slice(2)}`;

  return (
    <div className="w-full">
      {/* LABEL OPCIONAL */}
      {label && (
        <label 
          htmlFor={id}
          className="block mb-1 text-sm text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* ICONO IZQUIERDO */}
        {Icon && iconPosition === "left" && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </span>
        )}

        {/* INPUT */}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={`
            w-full px-3 py-2 text-sm shadow-sm border rounded-md transition
            focus:outline-none focus:ring-1
            ${Icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}
            ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
            ${className}
          `}
        />

        {/* ICONO DERECHO */}
        {Icon && iconPosition === "right" && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
            <Icon />
          </span>
        )}
      </div>

      {/* ERROR */}
      {hasError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
