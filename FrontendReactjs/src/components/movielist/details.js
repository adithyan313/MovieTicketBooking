import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function Postlistmovie(props) {
  const [hovered, setHovered] = useState(false); 

  
  /*const cardStyle = {
    width: '300x',
    height: '370px',
    boxShadow: '0 0 10px rgb(0, 0, 0)',
    transition: 'transform 0.3s ease', // Add transition for smooth effect
    transform: hovered ? 'scale(1.05)' : 'scale(1)', // Scale on hover
  };*/

    return (
      <div>
      <Link to={`/views/${props.post.id}`}>
        <div
          className="card-lg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '300x',
    height: '370px',
    boxShadow: '0 0 10px rgb(0, 0, 0)',
    transition: 'transform 0.3s ease', // Add transition for smooth effect
    transform: hovered ? 'scale(1.05)' : 'scale(1)', // Scale on hover
          }} 
          
        >
          <img
            className="card-img-top"
            src={`http://127.0.0.1:8000${props.post.poster_image}`}
            alt="ok" style={{width:"100%", height:"100%", borderRadius:"5px"}}
          />
          <div className="card-img-overlay">
            <center>
              <h4 className="card-text text-white">{props.post.times}</h4>
            </center>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Postlistmovie;

