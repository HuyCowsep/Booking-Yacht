import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import '../ManageYacht.scss'
import { FaPen } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { createImageRoom, deleteImageRoom, getImageByRoom } from '../../../services/ApiServices';
import { toast } from 'react-toastify';
import '../ManageYacht.scss';
import ModalUpdateImageRoom from './ModalUpdateImageRoom';

const ModalManageRoomImage = (props) => {
    const { show, setIsShowModalRoomImage, idRoom } = props;
    const [image, setImage] = useState('');
    const [listImage, setListImage] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [imageUpdate, setImageUpdate] = useState('');
    const [isShowModalUpdateImage, setIsShowModalUpdateImage] = useState('')

    useEffect(() => {
        if (show) {
            getImageRoomById();
        }
    }, [show])


    const handleClose = () => {
        setIsShowModalRoomImage(false);
    }

    const handelUploadImage = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }


    const handleCreateImageRoom = async () => {
        let res = await createImageRoom(idRoom, image);
        if (res && res.data.data === true) {
            toast.success('Create Successfully');
            setImage('')
            setPreviewImage('')
            getImageRoomById();
        } else {
            toast.error('Create Fail');
        }
    }

    const getImageRoomById = async () => {
        let res = await getImageByRoom(idRoom);
        if (res && res.data && res.data.data) {
            setListImage(res.data.data);
        } else {
            toast.error('Not Have Image')
        }
    }

    const handleUpdateImageRoom = (idImage) => {
        setIsShowModalUpdateImage(true);
        setImageUpdate(idImage);
    }

    const handleDeleteImageRoom = async (image) => {
        if (window.confirm(`You want to delete image ${image}`)) {
            let res = await deleteImageRoom(image);
            if (res && res.data.data === true) {
                toast.success('Delete Successfully');
                getImageRoomById();
            } else {
                toast.error('Delete Image Room Fail');
            }
        }
    }


    return (
        <div>
            <Modal size='xl'
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                autoFocus

            >
                <Modal.Header closeButton>
                    <Modal.Title>Manage Room Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create Image Room</Accordion.Header>
                            <Accordion.Body>
                                <div className='col-mad-12'>
                                    <label style={{ width: 'fit-content' }} className='form-label label-upload' htmlFor='labelCreateImage'> <FcPlus /> Upload File IMAGE</label>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        hidden id='labelCreateImage'
                                        name='image'
                                        onChange={(event) => handelUploadImage(event)}
                                    />
                                </div>
                                <div className='col-md-12 img-preview'>
                                    {previewImage ?
                                        <img src={previewImage} />
                                        :
                                        <span>Preview Avartar</span>
                                    }
                                </div>
                                <Button onClick={handleCreateImageRoom} className='btn btn-primary my-2'>Create</Button>

                            </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listImage && listImage.map((image) =>
                                    <tr key={image.idRoomImage}>
                                        <td><img src={image.imageRoom} alt='image' width={200} /></td>
                                        <td>

                                            <ButtonGroup className='d-flex ' style={{ gap: 30, justifyContent: "center", marginTop: 54 }}>
                                                <Button onClick={() => handleUpdateImageRoom(image.idRoomImage)} className='btn btn-light'><FaPen size='1em' /></Button>

                                                <Button onClick={() => handleDeleteImageRoom(image.idRoomImage)} className='btn btn-light' style={{ color: "red" }}><MdDelete size='1em' /></Button>
                                            </ButtonGroup>
                                        </td>

                                    </tr>
                                )
                            }

                        </tbody>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

            <ModalUpdateImageRoom
                show={isShowModalUpdateImage}
                setIsShowModalUpdateImage={setIsShowModalUpdateImage}
                imageUpdate={imageUpdate}
                getImageRoomById={getImageRoomById}
            />
        </div>
    );
};

export default ModalManageRoomImage;