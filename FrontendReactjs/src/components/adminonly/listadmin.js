import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import PostListItem from "./delete";
import CheckAdminAuth from "../auth/admin/checkadmin";
import Navbar from "../navebar";

function CruedAdmin(props) {
    const user = useSelector((store) => store.auth.user);
    const [post, setpost] = useState([]);

    const featchpost = useCallback(() => {
        if (user) {
            axios.get("http://127.0.0.1:8000/adminlistmovie/", {
                headers: { Authorization: `Token ${user.token}`},
            })
            .then((response) => {
                setpost(response.data);
            })
            .catch((error) => {
                console.error("Faild to fetch posts:", error);
            });
        }
    }, [user]);

    useEffect(() => {
        featchpost();
    }, [featchpost]);

    return( 
        <div>
            <Navbar/>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                        <Link to={"/create"} className="btn btn-primary mb-2 mr-2">
                        <i className="fas fa-plus" style={{ color: 'white' }}></i>
                            Create Post
                        </Link>
                        </div>
                        {post.length === 0 ?(
                            <h3 className="text-md-center">No matching posts found.</h3>
                        ) : (
                            post.map((item) => <PostListItem key={item.id} item={item} refresh={featchpost} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckAdminAuth(CruedAdmin);