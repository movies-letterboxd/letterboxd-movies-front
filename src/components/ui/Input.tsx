import cls from "../../utils/cls"

interface Props { 
  name: string, 
  value: string | number, 
  placeholder?: string,
  label?: string,
  type?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void 
}

export default function Input({ name, value, onChange, placeholder = "", label, type = "text" }: Props) {
  return (
    <div className={cls("flex flex-col", label ? "gap-1" : "")}>
      {label && <label className="text-white">{label}</label>}
      
      <input
        className="bg-white p-2 rounded-md border-[#90A1B9] outline-none"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}