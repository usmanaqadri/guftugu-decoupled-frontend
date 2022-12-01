import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import CheckIcon from "@mui/icons-material/Check";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Event() {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      width: "20em",
      maxHeight: "60vh",
      margin: "0 auto",
      padding: "20px",
      border: "none",
      borderRadius: "10px",
    },
  };

  Modal.setAppElement("#root");
  const [modalIsOpen, setModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [updatedEventInfo, setUpdatedEventInfo] = useState({
    name: "",
    desc: "",
    img: "",
    date: "",
    meetingCode: "",
    meetingPswd: "",
    meetingURL: "",
  });
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/event/${id}`)
      .then((res) => res.json())
      .then((data) => setEventInfo(data.foundEvent));
  }, [id]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setUpdatedEventInfo({
      name: "",
      desc: "",
      img: "",
      date: "",
      meetingCode: "",
      meetingPswd: "",
      meetingURL: "",
    });
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEventInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const reqBody = Object.fromEntries(
      Object.entries(updatedEventInfo).filter(([key, value]) => value !== "")
    );
    fetch(`${process.env.REACT_APP_API_SERVER}/event/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...reqBody }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        setEventInfo({ ...res });
        closeModal();
      });
  };

  const joinEvent = () => {
    const reqBody = [...user.myEvents, id];
    fetch(`${process.env.REACT_APP_API_SERVER}/user/${user.user}`, {
      method: "PUT",
      body: JSON.stringify({ myEvents: reqBody }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUser({
            user: data._id,
            name: data.name,
            myEvents: data.myEvents,
            myGroups: data.myGroups,
            isAdmin: data.isAdmin,
            loggedIn: true,
          });
        }
      });
  };
  const leaveEvent = async () => {
    const reqBody = user.myEvents.filter((event) => event !== id);
    fetch(`${process.env.REACT_APP_API_SERVER}/user/${user.user}`, {
      method: "PUT",
      body: JSON.stringify({ myEvents: reqBody }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUser({
            user: data._id,
            name: data.name,
            myEvents: data.myEvents,
            myGroups: data.myGroups,
            isAdmin: data.isAdmin,
            loggedIn: true,
          });
        }
      });
  };

  const handleDelete = async () => {
    await leaveEvent();
    fetch(`${process.env.REACT_APP_API_SERVER}/event/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        navigate("/event");
      });
  };
  return (
    <div className="event-page">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <header className="form-header">
          <h2>Edit Event</h2>
          <CloseOutlinedIcon
            className="close-button"
            onClick={() => closeModal()}
          />
        </header>
        <form className="form-large" id="update-event" onSubmit={handleUpdate}>
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type={"text"}
              name={"name"}
              id={"name"}
              placeholder={eventInfo.name}
              value={updatedEventInfo.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="desc">Description:</label>
            <input
              type={"text"}
              name={"desc"}
              id={"desc"}
              placeholder={eventInfo.desc}
              value={updatedEventInfo.desc}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="img">Image URL:</label>
            <input
              type={"text"}
              name={"img"}
              id={"img"}
              placeholder={eventInfo.img}
              value={updatedEventInfo.img}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="date">Date:</label>
            <input
              type={"datetime-local"}
              name={"date"}
              id={"date"}
              value={updatedEventInfo.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingCode">Meeting Code:</label>
            <input
              type={"text"}
              name={"meetingCode"}
              id={"meetingCode"}
              placeholder={eventInfo.meetingCode}
              value={updatedEventInfo.meetingCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingPswd">Meeting Password:</label>
            <input
              type={"text"}
              name={"meetingPswd"}
              id={"meetingPswd"}
              placeholder={eventInfo.meetingPswd}
              value={updatedEventInfo.meetingPswd}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingURL">Meeting URL:</label>
            <input
              type={"text"}
              name={"meetingURL"}
              id={"meetingURL"}
              placeholder={eventInfo.meetingURL}
              value={updatedEventInfo.meetingURL}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <button className="tertiary-button">Edit</button>
          </div>
        </form>
      </Modal>
      <h1>{eventInfo.name}</h1>
      <img src={eventInfo.img} alt={eventInfo.name} width="200px" />
      <h3>{eventInfo.desc}</h3>
      <h4>
        Date:{" "}
        {new Date(eventInfo.date).toLocaleDateString() +
          "\t" +
          new Date(eventInfo.date).toLocaleTimeString()}
      </h4>
      {user && (
        <div className="event-rsvp">
          {!user.myEvents.includes(id) ? (
            <button onClick={joinEvent}>RSVP to event</button>
          ) : (
            <>
              <p>
                You are registered for this event{" "}
                <CheckIcon sx={{ color: "green" }} />
              </p>
              <button className="secondary-button" onClick={leaveEvent}>
                LEAVE event
              </button>
            </>
          )}
        </div>
      )}
      {user && user.myEvents.includes(id) && (
        <>
          {" "}
          <h4>Meeting Code: {eventInfo.meetingCode}</h4>
          <h4>Password: {eventInfo.meetingPswd}</h4>
          <a href={eventInfo.meetingURL}>
            <h4 style={{ color: "blue" }}>Link to join</h4>
          </a>
        </>
      )}
      {user && user?.user === eventInfo?.organizer && (
        <div>
          <button
            style={{ margin: "10px" }}
            onClick={() => openModal()}
            className="tertiary-button"
          >
            Edit
          </button>
          <button
            style={{ margin: "10px" }}
            onClick={handleDelete}
            className="secondary-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default Event;
