import styled from "styled-components";

const Pagination = ({ totalItems, currentPage, setCurrentPage, PAGE_ITEMS, PAGE_GROUP }) => {
  //총페이지
  const totalPages = Math.ceil(totalItems / PAGE_ITEMS);

  // 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP); // 현재 그룹
  const startPage = (currentGroup - 1) * PAGE_GROUP + 1; // 해당 그룹의 첫 페이지
  const endPage = Math.min(startPage + PAGE_GROUP - 1, totalPages); // 해당 그룹의 마지막 페이지

  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 이전 그룹으로 이동
  const handlePrevGroup = () => {
    if (startPage > 1) {
      setCurrentPage(startPage - 1);
    }
  };

  // 다음 그룹으로 이동
  const handleNextGroup = () => {
    if (endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  // 첫 페이지로
  const handleFirstGroup = () => {
    setCurrentPage(1);
  };

  // 마지막 페이지로
  const handleLastGroup = () => {
    setCurrentPage(totalPages);
  };

  return (
    <Paging>
      <button className="prev-next" onClick={handleFirstGroup} disabled={startPage < 6}>
        &lt;&lt;
      </button>
      <button className="prev-next" onClick={handlePrevGroup} disabled={startPage === 1}>
        &lt;
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={index + startPage}
          onClick={() => handlePage(index + startPage)}
          className={currentPage === index + startPage ? "active" : ""}
          disabled={currentPage === index + startPage}
        >
          {index + startPage}
        </button>
      ))}
      <button className="prev-next" onClick={handleNextGroup} disabled={endPage === totalPages}>
        &gt;
      </button>
      <button className="prev-next" onClick={handleLastGroup} disabled={endPage === totalPages}>
        &gt;&gt;
      </button>
    </Paging>
  );
};

const Paging = styled.div`
  width: 100%;
  margin-top: 3px;
  display: flex;
  justify-content: center;
  gap: 5px;

  button {
    padding: 5px 10px;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid ${(props) => (props.disabled ? "#bbb" : "#ddd")};
    background-color: ${(props) => (props.disabled ? "#6f6f6f !important" : "#fff")};
    color: ${(props) => (props.disabled ? "#999" : "#333")};
    border-radius: 5px;
    cursor: pointer;
    box-shadow: ${(props) => (props.disabled ? "none" : "0 2px 5px rgba(0, 0, 0, 0.1)")};
    transition: all 0.3s ease;
    &:hover {
      background-color: ${(props) => (props.disabled ? "#6f6f6f" : "#f9f9f9")};
      border-color: ${(props) => (props.disabled ? "#bbb" : "#ccc")};
    }
    &:active {
      background-color: ${(props) => (props.disabled ? "#6f6f6f" : "#eee")};
      box-shadow: ${(props) => (props.disabled ? "none" : "0 2px 3px rgba(0, 0, 0, 0.2)")};
    }
    &:disabled {
      cursor: not-allowed;
      background-color: #6f6f6f;
    }
    &.active {
      background-color: #000000;
      color: white;
      border-color: #ffffff;
      cursor: default;
    }
  }

  button.prev-next {
    width: 40px;
    font-size: 18px;
  }
`;

export default Pagination;
