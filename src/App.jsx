import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WinnersLogin from "./WinnersLogin"
import Verified from "./Verified"
import ImageGallery from "./ImageGallery"
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<WinnersLogin />}/>
          <Route path="/verified" element={<Verified />}/>
          <Route path="/verified/photo-gallery" element={<ImageGallery />}/>
          {/* <Route path="/fetch/info/history" element={<FetchData />}/> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
