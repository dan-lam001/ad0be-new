import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Home"
import WinnersLogin from "./pages/WinnersLogin"
import Verified from "./pages/Verified"
import ImageGallery from "./pages/ImageGallery"
import Pdf from "./pages/Pdf"
import Login from "./pages/Login"
import DisputePage from "./pages/DisputePage"
import ReviewDocument from "./pages/ReviewDocument"
import CreditCardPage from "./pages/CreditCardPage"
import PhantomWalletPage from "./pages/PhantomWalletPage"

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<ReviewDocument />}/> */}
          {/* <Route path="/all-url" element={<Home />}/>
          <Route path="/Login" element={<Login />}/> */}
          <Route path="/" element={<Pdf />}/>
          {/* <Route path="/dispute" element={<DisputePage />}/> */}
          {/* <Route path="/member" element={<WinnersLogin />}/> */}
          <Route path="/verified" element={<Verified />}/>
          <Route path="/verified/photo-gallery" element={<ImageGallery />}/>
          {/* <Route path="/credit" element={<CreditCardPage />}/> */}
          {/* <Route path="/wallet" element={<PhantomWalletPage />}/> */}
          {/* <Route path="/fetch/info/history" element={<FetchData />}/> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
