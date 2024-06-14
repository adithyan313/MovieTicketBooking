import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckAuth from "../auth/checkAuth";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function ViewDetail() {
    const user = useSelector((store) => store.auth.user);
    const { movieid } = useParams();
    const [post, setPost] = useState({ poster_image: "", name: "", description: "", times: "" });
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [yourDate, setYourDate] = useState('2024-01-01');

    const handleDateChange = (event) => {
        setYourDate(event.target.value);
      };
    

    const view = useCallback(() => {
        if (user) {
            axios.get(`http://127.0.0.1:8000/movieslist/${movieid}`, {
                headers: { Authorization: `Token ${user.token}`}
            }) 
            .then((response) => {
                setPost(response.data);
                setError(null);
            })
            .catch((error) => {
                setError("Failed to fetch movie details. Please try again later."); 
            });
        }
    }, [user, movieid]);

    useEffect(() => {
        view();
    }, [view]);

    useEffect(() => {
        const fetchPosts = () => {
            axios
                .get("http://127.0.0.1:8000/movies/")
                .then((response) => {
                    setPosts(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch posts:", error);
                });
        };
        fetchPosts();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!post.name) {
        return <div className="spinner-border text-primary" style={{ position: "absolute", right: "4%", top: "50%" }}></div>;
    }
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };
    
    

    return (
        <div>
        <Navbar />
        <div 
            style={{ 
                position: "relative", 
                color: "white", 
                height: "400px",
                overflow: "hidden"
            }}
        >
            {/* Background Image */}
            <div 
                style={{ 
                    backgroundImage: `url(http://127.0.0.1:8000${post.poster_image})`, 
                    height: "100%", 
                    width: "100%", 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    position: "absolute", 
                    top: 0, 
                    left: 0,
                    zIndex: 1
                }}
            >
                {/* Light Dim Effect */}
                <div 
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)" // Light dim effect
                    }}
                ></div>
            </div>

            {/* Smaller Image */}
            <div 
                style={{
                    position: "absolute", 
                    top: "20px", 
                    left: "20px", 
                    width: "250px", 
                    height: "350px", 
                    backgroundImage: `url(http://127.0.0.1:8000${post.poster_image})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center",
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                    zIndex: 2
                }}
            ></div>

            {/* Overlay for Text and Button */}
            <div 
                style={{
                    position: "absolute", 
                    top: 0, 
                    left: "100px", 
                    right: 0, 
                    bottom: 0, 
                    padding: "20px",
                    zIndex: 3
                }}
            >
                <div style={{ marginLeft: "180px", paddingTop: "40px" }}>
                    <div style={{
                        fontSizeAdjust: "24px",
                        textShadow: "0 0 10px rgba(0, 0, 0, 0.7)"
                    }}>
                        <h1>{post.name}</h1>
                        <p style={{ fontSize: "15px" }}>{post.description}</p>
                        <p><b>{post.times}</b></p>
                        <p><b>{post.ticket_price}&#8377;</b></p>
                    </div>
                    <select
                        style={{ width: "130px" }}
                        className="form-control"
                        id="selectDate"
                        name="selectDate"
                        value={yourDate}
                        onChange={handleDateChange}
                    >
                        <option className="form-control" value="2024-05-13">May 13, 2024</option>
                        <option className="form-control" value="2024-05-14">May 14, 2024</option>
                        <option className="form-control" value="2024-05-15">May 15, 2024</option>
                    </select>
                    <Link
                        style={{ 
                            position: "absolute", 
                            left: "200px", 
                            bottom: "20px", 
                            backgroundColor: "red", 
                            color: "white", 
                            textDecoration: "none", 
                            padding: "10px 20px", 
                            borderRadius: "5px" 
                        }}
                        to={`/ticketbook/${post.id}?date=${yourDate}`}
                        className="btn-lg float-left"
                    >
                        <b>Book Ticket</b>
                    </Link>
                </div>
            </div>
        </div>
        <div className="container mt-5">
            <Slider {...settings}>
                {posts.map((item) => (
                    <div className="p-3" key={item.id}>
                        <Link to={`/views/${item.id}`}>
                            <div
                                className="card-lg"
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                style={{
                                    boxShadow: "0 0 10px rgb(0, 0, 0)",
                                    transition: "transform 0.3s ease",
                                    transform: hoveredItem === item.id ? "scale(1.05)" : "scale(1)"
                                }}
                            >
                                <div>
                                    <img
                                        className="card-img-top"
                                        src={`http://127.0.0.1:8000${item.poster_image}`}
                                        alt={item.times}
                                        style={{ width: "100%", height: "100%", borderRadius: "5px" }}
                                    />
                                </div>
                                <div className="card-img-overlay">
                                    <center><h5 className="card-title mb-0 text-white">{item.times}</h5></center>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    </div>
    );
}

export default CheckAuth(ViewDetail);


