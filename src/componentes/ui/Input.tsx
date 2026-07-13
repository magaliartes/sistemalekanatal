import { InputHTMLAttributes } from 'react';

interface InputProps
extends InputHTMLAttributes<HTMLInputElement>{

    label:string;

}

export default function Input({
    label,
    className='',
    ...props
}:InputProps){

    return(

        <div>

            <label
            className="block text-sm font-semibold text-gray-700 mb-2">

                {label}

            </label>

            <input

                className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                outline-none transition ${className}`}

                {...props}

            />

        </div>

    )

}