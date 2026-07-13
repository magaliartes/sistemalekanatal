import { ReactNode } from 'react';

interface Props{

children:ReactNode;

}

export default function Container({

children

}:Props){

return(

<div className="container-main py-10">

{children}

</div>

)

}