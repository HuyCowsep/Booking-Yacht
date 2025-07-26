import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FcPlus } from "react-icons/fc";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllLocation, getYachtByIdYacht, getYachtType, updateYacht } from '../../services/ApiServices';
const ManageInforYacht = (props) => {
    const { idYacht } = useParams();
    const [inforYacht, setInforYacht] = useState({})
    const [listLocation, setListLocation] = useState([]);
    const [listYachtType, setListYachtType] = useState([]);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [idLocation, setIdLocation] = useState('');
    const [idYachtType, setIdYachtType] = useState('');
    const initInforYacht = {
        name: '',
        image: '',
        hullBody: '',
        itinerary: '',
        rule: '',
        description: '',
        maxRoom: 0,
    }

    useEffect(() => {
        getYacht();
        getLocation();
        getAllType();
    }, [])

    const getYacht = async () => {
        const res = await getYachtByIdYacht(idYacht);
        if (res && res.data) {
            setInforYacht(res.data);
        } else {
            toast.error('Not Found Data Yacht')
        }
    }

    useEffect(() => {
        if (!_.isEmpty(inforYacht)) {
            setDataUpdate(inforYacht);
            // Xử lý locationId
            let loc = '';
            if (inforYacht.locationId) {
                if (inforYacht.locationId._id) loc = inforYacht.locationId._id;
                else if (inforYacht.locationId.id) loc = inforYacht.locationId.id;
                else if (inforYacht.locationId.name) loc = inforYacht.locationId.name;
            }
            if (!loc && Array.isArray(listLocation) && listLocation.length > 0) loc = listLocation[0]._id || listLocation[0].name || '';
            setIdLocation(loc);
            // Xử lý yachtTypeId
            let type = '';
            if (inforYacht.yachtTypeId) {
                if (inforYacht.yachtTypeId._id) type = inforYacht.yachtTypeId._id;
                else if (inforYacht.yachtTypeId.id) type = inforYacht.yachtTypeId.id;
                else if (inforYacht.yachtTypeId.name) type = inforYacht.yachtTypeId.name;
            }
            if (!type && Array.isArray(listYachtType) && listYachtType.length > 0) type = listYachtType[0]._id || listYachtType[0].name || '';
            setIdYachtType(type);
            if (inforYacht.image) {
                setPreviewImage(inforYacht.image)
            }
        }
    }, [inforYacht, listLocation, listYachtType]);



    const [dataUpdate, setDataUpdate] = useState(initInforYacht)

    const getLocation = async () => {
        let res = await getAllLocation();
        if (res && res.data.length > 0) {
            setListLocation(res.data);
        } else {
            toast.error('Location Not Found')
        }
    }
    const getAllType = async () => {
        let res = await getYachtType();
        if (res && res.data.length > 0) {
            setListYachtType(res.data)
        } else {
            toast.error('Yacht Type Not Found')
        }
    }

    const handleChange = (e) => {
        setDataUpdate({
            ...dataUpdate,
            [e.target.name]: e.target.value
        }

        )
    }
    const handelUploadImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const validateInput = () => {
        const { name, hullBody, itinerary, rule, description, maxRoom } = dataUpdate;
        console.log(dataUpdate)
        if (
            !name ||
            !hullBody ||
            !itinerary ||
            !rule ||
            !description ||
            idLocation === '' ||
            idYachtType === '' ||
            maxRoom === '' || maxRoom === null || maxRoom === undefined
        ) {
            toast.error('Please fill in all fields');
            return false;
        }
        if (maxRoom < 0) {
            toast.error('Maximum rooms cannot be negative');
            return false;
        }
        return true;
    };

    // So sánh dữ liệu hiện tại với dữ liệu gốc
    const isChanged = () => {
        if (!inforYacht) return true;
        // So sánh từng trường, image chỉ so sánh nếu user chọn ảnh mới
        if (
            dataUpdate.name !== inforYacht.name ||
            dataUpdate.hullBody !== inforYacht.hullBody ||
            dataUpdate.itinerary !== inforYacht.itinerary ||
            dataUpdate.rule !== inforYacht.rule ||
            dataUpdate.description !== inforYacht.description ||
            Number(dataUpdate.maxRoom) !== Number(inforYacht.maxRoom) ||
            idLocation !== (inforYacht.locationId && inforYacht.locationId._id ? inforYacht.locationId._id : '') ||
            idYachtType !== (inforYacht.yachtTypeId && inforYacht.yachtTypeId._id ? inforYacht.yachtTypeId._id : '') ||
            image
        ) {
            return true;
        }
        return false;
    }

    const handleUpdateYacht = async () => {
        if (validateInput() === false) return;
        if (!isChanged()) {
            toast.info('Không có thay đổi nào để cập nhật');
            return;
        }
        let res = await updateYacht(idYacht, dataUpdate.name.trim(), image,
            dataUpdate.hullBody.trim(), dataUpdate.description.trim(),
            dataUpdate.rule.trim(), dataUpdate.itinerary.trim(),
            idYachtType, idLocation, dataUpdate.maxRoom);

        if (res || res.data) {
            toast.success('Update Success');
            getYacht();
        } else {
            toast.error('Update Fail')
        }
    }

    return (
        <div>
            <div className="update-yacht-form">
                <h5 style={{ marginBottom: '1rem' }}>🛥️ Update Yacht</h5>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Yacht Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={dataUpdate.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Maximum Rooms</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxRoom"
                                min="0"
                                value={dataUpdate.maxRoom}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Hull-Body</Form.Label>
                            <Form.Control
                                name='hullBody'
                                type="text"
                                onChange={handleChange}
                                value={dataUpdate.hullBody}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Itinerary</Form.Label>
                            <Form.Control
                                name='itinerary'
                                type="text"
                                onChange={handleChange}
                                value={dataUpdate.itinerary}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Rule</Form.Label>
                            <Form.Control
                                name='rule'
                                type="text"
                                onChange={handleChange}
                                value={dataUpdate.rule}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Location</Form.Label>
                            <Form.Select value={idLocation} onChange={event => setIdLocation(event.target.value)}>
                                {listLocation && listLocation.map((location) =>
                                    <option key={location._id} value={location._id}>{location.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Yacht Type</Form.Label>
                            <Form.Select value={idYachtType} onChange={event => setIdYachtType(event.target.value)}>
                                {listYachtType && listYachtType.map((type) =>
                                    <option key={type._id} value={type._id}>{type.starRanking} Sao</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            name='description'
                            as="textarea"
                            style={{ height: '100px' }}
                            onChange={handleChange}
                            value={dataUpdate.description}
                        />
                    </Row>

                    <div className='col-md-12'>
                        <label
                            style={{ width: 'fit-content', cursor: 'pointer' }}
                            className='form-label label-upload'
                            htmlFor='labelUpload'
                        >
                            <FcPlus /> Upload File IMAGE
                        </label>
                        <input
                            type='file'
                            accept='image/*'
                            hidden
                            id='labelUpload'
                            name='image'
                            onChange={(event) => handelUploadImage(event)}
                        />
                    </div>

                    <div className='col-md-12 img-preview' style={{ marginTop: '1rem' }}>
                        {previewImage ? (
                            <img src={previewImage} alt='image upload' />
                        ) : (
                            <span>Update Avatar</span>
                        )}
                    </div>

                    <Button
                        onClick={handleUpdateYacht}
                        className='my-3 text-center'
                    >
                        Update Now
                    </Button>
                </Form>
            </div>

        </div>
    );
};

export default ManageInforYacht;