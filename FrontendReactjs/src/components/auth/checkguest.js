import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Checkguest=(Component)=>{
    function Wrapper(props) {
        var user = useSelector(store=>store.auth.user);
        var navigate = useNavigate();
        useEffect(() =>{
            if (user) {
                alert("sorry you are not allow :)");
                navigate('/');
            }
        },[user, navigate]);
        return <Component {...props}/>
    }
    return Wrapper;
}
export default Checkguest;