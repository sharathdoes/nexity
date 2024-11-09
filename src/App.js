
import './App.css';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Login from './Pages/Login/login';
import Signup from './Pages/Register/signup';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useSelector } from 'react-redux';
import Resetpassword from './Pages/Resetpassword/Resetpassword';
import Verifyemail from './Pages/VerifyEmail/Verifyemail';
import Forgotpassword from './Pages/Forgotpassword/Forgotpassword';
import { useState } from "react";
import { AppContext, socket } from "./context/appContext";
import Chat from "./Pages/chat/chat"
function App() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails?.user
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  return (
    <div className="App">
              <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, rooms, setRooms, newMessages, setNewMessages }}>

    <BrowserRouter>
    <Routes>
        <Route path="/" element={ user?.other?.verifed === true ? <Home/> : <Navigate to={"/login"} replace={true}/>}></Route>
        <Route path="/Profile/:id" element={<Profile />}></Route>
        <Route path="/login" element={ user?.other?.verifed === true ? <Navigate to={"/"} replace={true}/> : <Login />}></Route>
        <Route path="/signup" element={   <Signup />}></Route>
        <Route path="/chat" element={   <Chat />}></Route>
        <Route path="/verify/email" element={user?.Status === 'Pending' ? <Verifyemail/> : user?.other?.verifed === true ? <Navigate to={"/"} replace={true}/> : <Login/>}></Route>
        <Route path="/forgot/password" element={<Forgotpassword/>}></Route>
        <Route path="/reset/password" element={<Resetpassword/>}></Route>
         
    </Routes>
  </BrowserRouter>
  </AppContext.Provider>
    </div>
  );
}

export default App;
