import cls from "../../utils/cls"

interface Props { 
  name: string, 
  value: string | number, 
  className?: string,
  placeholder?: string,
  label?: string,
  type?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void 
}

export default function Input({ name, value, onChange, placeholder = "", label, type = "text", className = "" }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      if (["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === "number") {
      const input = e.target as HTMLInputElement
      const val = input.value
      if (val.startsWith("-")) return
    }
    onChange(e)
  }

  return (
    <div className={cls("flex flex-col", className, label ? "gap-1" : "")}>
      {label && <label className="text-white">{label}</label>}
      
      <input
        className="bg-white p-2 rounded-md border border-[#90A1B9] outline-none"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
    </div>
  )
}
