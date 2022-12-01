import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Navbar() {
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
  const [renderLogin, setRenderLogin] = useState();
  const [modalIsOpen, setModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [loginInfo, setLoginInfo] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setLoginInfo({
      name: "",
      username: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const type = e.target.id.split("-")[0];

    try {
      fetch(`${process.env.REACT_APP_API_SERVER}/${type}`, {
        method: "POST",
        body: JSON.stringify({ ...loginInfo }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.created || res.loggedIn) {
            setUser(res);
            closeModal();
          } else {
            window.location.reload();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };
  return (
    <header>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {renderLogin ? (
          <>
            <header className="form-header">
              <h2>Log In</h2>
              <CloseOutlinedIcon
                className="close-button"
                onClick={() => closeModal()}
              />
            </header>
            <form id="signin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="email">Email:</label>

                <input
                  type="email"
                  name={"email"}
                  placeholder={"Email"}
                  id={"email"}
                  onChange={handleChange}
                  value={loginInfo.email}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name={"password"}
                  placeholder={"Password"}
                  id={"password"}
                  onChange={handleChange}
                  value={loginInfo.password}
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <button>Login</button>
              </div>
            </form>
            <div className="form-footer">
              <p>New to Guftugu?</p>
              <button
                onClick={() => {
                  setRenderLogin(false);
                }}
              >
                Sign up!
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="form-header">
              <h2>Register</h2>
              <CloseOutlinedIcon
                className="close-button"
                onClick={() => closeModal()}
              />
            </header>
            <p>
              By continuing, you agree to our User Agreement and Privacy Policy.
            </p>
            <form
              className="form-large"
              id="register-form"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  name={"name"}
                  placeholder={"Name"}
                  id={"name"}
                  onChange={handleChange}
                  value={loginInfo.name}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name={"username"}
                  placeholder={"Username"}
                  id={"username"}
                  onChange={handleChange}
                  value={loginInfo.username}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name={"email"}
                  placeholder={"Email"}
                  id={"email"}
                  onChange={handleChange}
                  value={loginInfo.email}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name={"password"}
                  placeholder={"Password"}
                  id={"password"}
                  onChange={handleChange}
                  value={loginInfo.password}
                  required
                />
              </div>
              <div className="form-row">
                <button>Sign Up</button>
              </div>
            </form>
          </>
        )}
      </Modal>
      <nav className="my-navbar">
        <Link className="logo" to="/">
          <h1>گفتگو</h1>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about-us">About</Link>
          <Link to="/group">Groups</Link>
          <Link to="/event">Events</Link>
          <Link to="/get-involved">Get Involved</Link>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button
                onClick={() => {
                  setRenderLogin(false);
                  openModal();
                }}
              >
                Sign Up
              </button>

              <button
                onClick={() => {
                  setRenderLogin(true);
                  openModal();
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
