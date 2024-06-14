import React from "react";
import { Link } from "react-router-dom";

function Adminlog() {
    return(
        <Link style={{position: "absolute", left: "50%"}} to="http://127.0.0.1:8000/admin/login/?next=/admin/"><button className="btn btn-primary">Admin</button></Link>
    );
}
export default Adminlog;