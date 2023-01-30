import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import app from "./firebase.init";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const auth = getAuth(app);
function App() {
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordBlur = (e) => {
    setPassword(e.target.value);
  };
  const handleRegisteredChange = (e) => {
    setRegistered(e.target.checked);
  };
  const handleOnSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      setError(
        "Full-fill the requirements for password: an alphabet of both case, a number, a special character ,at least 8 character"
      );
      return;
    }

    setValidated(true);
    setError("");

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          const user = res.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          const user = res.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail();
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }

    event.preventDefault();
  };
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log('email verification sent')
    })
    .catch(error=>{
      console.log(error)
    })
  }
  const handleForgetPassword = () =>{
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Email sent to reset password')
    })
  }
  return (
    <div>
      <div className="registration w-50 mx-auto mt-2">
        <h1 className="text-info">
          Please {registered ? "Login" : "Register"}
        </h1>
        <Form noValidate validated={validated} onSubmit={handleOnSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please Provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please Provide a Valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already Registered?"
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button><br />
          {registered && <Button onClick={handleForgetPassword} variant="link">Forget Password?</Button>}
        </Form>
      </div>
    </div>
  );
}

export default App;
