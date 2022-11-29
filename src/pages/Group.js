import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
  const { user } = useContext(UserContext);
  const [groupInfo, setGroupInfo] = useState({});
  const [updatedGroupInfo, setUpdatedGroupInfo] = useState({
    desc: "",
    img: "",
    name: "",
  });
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3009/group/${id}`)
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
      Object.entries(updatedGroupInfo).filter(([key, value]) => value != "")
    );
    fetch(`http://localhost:3009/group/${id}`, {
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
          <button onClick={() => openModal()} className="tertiary-button">
            Edit
          </button>
        )}
      </div>
      <div>
        <h2>Upcoming Events:</h2>
      </div>
    </>
  );
}

export default Group;
