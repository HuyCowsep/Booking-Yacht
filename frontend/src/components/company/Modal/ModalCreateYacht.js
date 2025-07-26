import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FcPlus } from "react-icons/fc";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createYacht, getYachtType } from '../../../services/ApiServices';
const ModalCreateYacht = (props) => {
    const { show, setShow, location } = props;
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [yachtType, setYachtType] = useState([]);
    const idCompany = useSelector(state => state.account.account.idCompany)
    const [loading, setLoading] = useState(false);

    const initInforYacht = {
        name: '',
        hullBody: '',
        launch: '',
        itinerary: '',
        rule: '',
        description: '',
        location: '',
        yachtType: '',
        maxRoom: 0,
    }


    useEffect(() => {
        getAllType()
    }, [])

    useEffect(() => {
        if (show && location && location.length > 0 && yachtType && yachtType.length > 0) {
            setData({
                ...initInforYacht,
                location: location[0]._id,
                yachtType: yachtType[0]._id
            });
        }
    }, [show, location, yachtType]);

    const handleClose = () => {
        setShow(false)
        setPreviewImage('');
        setImage('');
        setData(initInforYacht);

    }

    const [data, setData] = useState(initInforYacht)

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        }

        )

    }

    const handelUploadImage = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }
    const handleCreateYacht = async () => {
        if (!data.name || !image || !data.launch || !data.hullBody || !data.description || !data.rule || !data.itinerary || !data.location || !data.yachtType || !data.maxRoom) {
            toast.error("Vui lòng điền đầy đủ thông tin");
        } else if (data.maxRoom < 0) {
            toast.error("Số phòng tối đa không thể âm");
        } else {
            setLoading(true);
            let res = await createYacht(
                data.name.trim(),
                image,
                data.launch,
                data.hullBody.trim(),
                data.description.trim(),
                data.rule.trim(),
                data.itinerary.trim(),
                data.yachtType,
                data.location,
                idCompany,
                data.maxRoom
            );
            console.log('RESPONSE:', res);
            if (res && typeof res === 'object' && (res._id || res.name)) {
                toast.success('Tạo thuyền thành công');
                await props.listYacht();
                setTimeout(() => {
                    setLoading(false);
                    setData(initInforYacht);
                    setImage("");
                    setPreviewImage("");
                    handleClose();
                }, 800);
            } else {
                setLoading(false);
                toast.error("Tạo thuyền thất bại");
            }
        }
    }

    const getAllType = async () => {
        let res = await getYachtType();
        setYachtType(res.data)
    }


    return (
        <>
            <Modal size='xl'
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                autoFocus
                style={{ zIndex: 9999 }}
                dialogClassName="modal-dialog-centered"
            >
                {/* Loading overlay */}
                {loading && (
                    <div className="modal-loading-overlay">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div style={{marginTop: 10}}>Đang tạo thuyền, vui lòng đợi...</div>
                    </div>
                )}
                <Modal.Header closeButton>
                    <Modal.Title>Add New Yacht</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name='name'
                                    type="text"
                                    placeholder="Yacht Name "
                                    onChange={handleChange}
                                    value={data.name}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Hull-Body</Form.Label>
                                <Form.Control
                                    name='hullBody'
                                    type="text"
                                    placeholder="Hull-Body"
                                    onChange={handleChange}
                                    value={data.hullBody}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Launch</Form.Label>
                                <Form.Control
                                    name='launch'
                                    type="date"
                                    placeholder="Launch"
                                    onChange={handleChange}
                                    value={data.launch}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Itinerary</Form.Label>
                                <Form.Control
                                    name='itinerary'
                                    type="text"
                                    placeholder="Itinerary"
                                    onChange={handleChange}
                                    value={data.itinerary}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Rule</Form.Label>
                                <Form.Control
                                    name='rule'
                                    type="text"
                                    placeholder="Rule"
                                    onChange={handleChange}
                                    value={data.rule}
                                />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Location</Form.Label>
                                <Form.Select onChange={handleChange} name='location'>
                                    {
                                        location && location.map((location) =>
                                            <option key={location._id} value={location._id}>{location.name}</option>
                                        )
                                    }

                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Yacht Type</Form.Label>
                                <Form.Select onChange={handleChange} name='yachtType'>
                                    {
                                        yachtType && yachtType.map((type) =>
                                            <option key={type._id} value={type._id}>{type.starRanking} Sao</option>
                                        )
                                    }


                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Maximum Rooms</Form.Label>
                                <Form.Control
                                    name='maxRoom'
                                    type="number"
                                    min="0"
                                    placeholder="Maximum number of rooms"
                                    onChange={handleChange}
                                    value={data.maxRoom}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name='description'
                                as="textarea"
                                placeholder="Description"
                                style={{ height: '100px' }}
                                onChange={handleChange}
                                value={data.description}
                            />
                        </Row>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Label>Upload Image</Form.Label>
                                <div className='d-flex align-items-center gap-3'>
                                    <label className='form-label label-upload' htmlFor='labelUpload'>
                                        <FcPlus /> Upload Image
                                    </label>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        hidden 
                                        id='labelUpload'
                                        name='image'
                                        onChange={(event) => handelUploadImage(event)}
                                    />
                                    {previewImage && (
                                        <span className='text-success'>
                                            ✓ Image selected
                                        </span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        
                        <Row className="mb-3">
                            <Col md={12}>
                                <div className='img-preview'>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" />
                                    ) : (
                                        <span>No image selected</span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleCreateYacht} disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo thuyền"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalCreateYacht;
