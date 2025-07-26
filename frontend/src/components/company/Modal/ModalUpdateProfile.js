import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import _ from "lodash";
import { useSelector } from "react-redux";
import { FcPlus } from "react-icons/fc";
import { updateProfileCompany } from "../../../services/ApiServices";
import { toast } from "react-toastify";

const ModalUpdateProfile = (props) => {
  const { show, handleClose, profile } = props;
  const idCompany = useSelector((state) => state.account.account.idCompany);

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!_.isEmpty(profile)) {
      setEmail(profile.email);
      setAddress(profile.address);
      setName(profile.name);
      setImage(profile.logo);
      setPreviewImage(profile.logo);
      setImage(profile.logo);
    }
  }, [profile]);

  const handelUploadImage = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    const url = event.target.value ? event.target.value : null;

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    } else if (url) {
      setPreviewImage(url);
      setImage(url);
    }

    // if (event.target.files[0] && event.target && event.target.files) {
    //     setPreviewImage(URL.createObjectURL(event.target.files[0]));
    //     setImage(event.target.files[0]);
    // } ApiServices.js
  };

  const handleUpdateProfile = async () => {
    if (!name || !address) {
      toast.error("Please fill in all fields");
    } else {
      try {
        console.log("== Sending update request with:");
        console.log("name:", name);
        console.log("address:", address);
        console.log("logo (type):", typeof image, image);

        let res = await updateProfileCompany(idCompany, name.trim(), address.trim(), email, image);

        console.log("== Response:", res);

        if (res || res.data) {
          toast.success("Update Successfully");
          handleClose();
          await props.getProfile();
        } else {
          toast.error(res.data?.message || "Update Fail");
        }
      } catch (error) {
        console.error("== Error while updating profile:", error);
        toast.error("Có lỗi xảy ra khi cập nhật");
      }
    }
  };

  return (
    <div>
      <Modal size="xl" show={show} onHide={handleClose} autoFocus>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control disabled value={email} onChange={(event) => setEmail(event.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} />
            </Form.Group>
            <div className="col-mad-12">
              <label style={{ width: "fit-content" }} className="form-label label-upload" htmlFor="labelCreateImage">
                {" "}
                <FcPlus /> Upload File IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="labelCreateImage"
                name="image"
                onChange={(event) => handelUploadImage(event)}
              />
            </div>
            <div className="col-md-12 img-preview">
              {previewImage ? <img src={previewImage} /> : <span>Preview Avartar</span>}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleUpdateProfile} variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateProfile;
