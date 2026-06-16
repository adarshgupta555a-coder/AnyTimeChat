import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ChatPage from "./pages/Chatroom"
import {ToastContainer} from "react-toastify"

function App() {

  return (
    <>
    <BrowserRouter>
          <ToastContainer/>

    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/chatroom" element={<ChatPage/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
