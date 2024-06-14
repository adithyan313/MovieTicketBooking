import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CheckAdminAuth from "../auth/admin/checkadmin";
import Navbar from "../navebar";

function CreateData() {
  const user = useSelector((store) => store.auth.user);

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [ticket, setTicket] = useState("");
  const [poster, setPoster] = useState(null); // Change to File
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);

  function addpost() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("times", time);
    formData.append("ticket_price", ticket);
    if (poster) {
      formData.append("poster_image", poster); // File
    }
    formData.append("description", description);
    formData.append("is_active", active);

    axios.post(
      "http://127.0.0.1:8000/movies/add/",
      formData,
      {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      }
    )
      .then((response) => {
        alert("Movie created successfully!");
      })
      .catch((error) => {
        console.error("Error adding post:", error);
      });
  }

  return (
    <div>
      <Navbar/>
      <div className="container">
        <div className="row justify-content-center align-item-center">
          <div className="col-md-6">
            <div className="border order rounded p-4">
              <h1 className="text-center">Create Post</h1>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="MovieName"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  placeholder="Time"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  value={ticket}
                  onChange={(event) => setTicket(event.target.value)}
                  placeholder="TicketsPrice"
                />
              </div>
              <div className="form-group">
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => setPoster(event.target.files[0])}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  rows="4"
                  cols="50"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Deiscription"
                />
              </div>
              <div className="form-group">
                <input
                  type="checkbox"
                  checked={active} 
                  onChange={(event) => setActive(event.target.checked)}
                />
                <label>Active</label>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-primary form-control"
                  onClick={addpost}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckAdminAuth(CreateData);
