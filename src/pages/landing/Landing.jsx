import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { scrollToTargetRef } from "../../utils/scrollToTargetRef";
import useLandingPage from "../../hooks/useLandingPage";
import landing_background from "../../assets/landing_background.png";
import downScroll from "../../assets/downScroll.png";
import landing_firstIcon from "../../assets/landing_firstIcon.png";
import landing_firstImg from "../../assets/landing_firstImg.png";
import landing_secondIcon from "../../assets/landing_secondIcon.png";
import landing_secondImg from "../../assets/landing_secondImg.png";
import TopButton from "../feed/TopButton";

const Landing = () => {
  const targetRef = useRef();
  const secondSectionRef = useRef();
  const navigate = useNavigate();
  const { success, fail, weatherIconURL } = useLandingPage();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  }, []);

  return (
    <>
      <LandingWrapper $image={landing_background}>
        <TopSection>
          <LandingTop>
            <p>
              <span>오늘 [</span>
              <img src={weatherIconURL} />
              <span>] 한데...</span>
            </p>
            <p>
              <span>[RIDERS] 어때? 🚴</span>
            </p>
            <RedirectButton onClick={() => navigate("/home")}>바로가기</RedirectButton>
            <DownScrollButton onClick={() => scrollToTargetRef(targetRef)}>
              <img src={downScroll} />
            </DownScrollButton>
          </LandingTop>
        </TopSection>
        <section ref={targetRef}>
          <LandingItemWrapper>
            <img src={landing_firstIcon} />
            <h3>지도로 자전거 길을 볼 수 있습니다.</h3>
            <p>원하는 자전거길을 검색하고, 근처 라이딩에 필요한 요소를 확인해보세요!</p>
            <LandingPageImg src={landing_firstImg} />
            <DownScrollButton onClick={() => scrollToTargetRef(secondSectionRef)}>
              <img src={downScroll} />
            </DownScrollButton>
          </LandingItemWrapper>
        </section>
        <HLine />
        <section ref={secondSectionRef}>
          <LandingItemWrapper>
            <img src={landing_secondIcon} />
            <h3>내가 간 곳을 모아볼 수 있습니다.</h3>
            <p>내가 라이딩한 코스를 기록하고, 확인해보세요!</p>
            <p>다른사람의 라이딩 코스도 확인 할 수 있습니다!</p>
            <LandingPageImg src={landing_secondImg} />
          </LandingItemWrapper>
        </section>
      </LandingWrapper>
      <TopButton />
    </>
  );
};

export default Landing;

const LandingWrapper = styled.div`
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 5%,
      rgba(0, 0, 0, 0.4) 7%,
      rgba(0, 0, 0, 0.6) 10%,
      rgba(0, 0, 0, 0.8) 15%,
      rgba(0, 0, 0, 0.95) 20%,
      rgba(0, 0, 0, 1) 100%
    ),
    url(${(props) => props.$image});
  background-repeat: repeat;
  background-size: contain;
  background-position: top;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0px;
`;

const TopSection = styled.section`
  margin-top: 100px;
  margin-bottom: 400px;
`;

const LandingTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 80px;
  font-weight: bold;
  color: white;
  gap: 50px;
  p {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const RedirectButton = styled.button`
  cursor: pointer;
  background-color: black;
  color: white;
  border: none;
  font-size: 25px;
  font-weight: bold;
  border-radius: 20px;
  width: 150px;
  padding: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: rgba(255, 255, 255, 0.16) 0px 10px 36px 0px, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px;
  }
`;

const DownScrollButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const LandingItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 30px;
  height: 100vh;
  h3 {
    font-size: 25px;
    font-weight: bold;
  }
  p {
    font-size: 16px;
    color: #d6d6d6;
  }
`;

const LandingPageImg = styled.img`
  object-fit: fill;
  width: 980px;
  height: 500px;
`;

const HLine = styled.hr`
  width: 80%;
`;
