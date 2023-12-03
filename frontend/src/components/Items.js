import { useEffect, useState} from "react"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import DeleteButton from "./DeleteButton";
import { useNavigate } from 'react-router-dom';
import {Fade}from "react-awesome-reveal";
import Slide from "react-awesome-reveal"
import './style.css'
import ParticlesBg from "particles-bg";
import Header from "./Header";

const Items = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
   

    const fetchData = async () => {
      try {
       const token = localStorage.getItem("token");
       console.log("Token:", token);
   
       const response = await fetch("http://localhost:8080/v1/item", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
   
       if (!response.ok) {
          const errorData = await response.json();
          navigate('/', { state: { error: `${errorData.message} Please Login` } });
          localStorage.removeItem("token");
          
       }
   
       const data = await response.json();
      setItems(data.data)
      } catch (error) {

        console.error("Fetch error:", error);
        // navigate('/', { state: { error: `${error}` } });
      }
    };

    
   
    useEffect(() => {
       fetchData();
    }, []);

    const handleAddStudentClick = () => {
      // Navigasi ke halaman form
      navigate("/v1/item/add");
  };
  
function CardStud(props){
  const handleUpdateStudClick = ()=>{
    navigate('/v1/item/update', {
      state: {
        id: props.id,
        name: props.name,
        stok: props.stok,
        price: props.price,
        entrydate: props.entrydate
      }
    });
    
  }
    return (
        <Card className="mb-4" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{props.name}</Card.Title>
            <Card.Text>
             <ul>
                <li>Stok: {props.stok}</li>
                <li>Price: {props.price}</li>
                <li>Date Entry: {props.entrydate}</li>
             </ul>
            </Card.Text>
            <Button variant="primary" onClick={handleUpdateStudClick}>Edit</Button>
         <DeleteButton id={props.id} />
          </Card.Body>
        </Card>
      );
}

  
return (
  <div className="full-height  content-container" >
      <Header/>
    <div className="container mt-4">
    <ParticlesBg type="circle" bg={true} /> 
   <Fade duration={3000}>
    <Button variant="primary"  onClick={handleAddStudentClick} >Add Item</Button>
    </Fade>
        <div className="row mt-4">
        {items.map((item)=>  {
            return (
                <div className="col-3">
                   <Slide left duration={1300}>
                <CardStud id={item.item_id} 
                name={item.item_name}
                stok={item.item_stok} 
                price={item.item_price}
                entrydate={item.item_date_entry} />
                </Slide >
                </div>
            )
        })}
        </div>
       
    </div>
    </div>
)
}




export default Items;