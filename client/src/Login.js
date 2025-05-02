import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import { useNavigate, Link } from 'react-router-dom';

const Login = (props) => {
    const [user, setUser] = useState('');
    const [newUser, setNewUser] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleUserSubmit = (e) => {
        e.preventDefault();
        const errorEl = document.getElementById("error-message");
        errorEl.innerText = "";  // clear any previous error
      
        const payload = { user, password };
      
        fetch('/login', {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          // parse JSON & carry status along
          .then(res =>
            res.json().then(json => ({ status: res.status, body: json }))
          )
          .then(({ status, body }) => {
            if (status >= 400) {
              // backend put the message under data.error
              const msg = body.data?.error || "An unknown error occurred.";
              errorEl.innerText = msg;
            } else {
              props.setUserInfo(body.data);
              // success → redirect
              navigate('/');
            }
          })
          .catch(err => {
            console.error("Login fetch failed:", err);
            errorEl.innerText = "Network error. Please try again.";
          });
      };

      const handleNewUserSubmit = (e) => {
        e.preventDefault();
        const errorEl = document.getElementById("error-message");
        if (errorEl) errorEl.innerText = "";  // clear previous
      
        const payload = { newUser, newPassword };
      
        fetch('/create', {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          // parse JSON & carry status
          .then(res =>
            res.json().then(json => ({ status: res.status, body: json }))
          )
          .then(({ status, body }) => {
            if (status >= 400) {
              // show backend’s error (data.error)
              const msg = body.data?.error || "Something went wrong.";
              if (errorEl) errorEl.innerText = msg;
            } else {
              props.setUserInfo(body.data);
              // success!
              navigate('/');
            }
          })
          .catch(err => {
            console.error("Signup fetch failed:", err);
            if (errorEl) errorEl.innerText = "Network error. Please try again.";
          });
      };

    return (
        <div className="login-container">
            <Container className='login-form-container'>
                <Row className="login-welcome">
                    <Col>
                        <img src="/styling_images/logo2.png" alt="logo" className='login-logo'></img>
                        <p>Log in or create an account to get started.</p>
                        <p id='error-message'></p>
                    </Col>
                </Row>
                <Row className='login-form-row'>
                    <Col className='login-form-col'>
                        <Form onSubmit={handleUserSubmit} className='login-form'>
                            <h4>Existing Users</h4>
                            <Form.Group className='mb-3'>
                                <Form.Label>Enter your username</Form.Label>
                                <Form.Control 
                                    id='username'
                                    type='text' 
                                    placeholder='username' 
                                    name='user'
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Enter your password</Form.Label>
                                <Form.Control 
                                    id='password'
                                    type='password' 
                                    placeholder='password' 
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button type='submit' variant='dark'>Submit</Button>
                        </Form>
                    </Col>
                    <Col className='login-form-col'>
                        <Form onSubmit={handleNewUserSubmit} className='login-form'>
                            <h4>New Users</h4>
                            <Form.Group className='mb-3'>
                                <Form.Label>Create a new username</Form.Label>
                                <Form.Control
                                    id='new_username'
                                    type='text' 
                                    placeholder='username' 
                                    name='new_user'
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Create a password</Form.Label>
                                <Form.Control 
                                    id='new_password'
                                    type='password' 
                                    placeholder='password' 
                                    name='new_password'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button type='submit' variant='dark'>Create Account</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    );
}
 
export default Login;