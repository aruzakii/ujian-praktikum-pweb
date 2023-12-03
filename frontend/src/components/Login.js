// import React from 'react'
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './style.css'
import ParticlesBg from "particles-bg";

const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8080/login", {
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
      const token = data.token;
      // Simpan token di local storage
      localStorage.setItem("token", token);
    } else {
      const data = await response.json()
      alert(data.message);
    }

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
  
      if (response.ok) {
        // Login berhasil
        navigate("/v1/item");
      } else {
        // Login gagal
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
       <ParticlesBg type="circle" bg={true} /> 
      <h1 className='text-center mt-5 judul'>TechnoSans Item</h1>
    <div className="login-container">
      <h2 className='text-center'>Login</h2>
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
    <button onClick={handleLogin} className="login-button">
      Login
    </button>
    <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
      <p className='mt-3 text-center'>Register Now</p>
    </Link>
    
    {state && state.error && (
        <p className='text-center mt-4' style={{ color: "red" }}>{state.error}</p>
      )}
  </div>
  
  </div>
  );
};


export default Login