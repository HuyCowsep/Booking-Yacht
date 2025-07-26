import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFeedbackCompany } from '../../services/ApiServices';
import { GoArrowDown } from "react-icons/go";
import { GoArrowUp } from "react-icons/go";
import ReactPaginate from 'react-paginate';
const ViewFeedback = () => {
    const idCompany = useSelector(state => state.account.account.idCompany);
    const [listFeedback, setListFeedback] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        getFeedback();
    }, [])

    const getFeedback = async () => {
        let res = await getFeedbackCompany(idCompany);
        if (res && res.data.data) {
            setListFeedback(res.data.data);
        }
    }

    const handleSortByStarDown = () => {
        const newListFeed = [...listFeedback].sort((a, b) => a.starRating - b.starRating);
        setListFeedback(newListFeed);
    }

    const handleSortByNameDown = () => {
        const newListFeed = [...listFeedback].sort((sA, sB) => {
            let a = sA.customer.fullName.split(/\s+/).at(-1) + sA.name;
            //a = a[a.length - 1] + a;
            let b = sB.customer.fullName.split(/\s+/).at(-1) + sB.name;
            //b = b[b.length - 1] + b;
            return a.toLowerCase().localeCompare(b.toLowerCase());
            //ten la tieng anh
            //return sA.name.toLowerCase().localeCompare(sB.name.toLowerCase());
        })
        setListFeedback(newListFeed)
    }

    const handleSortByStarUp = () => {
        const newListFeed = [...listFeedback].sort((a, b) => b.starRating - a.starRating);
        setListFeedback(newListFeed);
    }

    const handleSortByNameUp = () => {
        const newListFeed = [...listFeedback].sort((sA, sB) => {
            let a = sA.customer.fullName.split(/\s+/).at(-1) + sA.name;
            //a = a[a.length - 1] + a;
            let b = sB.customer.fullName.split(/\s+/).at(-1) + sB.name;
            //b = b[b.length - 1] + b;
            return b.toLowerCase().localeCompare(a.toLowerCase());
            //ten la tieng anh
            //return sA.name.toLowerCase().localeCompare(sB.name.toLowerCase());
        })
        setListFeedback(newListFeed)
    }

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };
    const displayedFeedback = listFeedback.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <>
            <div
                className="table-responsive "
            >
                <div className='my-3'></div>
                <table
                    className="table table-striped table-hover table-borderless table-primary align-middle"
                >
                    <thead className="table-light">
                        <tr>
                            <th>Star
                                <GoArrowDown onClick={handleSortByStarDown} style={{ cursor: 'pointer' }} />
                                <GoArrowUp onClick={handleSortByStarUp} style={{ cursor: 'pointer' }} /></th>
                            <th>Name Customer
                                <GoArrowDown onClick={handleSortByNameDown} style={{ cursor: 'pointer' }} />
                                <GoArrowUp onClick={handleSortByNameUp} style={{ cursor: 'pointer' }} /></th>
                            <th>Describe</th>
                            <th>Phone</th>

                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            displayedFeedback && displayedFeedback.map((feddback) =>

                                <tr
                                    key={feddback.idFeedback}
                                    className="table-primary"
                                >
                                    <td>
                                        {feddback.starRating}
                                    </td>
                                    <td>
                                        {feddback.customer.fullName}
                                    </td>
                                    <td>
                                        {feddback.description}
                                    </td>
                                    <td>
                                        {feddback.customer.phoneNumber}
                                    </td>
                                </tr>
                            )
                        }

                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
                <div className='page'>
                    <ReactPaginate
                        nextLabel="Next >"
                        onPageChange={handlePageChange}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={Math.ceil(listFeedback.length / itemsPerPage)}
                        previousLabel="< Prev"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
        </>


    );
};

export default ViewFeedback;