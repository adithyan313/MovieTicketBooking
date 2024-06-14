import { NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Logout = () => {
        if (user) {
            axios
                .post(
                    "http://127.0.0.1:8000/logout/",
                    {},
                    {
                        headers: { Authorization: `Token ${user.token}` },
                    }
                )
                .then(() => {
                    dispatch(removeUser());
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Logout error:", error);
                });
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
            <NavLink to="/" className="nav-link">
            <img src="/BookMyShow_idZ_QE-O_2_5.png" alt="Todo List Icon" style={{ width: "150px", marginRight: "10px" }} />
            </NavLink>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarNav"
            >
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    {user && user.isAdmin && (
                        <>
                        <li className="nav-item">
                            <NavLink to="/cruedadmin" className="nav-link">
                            <img src="/admin.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
                            </NavLink>
                        </li>
                        <li className="nav-item">
    <NavLink to="http://127.0.0.1:8000/admin/login/?next=/admin/" className="nav-link">
    <img src="/admin.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
    </NavLink>
</li>
                        </>
                    )}
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link">
                        <img src="/cinema home.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
                        </NavLink>
                    </li>
                    {user ? (
                        <>
                            <li className="nav-item">
                                <NavLink to="/MyBooking" className="nav-link">
                                <img src="/tickets.png" alt="Todo List Icon" style={{ width: "30px", marginRight: "10px" }} />
                                
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={Logout}>
                                <img src="/switch.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link">
                                <img src="/login.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/signup" className="nav-link">
                                <img src="/signup.png" alt="Todo List Icon" style={{ width: "35px", marginRight: "10px" }} />
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
