import { useEffect, useState } from "react";
import styled from "styled-components";

const TopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  return (
    showButton && (
      <ScrollContainer>
        <Button onClick={scrollToTop}>∧</Button>
      </ScrollContainer>
    )
  );
};

export default TopButton;

const ScrollContainer = styled.div`
  position: fixed;
  right: 5%;
  bottom: 5%;
  z-index: 1;
`;

const Button = styled.button`
  font-weight: bold;
  font-size: 20px;
  padding: 15px 18px;
  background-color: #000;
  color: #fff;
  border: 1px dotted rgb(210, 204, 193);
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    color: rgb(115, 115, 115);
  }
`;
