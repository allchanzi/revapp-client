import React, { useState } from 'react';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Pages = ({length, onPageChange}) => {
    const [currentPage, setPage] = useState(0)

    const handlePageClick = (e, i) => {
        setPage(e)
        onPageChange(i)
    }

    // const handleNextClick = (e) => {
    //     if (currentPage < length - 1) {
    //         console.log("N", currentPage)
    //         setPage(currentPage + 1)
    //         console.log("N", currentPage)
    //         onPageChange(currentPage)
    //     }
    // }
    //
    // const handlePreviousClick = (e) => {
    //     if (currentPage > 0) {
    //         console.log("P", currentPage)
    //         setPage(currentPage - 1)
    //         console.log("P", currentPage)
    //         onPageChange(currentPage)
    //     }
    // }

    const handleLastClick = (e) => {
        setPage(e => length - 1)
        onPageChange(length - 1)
    }

    const handleFirstClick = (e) => {
        setPage(e => 0)
        onPageChange(0)
    }

    return (
        <Pagination size="sm" aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink first onClick={e => handleFirstClick(e)} href="#" />
            </PaginationItem>
            {/*<PaginationItem>*/}
            {/*    <PaginationLink previous onClick={e => handlePreviousClick(e)} href="#" />*/}
            {/*</PaginationItem>*/}
            {[...Array(length)].map((page, i) => (
                <PaginationItem active={i === currentPage} key={i}>
                    <PaginationLink onClick={e => handlePageClick(e, i)} href="#">
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            ))}
            {/*<PaginationItem>*/}
            {/*    <PaginationLink next onClick={e => handleNextClick(e)} href="#" />*/}
            {/*</PaginationItem>*/}
            <PaginationItem>
                <PaginationLink last onClick={e => handleLastClick(e)} href="#" />
            </PaginationItem>
        </Pagination>
    )
}

export default Pages