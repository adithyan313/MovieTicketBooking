import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const CheckAuth = (Component) => {
    function Wrapper(props){
        const user = useSelector(store => store.auth.user);
        const [isAuthChecked, setIsAuthChecked] = useState(false);

        useEffect(() => {
            if (user) {
                setIsAuthChecked(true);
            }
        }, [user]);

        if (!isAuthChecked) {
            return <div>Loading......</div>;
        }

        return <Component {...props} />;
    }

    return Wrapper;
}

export default CheckAuth;
