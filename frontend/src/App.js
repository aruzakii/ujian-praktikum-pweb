import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes, Router, Switch } from 'react-router-dom';
import Register from './components/Register';
import Items from './components/Items';
import AddItemForm from './components/AddItemForm';
import UpdateItemFrom from './components/UpdateItemFrom';






function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/register' element={<Register />}/>
      <Route exact path="/" element={<Login />} />
      <Route  path="/v1/item" element={<Items />} />
      <Route  path="/v1/item/add" element={<AddItemForm />} />
      <Route path='/v1/item/update' element={<UpdateItemFrom />}/>
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
