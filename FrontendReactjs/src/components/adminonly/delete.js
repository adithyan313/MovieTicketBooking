import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import CheckAdminAuth from "../auth/admin/checkadmin";

function PostListItem(props) {
    const user = useSelector((store) => store.auth.user);
    const [responseMessage, setResponseMessage] = useState('');

    function deletepost() {
        axios.delete(`http://127.0.0.1:8000/movies/delete/${props.item.id}`, {
            headers: { Authorization: `Token ${user.token} `},
        })
        .then((response) => {
            setResponseMessage(response.data.message);
            props.refresh();
        })
        .catch((error) => {
            console.error("Error deleting post:", error);
            setResponseMessage("Faild to delete post.");
            alert("Your are not allowed to delete this post.")
        });
    }
    return(
        <div>
            <div className="card">
                <div className="card-body">
                    {props.item.name}
                    <button className="btn btn-danger float-right" onClick={deletepost}>
                    <i className="fas fa-trash" style={{ color: 'white' }}></i>
                        Delete
                    </button>
                    <Link to={`/editmovie/${props.item.id}`} className="btn btn-primary float-right">
                    <i className="fas fa-edit edit-icon"></i>
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default CheckAdminAuth(PostListItem);