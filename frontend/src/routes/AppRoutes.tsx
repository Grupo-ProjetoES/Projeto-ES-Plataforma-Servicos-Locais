import {Route, Routes} from "react-router-dom";
import Login from "../pages/Login.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/Register.tsx";


function AppRoutes() {
  return <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/home' element={<Home/>}/>
  </Routes>
}

export default AppRoutes;
