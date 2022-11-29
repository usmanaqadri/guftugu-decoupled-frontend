import { useEffect } from "react"; // Use effect is a hook that tells react your component needs to do something after it renders instead of just setting it and forgetting it. We can use this instead of making two function for setting a state and updating that state.
import { useNavigate } from "react-router-dom"; // react router allows you to use a react app like a multi page app instead of multiple components. With use navigate, you can use navigate to bring the client to the specific page.
import { useCookies } from "react-cookie"; // another node package that can help set cookies and use them in your react app. We will need this because cookies are what makes our authentication work in our react app.
import axios from "axios"; // axios is another npm package that sends requests to routes a lot easier and also is easier to write CRUD operations--similar to fetch

export default function Verification() {
  const navigate = useNavigate(); // variable that allows us to navigate REST routes
  const [cookies, setCookie, removeCookie] = useCookies([]); // variable that defines our cookie and calls the use cookies hook in react cookie. This hook returns the cookies object to determine what priveleges the user has on the app. SetCookie sets the cookie and keeps it there until it expires or is removed. Remove cookie will also remove the cookie if need be
  useEffect(() => {
    // use effect hook to be used in our app
    const verifyUser = async () => {
      //verify user function that is going to run asynchronously and verify our jwt token and what priveleges that token has
      if (!cookies.jwt) {
        // if the cookies object has no jwt token
        navigate("/Signin"); // navigate to sign in page
      } else {
        // otherwise
        const { data } = await axios.post(
          // post route to our backend port that has all our data
          process.env.NODE_ENV === "development"
            ? `http://localhost:${process.env.REACT_APP_BACKEND_PORT}`
            : "https://student-dashboards.herokuapp.com/",
          {}, // returning an empty object here because we don't want to send anything to the server via the post route
          { withCredentials: true } // with credentials is a boolean value that if true will allow the user to go accross the site with the cookie they generated
        );
        if (!data.status) {
          // we defined our response statuses in the controller. They show us if a user was created or found. If none of these statuses are found in the response
          removeCookie("jwt"); // remove the jwt token from the cookie
          navigate("/Signin"); // navigate to the sign in page
        }
      }
    };
    verifyUser(); // run the verify user function when this react function is called
  }, [cookies, navigate, removeCookie]); // after everything is rendered, keep the cookies object, navigate function and remove cookie function in our state
}
