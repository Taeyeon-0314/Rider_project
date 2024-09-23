import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { register } from "../../api/auth";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      const response = await register(formData);
      if (response) {
        toast.success("회원가입 성공!", {
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
      } else {
        toast.error("이미 존재하는 유저입니다.", {
          position: "top-left",
          autoClose: 3000
        });
      }
    }
  };

  return (
    <Container>
      <ToastContainer theme="dark" style={{ width: "260px", lineHeight: "1.4" }} />
      <Title>회원가입</Title>
      <AuthForm mode="signup" onSubmit={handleSignup} />
      <Text>
        이미 계정이 있으신가요? <StyledLink to="/login"> 로그인 바로가기</StyledLink>
      </Text>
    </Container>
  );
};

export default Signup;

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
