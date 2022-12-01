import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckIcon from "@mui/icons-material/Check";

function Group() {
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
  const { user, setUser } = useContext(UserContext);
  const [groupInfo, setGroupInfo] = useState({});
  const [updatedGroupInfo, setUpdatedGroupInfo] = useState({
    desc: "",
    img: "",
    name: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/group/${id}`)
      .then((res) => res.json())
      .then((data) => setGroupInfo(data.foundGroup));
  }, [id]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGroupInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const reqBody = Object.fromEntries(
      Object.entries(updatedGroupInfo).filter(([key, value]) => value !== "")
    );
    fetch(`${process.env.REACT_APP_API_SERVER}/group/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...reqBody }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        setGroupInfo({ ...res });
        setUpdatedGroupInfo({
          desc: "",
          img: "",
          name: "",
        });
        closeModal();
      });
  };

  const handleJoin = () => {
    const reqBody = [...user.myGroups, id];
    fetch(`${process.env.REACT_APP_API_SERVER}/user/${user.user}`, {
      method: "PUT",
      body: JSON.stringify({ myGroups: reqBody }),
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

  const handleLeave = async () => {
    const reqBody = user.myGroups.filter((group) => group !== id);
    fetch(`${process.env.REACT_APP_API_SERVER}/user/${user.user}`, {
      method: "PUT",
      body: JSON.stringify({ myGroups: reqBody }),
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
    await handleLeave();
    fetch(`${process.env.REACT_APP_API_SERVER}/group/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        navigate("/group");
      });
  };

  return (
    <>
      <div className="group-page">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <header className="form-header">
            <h2>Edit Group</h2>
            <CloseOutlinedIcon
              className="close-button"
              onClick={() => closeModal()}
            />
          </header>
          <form id="update-group" onSubmit={handleUpdate}>
            <div className="form-row">
              <label htmlFor="name">Name:</label>
              <input
                type={"text"}
                name={"name"}
                id={"name"}
                placeholder={groupInfo.name}
                value={updatedGroupInfo.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="desc">Description:</label>
              <input
                type={"text"}
                name={"desc"}
                id={"desc"}
                placeholder={groupInfo.desc}
                value={updatedGroupInfo.desc}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="img">Image URL:</label>
              <input
                type={"text"}
                name={"img"}
                id={"img"}
                placeholder={groupInfo.img}
                value={updatedGroupInfo.img}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <button className="tertiary-button">Edit</button>
            </div>
          </form>
        </Modal>
        <h1>{groupInfo.name}</h1>
        <img src={groupInfo.img} alt={groupInfo.name} width="300px" />
        <p>{groupInfo.desc}</p>
        {user && user.isAdmin && (
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
        {user && (
          <div className="event-rsvp">
            {!user.myGroups.includes(id) ? (
              <button onClick={handleJoin}>Join Group</button>
            ) : (
              <>
                <p>
                  You are now part of the group{" "}
                  <CheckIcon sx={{ color: "green" }} />
                </p>
                <button className="secondary-button" onClick={handleLeave}>
                  Leave Group
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {/* <div>
        <h2>Upcoming Events:</h2>
      </div> */}
    </>
  );
}

export default Group;
