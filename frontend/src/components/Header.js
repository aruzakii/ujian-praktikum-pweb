import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {  Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';


function Header() {
  const headerStyle = {
    backgroundColor: 'orange', // Warna latar belakang header
    padding: '15px', // Padding untuk memberi ruang di sekitar teks
  };

  return (
    <Navbar expand="lg" style={headerStyle}>
      <Container>
      <Link to="/v1/item" style={{ textDecoration: 'none', color: 'white' }}>
      <h3>TechnoSans Item Managemen</h3>
    </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          
          </Nav>
          <Nav>
           <LogoutButton/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}




export default Header;