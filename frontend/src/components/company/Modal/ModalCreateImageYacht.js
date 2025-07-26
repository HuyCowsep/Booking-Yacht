import _ from 'lodash';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { FcPlus } from "react-icons/fc";
import { toast } from 'react-toastify';
import { createYachtImage } from '../../../services/ApiServices';

const ModalCreateImageYacht = (props) => {
    const { show, setShow, idYacht } = props
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const handleClose = () => {
        setShow(false);
        setImage('');
        setPreviewImage('');
    }

    const handelUploadImage = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const handleCreateImageYacht = async () => {
        if (_.isEmpty(image) && _.isEmpty(previewImage)) {
            toast.error("Please Choose File ")
            return;
        } else {
            const res = await createYachtImage(idYacht, image);
            if (res && res.data) {
                toast.success("Create Image Successfully")
                handleClose();
                setPreviewImage('');
                setImage('');
                await props.getAllImagesYacht();
            } else {
                toast.error("Image Invalid")
            }
        }

    }
    return (
        <div className='my-4'>
            <Modal size='xl'
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
                            <img src={previewImage} alt='image upload' />
                            :
                            <span>Preview Avartar</span>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateImageYacht}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalCreateImageYacht;