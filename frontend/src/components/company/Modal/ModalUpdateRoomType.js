import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import { updateRoomType } from '../../../services/ApiServices';
const ModalUpdateRoomType = (props) => {
    const { show, setIsShowModalUpdateRoomType, dataUpdate } = props;
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [utilities, setUtilities] = useState('');

    const handleClose = () => {
        setIsShowModalUpdateRoomType(false);
    }
    useEffect(() => {
        if (!_.isEmpty(dataUpdate)) {
            setPrice(dataUpdate.price);
            setType(dataUpdate.type);
            setUtilities(dataUpdate.utility);

        }
    }, [dataUpdate])

    const handleUpdateRoomType = async () => {
        if (!price || !type || !utilities) {
            toast.error("Please fill in all fields")
        } else {
            let res = await updateRoomType(dataUpdate._id, price, type, utilities.trim());
            if (res || res.data) {
                toast.success('Update Successfully')
                handleClose();
                await props.getRoomType();
            } else {
                toast.error("Update Fail")
            }
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
                    <Modal.Title>Update Room Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={price}
                                    onChange={event => setPrice(event.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={type}
                                    onChange={event => setType(event.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Utilities</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={utilities}
                                    onChange={event => setUtilities(event.target.value)}
                                />
                            </Form.Group>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateRoomType}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateRoomType;