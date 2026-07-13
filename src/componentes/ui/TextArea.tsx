import { TextareaHTMLAttributes } from 'react';

interface Props
extends TextareaHTMLAttributes<HTMLTextAreaElement>{

label:string;

}

export default function Textarea({

label,
className='',
...props

}:Props){

return(

<div>

<label
className="block text-sm font-semibold text-gray-700 mb-2">

{label}

</label>

<textarea

className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500
outline-none ${className}`}

{...props}

/>

</div>

)

}