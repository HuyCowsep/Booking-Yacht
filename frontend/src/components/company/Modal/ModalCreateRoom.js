import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { createRoom } from "../../../services/ApiServices";
import { useTheme } from "@mui/material/styles";

const ModalCreateRoom = (props) => {
  const { show, setIsShowModalCreateRoom, idYacht, listRoomType, fetchRoomType, getAllRoom, maxRoom, listRoom } = props;
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [area, setArea] = useState(0);
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();

  useEffect(() => {
    fetchRoomType();
    if (show) {
      if (_.isEmpty(listRoomType)) {
        toast.warning("Please create room type before creating room");
      } else {
        setRoomType(listRoomType[0]?._id);
      }
    }
  }, [show]);

  const handleClose = () => {
    setIsShowModalCreateRoom(false);
    resetForm();
  };

  const resetForm = () => {
    setRoomName("");
    setArea("");
    setDescription("");
    setRoomType(listRoomType[0]?.idRoomType);
    setPreviewImage("");
    setImage("");
    setQuantity(1);
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const totalCurrentRoom = Array.isArray(listRoom) ? listRoom.reduce((sum, room) => sum + (room.quantity || 1), 0) : 0;

  const handleCreateRoom = async () => {
    if (!roomName || !area || !description || !roomType || !image || !quantity) {
      toast.error("Please fill in all fields");
    } else if (area < 0) {
      toast.error("Area cannot be a negative number");
    } else if (quantity < 1) {
      toast.error("Quantity must be at least 1");
    } else if (maxRoom && totalCurrentRoom + quantity > maxRoom) {
      toast.error(
        `Tổng số phòng sau khi tạo vượt quá số lượng tối đa (${maxRoom}). Hiện tại đã có ${totalCurrentRoom} phòng.`
      );
    } else {
      setLoading(true);
      try {
        const res = await createRoom(roomName.trim(), area, description.trim(), roomType, image, idYacht, quantity);
        if (res?.data) {
          toast.success("Create Successfully");
          handleClose();
          await getAllRoom();
        } else {
          toast.error("Create Fail");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tạo phòng");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal size="xl" show={show} onHide={handleClose} backdrop="static" className="modal-add-new-yacht" autoFocus>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Modal.Title>Add New Room</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                Room Name
              </Form.Label>

              <Form.Control
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                Area
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter area in m²"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                Room Type
              </Form.Label>
              <Form.Select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {listRoomType.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              >
                Quantity
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={maxRoom ? maxRoom - totalCurrentRoom : undefined}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              {maxRoom && (
                <Form.Text style={{ color: theme.palette.text.secondary }}>
                  Số lượng tối đa còn lại có thể tạo: {maxRoom - totalCurrentRoom}
                </Form.Text>
              )}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Label
              style={{
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              style={{
                height: "100px",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Row>

          <div className="col-md-12">
            <label
              style={{
                width: "fit-content",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px dashed ${theme.palette.divider}`,
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "inline-block",
              }}
              className="form-label label-upload"
              htmlFor="labelUpload"
            >
              <FcPlus /> Upload File IMAGE
            </label>
            <input type="file" accept="image/*" hidden id="labelUpload" onChange={handleUploadImage} />
          </div>

          <div className="col-md-12 img-preview mt-2">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxHeight: "180px", borderRadius: "8px", border: `1px solid ${theme.palette.divider}` }}
              />
            ) : (
              <span style={{ color: theme.palette.text.secondary }}>Preview Avatar</span>
            )}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer
        style={{
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateRoom} disabled={loading}>
          {loading ? "Đang lưu..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateRoom;
