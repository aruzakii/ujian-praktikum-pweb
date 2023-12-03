import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import ParticlesBg from "particles-bg";
import { useNavigate, useLocation } from 'react-router-dom';

const update = async (id,name, stok, price, entrydate) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      const response = await fetch(`http://localhost:8080/v1/item/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          item_name: name,
          item_stok: parseInt(stok),
          item_price: parseInt(price),
          item_date_entry: entrydate
        }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
const UpdateItemFrom = () => {
  const [name, setName] = useState("");
  const [stok, setStok] = useState("");
  const [price, setPrice] = useState("");
  const [entrydate, setEntryDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleTokenCheck = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect ke halaman login jika token tidak ada
      navigate('/', { state: { error: 'not authorized Please Login' } });
    }
  };

  useEffect(() => {
    handleTokenCheck();
  }, []);

  // Setel nilai awal formulir menggunakan data dari state lokasi
  useEffect(() => {
    if (state) {
      setName(state.name);
      setStok(state.stok);
      setPrice(state.price);
      setEntryDate(state.entrydate);
    }
  }, [state]);

  const handleUpdate = async () => {
    const id = state.id
    try {
      const response = await update(id,name, stok, price, entrydate);

      if (response.ok) {
        // Add Success
        alert('Data Berhasil DiUpdate');
        navigate('/v1/item');
      } else if (response.status === 400) {
        // Unauthorized, token tidak valid
        alert('Data Gagal DiUpdate,Periksa Kolom Jangan Ada Yang Kosong');
      } else {
        const errorData = await response.json();
        navigate('/', { state: { error: `${errorData.message} Please Login` } });
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <Header />
      <ParticlesBg type="circle" bg={true} />
      <Form
        style={{
          width: '50%',
          backgroundColor:'white',
          margin: 'auto',
          marginTop: '50px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 className="text-center">Update Item Data</h3>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAge">
          <Form.Label>Stok</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter stok"
            name="stok"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAddress">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPhoneNumber">
          <Form.Label>Entry Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter entry date"
            name="entrydate"
            value={entrydate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdate}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UpdateItemFrom;
