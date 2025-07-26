import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormControl, FormGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { changePasswordCompany } from '../../../services/ApiServices';
import { useSelector } from 'react-redux';
const ModalChangePassCompany = (props) => {
    const { show, handleClose } = props;
    const idCompany = useSelector(state => state.account.account.idCompany)

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);


    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')


    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields')
        } else if (newPassword.length < 8) {
            toast.error('New Password must be at least 8 charaters')
        } else {
            let res = await changePasswordCompany(idCompany, oldPassword.trim(), newPassword.trim(), confirmPassword.trim())

            if (res && res.data && res.data.data === "400") {
                toast.error('Old password incorrect')
            } else if (res && res.data && res.data.data === "999") {
                toast.error('New password not matched confirm password')
            } else {
                toast.success('Change Password Succesfully')
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
                handleClose()
            }
        }
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label>Old Password</label>
                        <FormControl
                            type='password'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                    </FormGroup>
                    <FormGroup>
                        <label>New Password</label>
                        <FormControl
                            style={{ position: 'relative' }}
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <i style={{ position: 'absolute', top: 113, right: 21, cursor: 'pointer' }} className={showPassword === true ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </FormGroup>
                    <FormGroup>
                        <label>Confim New Password</label>
                        <FormControl
                            style={{ position: 'relative' }}
                            value={confirmPassword}
                            type={showPassword1 ? 'text' : 'password'}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i style={{ position: 'absolute', bottom: 25, right: 21, cursor: 'pointer' }} className={showPassword1 === true ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}
                            onClick={() => setShowPassword1(!showPassword1)}
                        ></i>
                    </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleChangePassword} variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalChangePassCompany;