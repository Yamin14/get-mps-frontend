interface Props {
    dataLength: number,
    pagination: {
        rowsPerPage: number,
    },
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const Pagination = ({dataLength, pagination, currentPage, setCurrentPage} : Props) => {

    return (
        <div>
            <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className='pagination-button'
            >
                &laquo;
            </button>
            <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className='pagination-button'
            >
                Prev
            </button>
            <span>{currentPage}</span>
            <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === Math.ceil(dataLength / pagination.rowsPerPage)}
                className='pagination-button'
            >
                Next
            </button>
            <button
                onClick={() => setCurrentPage(Math.ceil(dataLength / pagination.rowsPerPage))}
                disabled={currentPage === Math.ceil(dataLength / pagination.rowsPerPage)}
                className='pagination-button'
            >
                &raquo;
            </button>
        </div>
    )
}

export default Pagination