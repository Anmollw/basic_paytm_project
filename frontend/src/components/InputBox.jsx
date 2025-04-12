
export function InputBox({label,placeholder,OnChange}){
    return <div className="text-sm font-medium text-left py-2">
        <div>
          {label}
        </div>
        <input onChange={OnChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
   </div>

}