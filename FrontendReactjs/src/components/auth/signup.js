import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navebar";

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordconfo, setPasswordconfo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const signupuser = (event) => {
        event.preventDefault();

        const user = {
            username: name,
            email: email,
            password: password,
            password_confirmation: passwordconfo,
        };
        axios.post('http://127.0.0.1:8000/register/', user)
        .then((Response) => {
            setErrorMessage('');
            navigate('/login')
        })
        .catch((error) => {
            if (error.response?.data?.errors) {
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            } else {
                setErrorMessage('Faild to connect to API');
            }
        });
    };

    return(
        <div>
            <Navbar/>
            <div className="container">
                <div className="row justify-content-center align-items-center" style={{ minHeight: "620px" }}>
                <div className="col-md-6">
                    <div className="border order rounded p-4" >
                        <center><h1>Sign Up</h1></center>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={signupuser}>
                            <div className="form-group">
                                <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@gmail.com" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" value={passwordconfo} onChange={(event) => setPasswordconfo(event.target.value)} placeholder="Confo_Password" />
                            </div>
                            <div className="form-group text-center">
                                <button className="btn btn-primary form-control" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;