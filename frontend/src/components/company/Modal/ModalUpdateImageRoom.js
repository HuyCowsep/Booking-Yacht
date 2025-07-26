import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import { FcPlus } from "react-icons/fc";
import { toast } from 'react-toastify';
import { updateImageRoom } from '../../../services/ApiServices';
const ModalUpdateImageRoom = (props) => {
    const { show, setIsShowModalUpdateImage, imageUpdate } = props;
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const handleClose = () => {
        setIsShowModalUpdateImage(false);
        setImage('');
        setPreviewImage('');
    }
    useEffect(() => {
        setPreviewImage(imageUpdate)
    }, [imageUpdate])

    const handelUpdateImageRoom = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }
    const handleUpdateImageRoom = async () => {
        let res = await updateImageRoom(imageUpdate, image);
        if (res && res.data.data === true) {
            toast.success("Update Image Successfully");
            handleClose();
            await props.getImageRoomById();
        } else {
            toast.error('Update ImageRoom Fail')
        }
    }
    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                autoFocus

            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Yacht</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='col-mad-12'>
                        <label style={{ width: 'fit-content' }} className='form-label label-upload' htmlFor='labelUpdateImageRoom'> <FcPlus /> Upload File IMAGE</label>
                        <input
                            type='file'
                            accept='image/*'
                            hidden id='labelUpdateImageRoom'
                            name='image'
                            onChange={(event) => handelUpdateImageRoom(event)}
                        />
                    </div>
                    <div className='col-md-12 img-preview'>
                        {previewImage ?
                            <img src={previewImage} />
                            :
                            <span>Preview Avartar</span>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateImageRoom}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateImageRoom;