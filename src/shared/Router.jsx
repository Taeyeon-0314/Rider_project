import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Mypage from "../pages/myPage/Mypage";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Feed from "../pages/feed/Feed";
import Layout from "../components/Layout";
import Landing from "../pages/landing/Landing";

// Layout을 적용할 때 사용하는 컴포넌트
const MainLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Layout을 적용할 라우트 설정 */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<Feed />} />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <Mypage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
