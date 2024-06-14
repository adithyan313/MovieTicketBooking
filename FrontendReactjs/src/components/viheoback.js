import React from "react";

function Videback() {
    return( 
        <div id="video-container" style={{position:"relative", width:"100vw", height:"100vh", overflow:"hidden"}}>
        <video
          autoPlay
          loop
          muted
          id="background-video"
          style={{position:"absolute", top:"0", left:"0", width:"100%", height:"100%", objectFit:"cover"}}
        >
          <source src="/video/backvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
    );
}
export default Videback;