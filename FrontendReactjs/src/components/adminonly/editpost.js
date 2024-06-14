/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function EditMovie() {
  const { movieid } = useParams();  
  
  const user = useSelector((store) => store.auth.user);
  
  const [Moviedata, setMoviedata] = useState({
    name: "",
    times: "",
    ticket_price: "",
    poster_image: null,
    description: "",
    is_active: false,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/editmovie/list/${movieid}`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setMoviedata(response.data);
      })
      .catch((error) => {
        setError("Failed to list movie data.");
      });
  }, [movieid, user.token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target; 
    setMoviedata((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    setMoviedata((prevData) => ({
      ...prevData,
      poster_image: file,
    }));
  };

  const updateMovie = () => {
    const formData = new FormData();

    formData.append("name", Moviedata.name);
    formData.append("times", Moviedata.times);
    formData.append("ticket_price", Moviedata.ticket_price);
    formData.append("description", Moviedata.description);
    formData.append("is_active", Moviedata.is_active);
    if (Moviedata.poster_image) {
      formData.append("poster_image", Moviedata.poster_image);
    }

    axios
      .put(`http://127.0.0.1:8000/movies/edit/${movieid}/`, formData, {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Movie updated successfully");
      })
      .catch((error) => {
        setError("Failed to update movie. Please check your input.");
      });
  };

  return (
    <div className="container">
      <h2>Edit Movie</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="name"
          value={Moviedata.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="times"
          value={Moviedata.times}
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          className="form-control"
          name="ticket_price"
          value={Moviedata.ticket_price}
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange} // Corrected
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-control"
          name="description"
          value={Moviedata.description}
          onChange={handleInputChange} // Corrected
        />
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          name="is_active"
          checked={Moviedata.is_active} // Corrected
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <button
          className="btn btn-primary"
          onClick={updateMovie} // Corrected
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditMovie;*/
/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function EditMovie() {
  const { movieid } = useParams();  
  const navigate = useNavigate(); // To redirect if needed

  const user = useSelector((store) => store.auth.user);
  
  const [Moviedata, setMoviedata] = useState({
    name: "",
    times: "",
    ticket_price: "",
    poster_image: null,
    description: "",
    is_active: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      navigate("/login"); // Redirect to login if user is not available
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/editmovie/list/${movieid}`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setMoviedata(response.data);
        setLoading(false); // Data fetched, no longer loading
      })
      .catch((error) => {
        setError("Failed to list movie data.");
        setLoading(false); // Error occurred, no longer loading
      });
  }, [movieid, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMoviedata((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMoviedata((prevData) => ({
      ...prevData,
      poster_image: file,
    }));
  };

  const updateMovie = () => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();

    formData.append("name", Moviedata.name);
    formData.append("times", Moviedata.times);
    formData.append("ticket_price", Moviedata.ticket_price);
    formData.append("description", Moviedata.description);
    formData.append("is_active", Moviedata.is_active);
    if (Moviedata.poster_image) {
      formData.append("poster_image", Moviedata.poster_image);
    }

    axios
      .put(`http://127.0.0.1:8000/movies/edit/${movieid}/`, formData, {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Movie updated successfully");
      })
      .catch((error) => {
        setError("Failed to update movie. Please check your input.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Edit Movie</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="name"
          value={Moviedata.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="times"
          value={Moviedata.times}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          className="form-control"
          name="ticket_price"
          value={Moviedata.ticket_price}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-control"
          name="description"
          value={Moviedata.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          name="is_active"
          checked={Moviedata.is_active}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary" onClick={updateMovie}>
          Save
        </button>
      </div>
    </div>
  );
}

export default EditMovie;*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckAdminAuth from "../auth/admin/checkadmin";
import Navbar from "../navebar";

const EditMovie = () => {
  const { movieid } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [movieData, setMovieData] = useState({
    name: "",
    times: "",
    ticket_price: "",
    poster_image: null,
    description: "",
    is_active: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/editmovie/list/${movieid}`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setMovieData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to retrieve movie data.");
        setLoading(false);
      });
  }, [movieid, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMovieData((prevData) => ({
      ...prevData,
      poster_image: file,
    }));
  };

  const updateMovie = async () => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", movieData.name);
    formData.append("times", movieData.times);
    formData.append("ticket_price", movieData.ticket_price);
    formData.append("description", movieData.description);
    formData.append("is_active", movieData.is_active);

    if (movieData.poster_image) {
      formData.append("poster_image", movieData.poster_image);
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/movies/edit/${movieid}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Movie updated successfully");
      navigate('/cruedadmin')

    } catch (err) {
      setError("Failed to update movie. Please check your input.");
      alert("You are not allowed to edit this post.")
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar/>
    <div className="container mt-5">
    <div className="row row justify-content-center align-item-center">
    <div className="col-md-6">
            <div className="border order rounded p-4">
      <center><h2>Edit Movie</h2></center>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="name"
          value={movieData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="times"
          value={movieData.times}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          className="form-control"
          name="ticket_price"
          value={movieData.ticket_price}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-control"
          name="description"
          value={movieData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          name="is_active"
          checked={movieData.is_active}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary form-control" onClick={updateMovie}>
          Save
        </button>
      </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default CheckAdminAuth(EditMovie);


