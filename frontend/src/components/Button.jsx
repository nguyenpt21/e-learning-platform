// Button.jsx
export default function Button({ children, variant = "default", className = "", ...props }) {
    let baseStyle =
      "px-4 py-2 rounded font-medium transition duration-200 cursor-pointer";
  
    let styles = "";
  
    switch (variant) {
      case "default":
        styles =
          "bg-white text-black hover:text-[#098be4] hover:bg-[#cee8fb]";
        break;
      case "outline":
        styles =
          "bg-white text-[#098be4] border border-[#098be4] hover:text-[#098be4] hover:bg-[#cee8fb]";
        break;
      case "reverse":
        styles =
          "bg-[#098be4] text-white hover:bg-[#cee8fb] hover:text-[#098be4]";
        break;
      default:
        styles =
          "bg-white text-black hover:text-[#098be4] hover:bg-[#cee8fb]";
    }
  
    return (
      <button
        {...props}
        className={`${baseStyle} ${styles} ${className}`}
      >
        {children}
      </button>
    );
  }
  