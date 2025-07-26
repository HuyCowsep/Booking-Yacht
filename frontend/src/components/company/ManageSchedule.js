import { useEffect, useState } from "react";
import { Form, FormControl } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { AiFillHome } from "react-icons/ai";
import ReactPaginate from 'react-paginate';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { createScheduleYacht, deleteScheduleYacht, getScheduleYacht } from "../../services/ApiServices";
import './ManageSchedule.scss';
import ModalUpdateScheduleYacht from "./Modal/ModalUpdateScheduleYacht";



const ManageSchedule = () => {

    const { idYacht } = useParams();
    const [getShowModalUpdateScheduleYacht, setShowModalUpdateScheduleYacht] = useState(false);

    const [getSchedule, setSchedule] = useState([]);
    const [getStartDate, setStartDate] = useState('');
    const [getEndDate, setEndDate] = useState('');
    const [getScheduleUpdate, setScheduleUpdate] = useState({});

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 5;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchScheduleYacht()
    }, [idYacht, currentPage])

    const handleClose = () => {
        setShowModalUpdateScheduleYacht(false)
    }

    const fetchScheduleYacht = async () => {
        let res = await getScheduleYacht(idYacht)
        //check data empty or not
        if (res && res.data) {
            const sortedSchedule = res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            const totalPages = Math.ceil(sortedSchedule.length / itemsPerPage);
            setPageCount(totalPages);
            setSchedule(sortedSchedule)
        } else {
            toast.error("Can not found schedule")
        }
    }

    const handleCreateYachtSchedule = async () => {
        if (!getStartDate || !getEndDate) {
            toast.error('Start date or End date is empty');
            return;
        }

        const now = Date.now();
        if (new Date(getStartDate).getTime() <= now) {
            toast.error('Start date must after ' + formatDateTime(now));
            return;
        }

        if (new Date(getStartDate).getTime() >= new Date(getEndDate).getTime()) {
            toast.error('Start date must be before End date');
            return;
        }

        setLoading(true);
        let res = await createScheduleYacht(getStartDate, getEndDate, idYacht);
        setLoading(false);
        if (res && res.schedule) {
            toast.success("Created new schedule successfully");
            fetchScheduleYacht();
            setStartDate("");
            setEndDate("");
        } else {
            toast.error("Create new schedule failure");
        }
    }

    const handleUpdateScheduleYacht = async (schedule) => {
        setShowModalUpdateScheduleYacht(true);
        setScheduleUpdate(schedule)
    }

    const handleDeleteScheduleYacht = async (schedule) => {
        if (window.confirm(`Are you sure you want to delete this schedule?`)) {
            let res = await deleteScheduleYacht(idYacht.idYacht, schedule.idSchedule)

            if (res && res.data === "00") {
                toast.success("Deleted schedule successfully");
                fetchScheduleYacht();
            } else if (res && res.data === "22") {
                toast.error("The schedule already exists in 1 booking order");
            } else if (res && res.data === "11") {
                toast.error("Delete schedule failure");
            }
        }
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    const handlePageClick = (data) => {
        setCurrentPage(data.selected)
    }

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedSchedule = getSchedule.slice(startIndex, endIndex);

    const isPastDate = (endDate) => {
        const now = Date.now();
        return new Date(endDate).getTime() < now;
    }

    return (
        <div className="manage-schedule-container">
            <div>
                <NavLink to='/manage-company/view-yacht' className='p-3 d-flex nav-link' style={{ gap: 20 }}>
                    <AiFillHome className='' /> <p className='mb-0'>Back To Manage Company</p>
                </NavLink>
            </div>

            <div className="container">
                <div className="create-schedule-form">
                    <h5 style={{ marginBottom: '1rem' }}>Create new schedule</h5>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Start date</Form.Label>
                                <FormControl
                                    type="datetime-local"
                                    value={getStartDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>End date</Form.Label>
                                <FormControl
                                    type="datetime-local"
                                    value={getEndDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Row>

                        <div className="d-flex flex-column align-items-center" style={{ justifyContent: 'center' }}>
                            <Button
                                onClick={handleCreateYachtSchedule}
                                variant="success"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang tạo...
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                            {loading && (
                                <div style={{ marginTop: 8, color: '#1cb5e0' }}>
                                    Đang tạo lịch, vui lòng đợi...
                                </div>
                            )}
                        </div>
                    </Form>
                </div>

                <div className="table-responsive my-5">
                    <table className="table table-striped table-hover table-borderless table-primary align-middle">
                        <thead className="table-dark">
                            <h4>Schedule List</h4>
                            <tr>
                                <th>Start date</th>
                                <th>End date</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-light">

                            {
                                slicedSchedule && slicedSchedule.length > 0 && slicedSchedule.map((schedule) =>
                                    <tr key={schedule.scheduleId._id} className={isPastDate(schedule.scheduleId.endDate) ? 'table-danger' : ''}>
                                        <td>{formatDateTime(schedule.scheduleId.startDate)}</td>
                                        <td>{formatDateTime(schedule.scheduleId.endDate)}</td>
                                        <td className="d-flex" style={{ gap: 50, justifyContent: 'center' }}>
                                            <Button
                                                variant="primary"
                                                className="mx-2"
                                                onClick={() => handleUpdateScheduleYacht(schedule)}
                                                disabled={isPastDate(schedule.scheduleId.endDate)}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            <ModalUpdateScheduleYacht
                show={getShowModalUpdateScheduleYacht}
                scheduleUpdate={getScheduleUpdate}
                handleClose={handleClose}
                yachtId={idYacht}
                getScheduleYacht={fetchScheduleYacht}
            />
            <div className='page'>
                <ReactPaginate
                    previousLabel="< Prev"
                    nextLabel="Next >"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    forcePage={currentPage}
                    disableInitialCallback={true}
                />
            </div>
        </div>
    );
};

export default ManageSchedule;
