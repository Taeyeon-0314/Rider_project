import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import { register } from "../../api/auth";
import styled from "styled-components";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      const response = await register(formData);
      alert("회원가입에 완료했습니다. 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <AuthForm mode="signup" onSubmit={handleSignup} />
      <Text>
        이미 계정이 있으신가요? <StyledLink> 로그인 바로가기</StyledLink>
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
