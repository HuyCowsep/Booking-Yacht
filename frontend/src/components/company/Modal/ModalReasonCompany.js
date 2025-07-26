import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { canelBooking } from '../../../services/ApiServices';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const ModalReasonCompany = (props) => {
    const { showModalReason, setShowModalReason, idCancel } = props;
    const idCompany = useSelector(state => state.account.account.idCompany);

    const handleClose = () => {
        setShowModalReason(false);
        setReason('');
    }
    const [reason, setReason] = useState('');

    const handleCancelBooking = async () => {
        if (!reason) {
            toast.error('Input Not Empty')
        } else {
            let res = await canelBooking(idCompany, idCancel, reason.trim());
            if (res && res.data && res.data.data === true) {
                toast.success('Cancel Booking Successfully')
                await props.getBooking();
                handleClose();
            } else {
                toast.error('Cancel Fail')
            }
        }
    }

    return (
        <div>
            <Modal show={showModalReason} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reason Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl as="textarea" type='text' onChange={e => setReason(e.target.value)} placeholder='Reason Cancel Booking' />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCancelBooking}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalReasonCompany;