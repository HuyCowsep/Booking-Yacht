import _ from 'lodash';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FcPlus } from "react-icons/fc";
import { toast } from 'react-toastify';
import { updateRoom } from '../../../services/ApiServices';



const ModalUpdateRoom = (props) => {
    const { show, setIsShowModalUpdateRoom, dataUpdateRoom, maxRoom, listRoom } = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState(1);


    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    useEffect(() => {
        if (!_.isEmpty(dataUpdateRoom)) {
            setName(dataUpdateRoom.name);
            setDescription(dataUpdateRoom.description);
            setPreviewImage(dataUpdateRoom.avatar);
            setQuantity(dataUpdateRoom.quantity || 1);
        }
    }, [dataUpdateRoom])


    const handelUploadImageRoom = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const handleClose = () => {
        setIsShowModalUpdateRoom(false);
    }

    const handleUpdateRoom = async () => {
        if (!name || !description) {
            toast.error("Please fill in all fields")
        } else if (quantity < 1) {
            toast.error("Quantity must be at least 1")
        } else if (maxRoom && listRoom) {
            // Tính tổng số phòng nếu update quantity mới
            const totalOtherRooms = listRoom
                .filter(room => room._id !== dataUpdateRoom._id)
                .reduce((sum, room) => sum + (room.quantity || 1), 0);
            if (totalOtherRooms + quantity > maxRoom) {
                toast.error(`Tổng số phòng sau khi cập nhật vượt quá số lượng tối đa (${maxRoom}). Hiện tại các phòng khác đã có ${totalOtherRooms} phòng.`);
                return;
            }
        } else {
            let avatarToSend = image ? image : dataUpdateRoom.avatar;
            let res = await updateRoom(dataUpdateRoom._id, description.trim(), name.trim(), avatarToSend, quantity)
            if (res || res.data) {
                toast.success("Update Successfully")
                handleClose();
                await props.getAllRoom();
            } else {
                toast.error('Update Fail')
            }
        }
    }


    return (
        <div>
            <Modal size='xl' show={show} onHide={handleClose} autoFocus>
                <Modal.Header closeButton>
                    <Modal.Title>Update Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={e => setQuantity(parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <div className='col-mad-12 my-3'>
                            <label style={{ width: 'fit-content' }} className='form-label label-upload' htmlFor='labelUpload'> <FcPlus /> Upload File IMAGE</label>
                            <input
                                type='file'
                                accept='image/*'
                                hidden id='labelUpload'
                                name='image'
                                onChange={(event) => handelUploadImageRoom(event)}
                            />
                        </div>
                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} />
                                :
                                <span>Preview Avatar</span>
                            }
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateRoom}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateRoom;