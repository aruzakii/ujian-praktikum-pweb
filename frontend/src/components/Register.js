
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './style.css'
import ParticlesBg from "particles-bg";

const register = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      // Login berhasil
      const data = await response.json();
      const message = data.message
      // Simpan token di local storage
     alert(message)
    } else {
        const data = await response.json();
        const message = data.message
      alert(message);
    }

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[confirmpassword,setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleregister = async () => {
    if (confirmpassword !== password) {
        alert("Password Yang Anda Konfirmasi Salah")
    }
    else{
    try {
      const response = await register(username, password);
  
      if (response.ok) {
        // Register Berhasil
        navigate("/");
      } 
    } catch (error) {
      console.error("Error during login:", error);
    }
}
  };

  return (
    <div>
       <ParticlesBg type="circle" bg={true} /> 
    <div className="register-container">
      <h2 className='text-center'>Register</h2>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="input-field"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="input-field"
    />
      <input
      type="password"
      placeholder="Confirm Password"
      value={confirmpassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="input-field"
    />
    <button onClick={handleregister} className="login-button">
      Register
    </button>
    <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
      <p className='mt-3 text-center'>Login Now</p>
    </Link>
    
    {state && state.error && (
        <p className='text-center mt-4 regis' style={{ color: "red" }}>{state.error}</p>
      )}
  </div>
  
  </div>
  );
};


export default Register