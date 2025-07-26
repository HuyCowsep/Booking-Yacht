import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { upadteServiceYacht } from '../../../services/ApiServices';
import _ from 'lodash';
import { toast } from 'react-toastify';
const ModalUpdateServiceYacht = (props) => {
    const { show, handleClose, serviceUpdate, idYacht } = props;
    const [price, setPrice] = useState('');
    const [service, setService] = useState('');

    useEffect(() => {
        if (!_.isEmpty(serviceUpdate)) {
            setService(serviceUpdate.service);
            setPrice(serviceUpdate.price);
        }
    }, [serviceUpdate])

    const handleUpdateServiceYacht = async () => {
        if (!service || !price) {
            toast.error('Please fill in all fields')
            return;
        } else {
            let res = await upadteServiceYacht(idYacht, serviceUpdate.idService, service.trim(), price);
            if (res && res.data.data === true) {
                toast.success('Update Successfully');
                setPrice('');
                setService('');
                handleClose();
                await props.getServiceYacht();
            } else {
                toast.error('Update Fail');
            }
        }
    }
    return (
        <div>
            <Modal size='xl' show={show} onHide={handleClose} autoFocus>
                <Modal.Header closeButton>
                    <Modal.Title>Update Service Yacht</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Service</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={service}
                                    onChange={(event) => setService(event.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                />
                            </Form.Group>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateServiceYacht}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateServiceYacht;