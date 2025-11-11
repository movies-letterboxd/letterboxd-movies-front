import cls from "../../utils/cls"

interface Props { 
  name: string, 
  value: string | number, 
  placeholder?: string,
  label?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
}

export default function Textarea({ name, value, onChange, placeholder = "", label, className }: Props) {
  return (
    <div className={cls("flex flex-col", label ? "gap-1" : "", className)}>
      {label && <label className="text-white">{label}</label>}

      <textarea
        className="bg-white p-2 rounded-md border-[#90A1B9] outline-none h-24 resize-none w-full"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      >
      </textarea>
    </div>
  )
}