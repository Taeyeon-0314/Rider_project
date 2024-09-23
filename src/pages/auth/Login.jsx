import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { getUserProfile, login } from "../../api/auth";
import useUserStore from "../../store/useUserStore";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useUserStore();

  const handleLogin = async (formData) => {
    try {
      const response = await login(formData);
      if (response) {
        setAccessToken(response.accessToken);
        const userProfile = await getUserProfile();
        setUser(userProfile);

        toast.success("로그인 성공!", {
          position: "top-left",
          autoClose: 3000
        });
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(<>{error.response.data.message}</>, {
          position: "top-left",
          autoClose: 3000
        });
      }
    }
  };
  return (
    <Container>
      <ToastContainer theme="dark" style={{ width: "260px", lineHeight: "1.4" }} />
      <Title>로그인</Title>
      <AuthForm mode="login" onSubmit={handleLogin} />
      <Text>
        계정이 없으신가요? <StyledLink to="/signup">회원가입 바로가기</StyledLink>
      </Text>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  gap: 2.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  text-align: center;
`;

const Text = styled.p`
  font-size: 0.875rem;
`;

const StyledLink = styled(Link)`
  color: gray;
  &:hover {
    color: #3b82f6;
  }
  text-decoration: underline;
  text-underline-offset: 4px;
`;
