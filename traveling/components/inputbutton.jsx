export default function InputButton({
  type = "",
  value = "",
  className = "",
  children,
  onClick
}) {
  return (
    <button
      type={type}
      value={value}
      onClick={onClick}
      className={`
        p-2
        transition-all
        duration-300
        hover:scale-[1.02]
        shadow-sm
        hover:cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
