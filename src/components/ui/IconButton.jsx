export default function IconButton({ icon, title, onClick, active, activeColor = 'text-gray-300', className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`transition-colors cursor-pointer ${
        active ? activeColor : `text-gray-500 hover:${activeColor}`
      } ${className}`}
      title={title}
    >
      <i className={icon}></i>
    </button>
  );
}
