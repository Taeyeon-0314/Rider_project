import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { getUserProfile, login } from "../../api/auth";
import useUserStore from "../../store/useUserStore";
import styled from "styled-components";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useUserStore();

  const handleLogin = async (formData) => {
    try {
      const loginData = await login(formData);
      setAccessToken(loginData.accessToken);
      const userProfile = await getUserProfile();
      setUser(userProfile);

      navigate("/home");
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <Container>
      <Title>로그인</Title>
      <AuthForm mode="login" onSubmit={handleLogin} />
      <Text>
        계정이 없으신가요? <StyledLink>회원가입 바로가기</StyledLink>
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
