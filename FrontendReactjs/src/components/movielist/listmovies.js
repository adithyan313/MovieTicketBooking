/*import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Postlistmovie from "./details";
import Navbar from "../navebar";

function ListMovie() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(() => {
        axios
            .get("http://127.0.0.1:8000/movies/")
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch posts:", error);
            });
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div>
            <Navbar />
            <div className="carousel slide" id="hello" data-ride="carousel">
                <ul className="carousel-indicators">
                    <li data-target="#hello" data-slide-to="0" className="active"></li>
                    <li data-target="#hello" data-slide-to="1"></li>
                    <li data-target="#hello" data-slide-to="2"></li>
                </ul>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://c0.wallpaperflare.com/preview/534/153/251/architecture-broadway-building-business.jpg" alt="allapuzha" width="100%" height="370px" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://c4.wallpaperflare.com/wallpaper/959/1004/966/tv-show-stranger-things-caleb-mclaughlin-charlie-heaton-wallpaper-preview.jpg" alt="" width="100%" height="370px" />
                    </div>
                    <div className="carousel-item">
                        <img src="https://c4.wallpaperflare.com/wallpaper/761/273/222/kung-fu-panda-kung-fu-panda-3-po-kung-fu-panda-wallpaper-preview.jpg" alt="" width="100%" height="370px" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#hello" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </a>
                <a className="carousel-control-next" href="#hello" data-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </a>
            </div>
            
            <div className="container mt-4">
            <div className="row justify-content-center align-items-center mb-4">
  {posts.map((post) => (
    
      <div key={post.id} className="col-md-4">
        <Postlistmovie post={post} refresh={fetchPosts} />
      </div>
    </div>
  ))}
</div>
        </div>
    );
}

export default ListMovie;*/
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Postlistmovie from "./details";
import Navbar from "../navebar";
import { Link } from "react-router-dom";

function ListMovie() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/movies/")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <Navbar />
      <div className="carousel slide" id="hello" data-ride="carousel">
  <ul className="carousel-indicators">
    {posts.map((item, index) => (
      <li
        key={index}
        data-target="#hello"
        data-slide-to={index}
        className={index === 0 ? "active" : ""}
      ></li>
    ))}
  </ul>
  <div className="carousel-inner">
    {posts.map((item, index) => (
      <div
        className={`carousel-item ${index === 0 ? "active" : ""}`}
        key={item.id}
      >
        <Link to={`/views/${item.id}`}>
        <img
          src={`http://127.0.0.1:8000${item.poster_image}`}
          alt="allapuzha"
          width="100%"
          height="370px"
        />
        <div className="carousel-caption">
        <h1 className="text-white">{item.name}</h1>
      </div>
        </Link>
      </div>
    ))}
  </div>
  <a className="carousel-control-prev" href="#hello" data-slide="prev">
    <span className="carousel-control-prev-icon"></span>
  </a>
  <a className="carousel-control-next" href="#hello" data-slide="next">
    <span className="carousel-control-next-icon"></span>
  </a>
</div>


      <div className="container mt-4">
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-lg-3">
              <Postlistmovie post={post} refresh={fetchPosts} /><br/><br/>
            </div>
          ))}
        </div>
      </div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{height: "200px"}}>

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
        style={{ float: "left" }}
    >
        <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
            <li className="nave-item">
                
            </li>
        </ul>
        
    </div>
</nav>

    </div>

  );
}

export default ListMovie;

