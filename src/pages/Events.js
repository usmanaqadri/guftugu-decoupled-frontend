import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { UserContext } from "../UserContext";
import Card from "../components/Card";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Events() {
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
  const { user } = useContext(UserContext);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [newEventInfo, setNewEventInfo] = useState({
    name: "",
    desc: "",
    img: "",
    date: "",
    meetingCode: "",
    meetingPswd: "",
    meetingURL: "",
  });
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/event/`)
      .then((res) => res.json())
      .then((data) => setEvents([...data.events]));
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewEventInfo({
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
    setNewEventInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    let reqBody = Object.fromEntries(
      Object.entries(newEventInfo).filter(([key, value]) => value !== "")
    );

    try {
      fetch(`${process.env.REACT_APP_API_SERVER}/event`, {
        method: "POST",
        body: JSON.stringify({ ...reqBody, organizer: user.user }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          setEvents((prevState) => [...prevState, res]);
          closeModal();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <header className="form-header">
          <h2>Create Event</h2>
          <CloseOutlinedIcon
            className="close-button"
            onClick={() => closeModal()}
          />
        </header>
        <form className="form-large" id="create-event" onSubmit={handleCreate}>
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type={"text"}
              name={"name"}
              id={"name"}
              placeholder={"Enter name for group"}
              value={newEventInfo.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="desc">Description:</label>
            <input
              type={"text"}
              name={"desc"}
              id={"desc"}
              placeholder={"Enter a description for group"}
              value={newEventInfo.desc}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="img">Image URL:</label>
            <input
              type={"text"}
              name={"img"}
              id={"img"}
              placeholder={"Leave blank for generic image"}
              value={newEventInfo.img}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="date">Date:</label>
            <input
              type={"datetime-local"}
              name={"date"}
              id={"date"}
              value={newEventInfo.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingCode">Meeting Code:</label>
            <input
              type={"text"}
              name={"meetingCode"}
              id={"meetingCode"}
              placeholder={"Zoom Meeting Code"}
              value={newEventInfo.meetingCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingPswd">Meeting Password:</label>
            <input
              type={"text"}
              name={"meetingPswd"}
              id={"meetingPswd"}
              placeholder={"Zoom Meeting Password"}
              value={newEventInfo.meetingPswd}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="meetingURL">Meeting URL:</label>
            <input
              type={"text"}
              name={"meetingURL"}
              id={"meetingURL"}
              placeholder={"Zoom Meeting URL"}
              value={newEventInfo.meetingURL}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <button className="create-button">Create</button>
          </div>
        </form>
      </Modal>
      <div className="group-header">
        <h1>Events</h1>
        {user && (
          <button className="create-button" onClick={() => openModal()}>
            New Event
          </button>
        )}
      </div>
      <div className="group-grid">
        {events.map((event) => (
          <>
            <Card
              key={event._id}
              cardId={event._id}
              title={event.name}
              link={`/event/${event._id}`}
              imgUrl={event.img}
              desc={event.desc}
              type={"Event"}
            />
          </>
        ))}
      </div>
    </>
  );
}

export default Events;
