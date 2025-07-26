import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import { updateScheduleYacht } from '../../../services/ApiServices';

const ModalUpdateScheduleYacht = (props) => {
    const { show, handleClose, scheduleUpdate, yachtId } = props;
    const [getStartDate, setStartDate] = useState('');
    const [getEndDate, setEndDate] = useState('');

    useEffect(() => {
        if (!_.isEmpty(scheduleUpdate)) {
            setStartDate(scheduleUpdate.getStartDate);
            setEndDate(scheduleUpdate.getEndDate);
        }
    }, [scheduleUpdate])

    const handleUpdateScheduleYacht = async () => {
        if (!getStartDate || !getEndDate) {
            toast.error('Start date or End date is empty');
            return;
        }

        const now = Date.now();
        if (new Date(getStartDate).getTime() <= now) {
            toast.error('Start date must before ' + formatDateTime(now));
            return;
        }

        //check start date is before end date 
        if (new Date(getStartDate).getTime() >= new Date(getEndDate).getTime()) {
            toast.error('Start date must be before End date');
            return;
        }

        let res = await updateScheduleYacht(yachtId, scheduleUpdate.scheduleId._id, getStartDate, getEndDate);
        if (res && res.schedule) {
            toast.success("Updated schedule successfully");
            setStartDate('');
            setEndDate('');
            handleClose();
            await props.getScheduleYacht();
        } else {
            toast.error("Update failure");
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

    return (
        <div>
            <Modal size='xl' show={show} onHide={handleClose} autoFocus>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Start date</Form.Label>
                                <FormControl
                                    type="datetime-local"
                                    value={getStartDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>End date</Form.Label>
                                <FormControl
                                    type="datetime-local"
                                    value={getEndDate}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateScheduleYacht}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateScheduleYacht;