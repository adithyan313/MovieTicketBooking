import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CheckAdminAuth = (Component) => {
    function Wrapper(props) {
        const user = useSelector((store) => store.auth.user);
        const [isAdminCheck, setAdmincheck] = useState(false);

        useEffect(() => {
            if (user) {
                setAdmincheck(true);
            }
        }, [user]);
        if (!isAdminCheck) {
            return <div>
                <button class="btn btn-info" disabled>
                    <span class="spinner-border spinner-border-sm"></span>
                        Loading..
                </button>
            </div>
        }
        return <Component {...props} />;
    }

    return Wrapper;
};

export default CheckAdminAuth;
