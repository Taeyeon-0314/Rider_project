import styled, { keyframes } from "styled-components";

const GlobalLoading = () => {
  return (
    <LoadingWrapper>
      <Spinner />
    </LoadingWrapper>
  );
};

export default GlobalLoading;

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const rotation = keyframes`
    from{
        transform: rotate(0deg);
    }

    to{
        transform: rotate(360deg);
    }

`;

const Spinner = styled.div`
  height: 30px;
  width: 30px;
  border: 1px solid #f8049c;
  border-radius: 50%;
  border-top: none;
  border-right: none;
  margin: 16px auto;
  animation: ${rotation} 1s linear infinite;
`;
