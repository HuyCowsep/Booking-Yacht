import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { AiFillHome } from "react-icons/ai";
import { FaCirclePlus } from "react-icons/fa6";
import ReactPaginate from 'react-paginate';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteYachtImage, getYachtImage } from '../../services/ApiServices';
import ManageInforYacht from './ManageInforYacht';
import './ManageYacht.scss';
import ModalCreateImageYacht from './Modal/ModalCreateImageYacht';
import ModalUpdateImageYacht from './Modal/ModalUpdateImageYacht';

const ManageYacht = () => {
    const { idYacht } = useParams();

    const [isShowModalCreateImage, setIsShowModalCreateImage] = useState(false);
    const [isShowModalUpdateImage, setIsShowModalUpdateImage] = useState(false);
    const [listYachtImage, setListYachtImage] = useState([])

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };
    const displayedImageYacht = listYachtImage.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const [dataUpdate, setDataUpdate] = useState('');
    useEffect(() => {
        getAllImagesYacht()
    }, [])

    const getAllImagesYacht = async () => {
        let res = await getYachtImage(idYacht);
        console.log('jdfjdfhjdhf', res.data)
        if (res && res.data) {
            setListYachtImage(res.data);
        } else {
            toast.info('Not Found Image Yacht');
        }
    }

    const handleDeleteImage = async (idImage) => {
        if (window.confirm(`Do you want to delete Image`)) {
            let res = await deleteYachtImage(idImage);
            if (res || res.data) {
                toast.success('Delete Successfully');
                getAllImagesYacht();
                setCurrentPage(prevPage => {
                    const maxPage = Math.ceil((listYachtImage.length - 1) / itemsPerPage) - 1;
                    return prevPage > maxPage ? maxPage : prevPage;
                });
            } else {
                toast.error('Delete Fail');
            }

        }
    }


    const handleUpdateYachtImage = async (image) => {
        setIsShowModalUpdateImage(true);
        setDataUpdate(image);
    }


    return (
        <div>
            <div >
                <NavLink to='/manage-company/view-yacht' className='p-3 d-flex nav-link' style={{ gap: 20 }}>
                    <AiFillHome className='' /> <p className='mb-0'>Back To Manage Company</p>
                </NavLink>
            </div>
            <hr />
            <div className='manage-infor-yacht container my-5'>
                <ManageInforYacht
                    idYacht={idYacht}
                />
            </div>
            <hr />
            <div className='manage-image container'>
                <div
                    className=""
                >

                    <Button onClick={() => setIsShowModalCreateImage(true)} className='btn btn-success my-3' htmlFor='labelUpload'> <FaCirclePlus /> Upload File IMAGE</Button>

                    <table
                        className="table table-striped table-hover table-borderless table-primary align-middle"
                    >
                        <thead className="table-light">

                            <tr>
                                <th>Image</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {
                                displayedImageYacht && displayedImageYacht.length > 0 && displayedImageYacht.map((image) =>

                                    <tr
                                        key={image._id}
                                        className="table-primary"
                                    >
                                        <td>
                                            <img src={image.imageUrl} width={200} alt='' />
                                        </td>
                                        <td width={300}>
                                            <Row>
                                                <Col md={4}>
                                                    <label onClick={() => handleUpdateYachtImage(image)} className='btn btn-primary' >Update</label>
                                                </Col>
                                                <Col md={4}>
                                                    <Button onClick={() => handleDeleteImage(image._id)} className='btn btn-danger'>Delete</Button>
                                                </Col>
                                            </Row>

                                        </td>

                                    </tr>
                                )
                            }

                        </tbody>

                    </table>
                    <div className='page'>
                        <ReactPaginate
                            nextLabel="Next >"
                            onPageChange={handlePageChange}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={Math.ceil(listYachtImage.length / itemsPerPage)}
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

            </div>



            <ModalCreateImageYacht
                show={isShowModalCreateImage}
                setShow={setIsShowModalCreateImage}
                idYacht={idYacht}
                getAllImagesYacht={getAllImagesYacht}
            />
            <ModalUpdateImageYacht
                show={isShowModalUpdateImage}
                setShow={setIsShowModalUpdateImage}
                dataUpdate={dataUpdate}
                getAllImagesYacht={getAllImagesYacht}

            />

        </div>
    );
};

export default ManageYacht;