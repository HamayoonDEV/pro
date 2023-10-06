import "./App.css";
import Home from "./compenets/Home/Home";
import Navbar from "./compenets/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Crypto from "./compenets/Crypto/Crypto";
import Login from "./compenets/Login/Login";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="login" exact element={<Login />} />
        <Route path="/" exact element={<Home />} />
        <Route path="crypto" exact element={<Crypto />} />
      </Routes>
    </div>
  );
}

export default App;
