import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = async ()=>{
        navigate('/');
        localStorage.removeItem("token");
    }
  return (
    <Button variant="danger" onClick={handleLogout} >Logout</Button>
  )
}

export default LogoutButton