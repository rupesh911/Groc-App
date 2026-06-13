import React from "react";
 import "./Style.css";

 var Month = () => {
   const month = 'June';
    return (
        <div className="p-3 mb-2 text-black" id="month">
            <center>
                 <h2 className="text-center">Plan your grocery list for the month of {month}</h2>
            </center>
        </div>

    )
};

export default Month;