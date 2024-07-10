import "./Pagination.css";
import PrevBtn from "../../assets/previousBtn.png";
import NextBtn from "../../assets/nextBtn.png";

const Pagination = ({ totalPages, handlePagination, currentPageNumber }) => {
  const paginationNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.push(i);
  }

  return (
    <div className="pagination-section">
      <div className="pagination">
        <button
          className="btn"
          onClick={() =>
            handlePagination(currentPageNumber - 1, paginationNumbers.length)
          }
          disabled={currentPageNumber === 1}
        >
          <img className="btn-logo" src={PrevBtn} />
        </button>

        {paginationNumbers.map((pageNumber) => (
          <button
            className={
              "btn " +
              (pageNumber === currentPageNumber ? "active" : "inactive")
            }
            onClick={() =>
              handlePagination(pageNumber, paginationNumbers.length)
            }
            key={pageNumber}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() =>
            handlePagination(currentPageNumber + 1, paginationNumbers.length)
          }
          className="btn"
          disabled={currentPageNumber === paginationNumbers.length}
        >
          <img className="btn-logo" src={NextBtn} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
