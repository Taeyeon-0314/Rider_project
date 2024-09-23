import { Link, useNavigate } from "react-router-dom";
import homeIcon from "../assets/homeIcon.svg";
import useUserStore from "../store/useUserStore";
import styled from "styled-components";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const { user, setUser } = useUserStore();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };
  return (
    <Container>
      <StyledHeader>
        <LogoContainer>
          <Link to="/" className="text-white hover:text-gray-400">
            <img src={homeIcon} alt="Home" className="w-30" />
          </Link>
        </LogoContainer>
        <UserGreeting>
          {user ? <p className="text-white text-lg">{`${user.nickname}님 안녕하세요!`}</p> : null}
        </UserGreeting>
        <NavContainer>
          {user ? (
            <>
              <StyledLink to="/home">지도보기</StyledLink>
              <StyledLink to="/feed">모아보기</StyledLink>
              <StyledLink to="/mypage">마이페이지</StyledLink>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </>
          ) : (
            <>
              <StyledLink to="/home">지도보기</StyledLink>
              <StyledLink to="/feed">모아보기</StyledLink>
              <StyledLink to="/signup" className="text-gray-400 hover:text-blue-400 underline">
                회원가입
              </StyledLink>
              <LoginButton to="/login">로그인</LoginButton>
            </>
          )}
        </NavContainer>
      </StyledHeader>
      <main>{children}</main>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  width: 100%;
  cursor: pointer;
`;

const StyledHeader = styled.header`
  padding: 2.25rem 2.5rem;
  background-color: black;
  display: flex;
  align-items: center;
  position: relative;
`;

const LogoContainer = styled.div`
  position: absolute;
  left: 2.5rem;
  display: flex;
  align-items: center;
`;

const UserGreeting = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  position: absolute;
  right: 2.5rem;
  display: flex;
  gap: 1.2rem;
  font-size: 0.875rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    color: gray;
  }
`;

const LogoutButton = styled.button`
  background-color: #ffffff;
  color: black;
  font-weight: normal;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: none;
  &:hover {
    filter: invert(1);
  }
`;

const LoginButton = styled(StyledLink)`
  background-color: white;
  color: gray;
  font-weight: normal;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  &:hover {
    filter: invert(1);
  }
`;
