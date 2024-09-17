import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Mypage from "../pages/myPage/Mypage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/mypage" element={<Mypage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
