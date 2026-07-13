import Link from 'next/link';

interface Props{

title:string;

subtitle:string;

icon:string;

backUrl:string;

}

export default function Header({

title,

subtitle,

icon,

backUrl

}:Props){

return(

<div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg border-b-4 border-blue-400">

<div className="container-main py-6">

<div className="flex items-center justify-between">

<div className="flex items-center gap-3">

<span className="text-4xl">

{icon}

</span>

<div>

<h1 className="text-3xl font-black">

{title}

</h1>

<p className="text-blue-100">

{subtitle}

</p>

</div>

</div>

<Link href={backUrl}>

<button className="btn btn-outline border-white text-white">

← Voltar

</button>

</Link>

</div>

</div>

</div>

)

}