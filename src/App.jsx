import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/users/Home'
import Register from './pages/Register'
import Payment from './pages/users/Payment'
import Shop from './pages/users/Shop'
import Product from './pages/users/Product'
import Category from './pages/users/Category'
import About from './pages/users/About'
import ChangePassword from './pages/users/ChangePassword'
import Contact from './pages/users/Contact'
import NotFound from './pages/NotFound'
import AddProduct from './pages/admin/Addproduct'
import ViewProducts from './pages/admin/Viewproducts'
import Customers from './pages/admin/Customers'
import Dashboard from './pages/admin/Dashboard'
import Logout from './pages/Logout'
import Stock from './pages/admin/Stock'
import StockHistory from './pages/admin/StockHistory'
import Cart from './pages/users/Cart'
import LoadingTransition from './pages/users/components/LoadingTransition'
import Profile from './pages/users/Profile'
import Orders from './pages/users/Orders'

function App() {


  return (
    <>
      <Routes>
        <Route path='/category' element={<Category/>}/>
       </Routes>
<LoadingTransition />
 <Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/collections' element={<Shop/>}/>
  <Route path='/register' element={<Register/>}/>
  <Route path='/payment' element={<Payment/>}/>
  <Route path='/contact' element={<Contact/>}/>
  <Route path='/profile' element={<Profile/>}/>
  <Route path='/About' element={<About/>}/>
   <Route path='/change-password' element={<ChangePassword/>}/>
  
  <Route path="/collections/:id" element={<Product/>} />
  <Route path="/cart" element={<Cart/>} />
  <Route path="/orders" element={<Orders/>} />
  <Route path="/dashboard" element={<Dashboard/>} />
  <Route path="/add-products" element={<AddProduct/>} />
  <Route path="/view-products" element={<ViewProducts/>} />
  <Route path="/view-customers" element={<Customers/>} />
  <Route path="/stock-management" element={<Stock/>} />
  <Route path="/stock-history" element={<StockHistory/>} />
  <Route path="/logout" element={<Logout/>} />
  <Route path="*" element={<NotFound/>} />


 </Routes>
</>
  )
}

export default App
