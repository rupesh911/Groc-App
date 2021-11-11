import React from "react";
 import "./Style.css";

 var Month = () => {
   const carentMonth = new Date();
    const month = carentMonth.toLocaleString('default', { month: 'long' });
    return (
        <div className="p-3 mb-2 text-black" id="month">
            <center>
                 <h2 className="text-center "> Plan for a Month of  {month}</h2> 
            </center>
        </div>

    )
};

export default Month;