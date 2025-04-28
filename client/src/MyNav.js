import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Navigate } from 'react-router-dom'

const MyNav = (props) => {
  const term= props.term
  const user = props.user

  return (  
    <Navbar sticky='top' className={`top-bar ${term === 'home' ? 'home' : 'learn-quiz'}`}>
      <Container fluid>
        <Navbar.Brand href="/">
          <img src='/styling_images/logo.png' className='navbar-logo'></img>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
 
export default MyNav;