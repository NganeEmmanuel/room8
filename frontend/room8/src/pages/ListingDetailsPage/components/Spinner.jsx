// src/components/Spinner.jsx
const Spinner = ({ size = "12", color = "border-blue-600" }) => {
  const sizeClasses = {
    "4": "h-4 w-4",
    "6": "h-6 w-6",
    "8": "h-8 w-8",
    "10": "h-10 w-10",
    "12": "h-12 w-12",
    "16": "h-16 w-16",
  }

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${sizeClasses[size] || "h-12 w-12"}`}
      ></div>
    </div>
  )
}

export default Spinner
