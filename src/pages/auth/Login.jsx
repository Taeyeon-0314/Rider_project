import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { getUserProfile, login } from "../../api/auth";
import useUserStore from "../../store/useUserStore";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useUserStore(); // Zustand store에서 setUser 가져오기

  const handleLogin = async (formData) => {
    try {
      const loginData = await login(formData);
      // Zustand 상태와 localStorage 모두에 저장
      setAccessToken(loginData.accessToken);
      localStorage.setItem("accessToken", loginData.accessToken);

      const userProfile = await getUserProfile(loginData.accessToken);
      setUser(userProfile);

      navigate("/home");
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center mt-40 space-y-10">
      <h1 className="text-3xl text-center">로그인</h1>
      <AuthForm mode="login" onSubmit={handleLogin} />
      <p className="text-sm">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="text-gray-400 hover:text-blue-400 underline">
          회원가입 바로가기
        </Link>
      </p>
    </div>
  );
};

export default Login;
