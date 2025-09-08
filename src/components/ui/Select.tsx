import cls from "../../utils/cls"

interface Props { 
  name: string, 
  value: string | number, 
  placeholder?: string,
  label?: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}

export default function Select({ name, value, placeholder, label, onChange }: Props) {
  return (
    <div className={cls("flex flex-col", label ? "gap-1" : "")}>
      {label && <label className="text-white">{label}</label>}
      
      <select
        className="bg-white p-2 rounded-md border-[#90A1B9] outline-none"
        name={name}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
       
      </select>
    </div>
  )
}