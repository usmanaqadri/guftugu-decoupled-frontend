import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { UserContext } from "../UserContext";
import Card from "../components/Card";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Groups() {
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
  const [newGroupInfo, setNewGroupInfo] = useState({
    name: "",
    desc: "",
    img: "",
  });
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/group/`)
      .then((res) => res.json())
      .then((data) => setGroups([...data.group]));
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewGroupInfo({
      name: "",
      desc: "",
      img: "",
    });
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGroupInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    try {
      fetch(`${process.env.REACT_APP_API_SERVER}/group`, {
        method: "POST",
        body: JSON.stringify({ ...newGroupInfo }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          setGroups((prevState) => [...prevState, res]);
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
          <h2>Create Group</h2>
          <CloseOutlinedIcon
            className="close-button"
            onClick={() => closeModal()}
          />
        </header>
        <form id="create-group" onSubmit={handleCreate}>
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type={"text"}
              name={"name"}
              id={"name"}
              placeholder={"Enter name for group"}
              value={newGroupInfo.name}
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
              value={newGroupInfo.desc}
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
              placeholder={"Share image URL"}
              value={newGroupInfo.img}
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
        <h1>Groups</h1>
        {user && user.isAdmin && (
          <button className="create-button" onClick={() => openModal()}>
            New Group
          </button>
        )}
      </div>
      <div className="group-grid">
        {groups.map((group) => (
          <Card
            key={group._id}
            cardId={group._id}
            title={group.name}
            link={`/group/${group._id}`}
            imgUrl={group.img}
            desc={group.desc}
            type={"Group"}
          />
        ))}
      </div>
    </>
  );
}

export default Groups;
