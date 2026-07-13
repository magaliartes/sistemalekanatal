import { SelectHTMLAttributes } from 'react';

interface Props
extends SelectHTMLAttributes<HTMLSelectElement>{

label:string;

children:React.ReactNode;

}

export default function Select({

label,

children,

className='',

...props

}:Props){

return(

<div>

<label
className="block text-sm font-semibold text-gray-700 mb-2">

{label}

</label>

<select

className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500 ${className}`}

{...props}

>

{children}

</select>

</div>

)

}