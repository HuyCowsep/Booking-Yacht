import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { createRoomType, deleteRoomType, getAllRoomTypeCompany } from "../../../services/ApiServices";
import ModalUpdateRoomType from "./ModalUpdateRoomType";
import { useTheme } from "@mui/material/styles";

const ModalRoomType = (props) => {
  const { show, setIsShowModalRoomType, idYacht } = props;
  const theme = useTheme();
  const [isShowModalUpdateRoomType, setIsShowModalUpdateRoomType] = useState(false);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("");
  const [utilities, setUtilities] = useState("");

  const handleClose = () => {
    setPrice("");
    setType("");
    setUtilities("");
    setIsShowModalRoomType(false);
  };

  const handleCreateRoomType = async () => {
    if (price === 0 || !type || !utilities) {
      toast.error("Please fill in all fields");
    } else if (price < 0) {
      toast.error("Price not Negative number");
    } else {
      if (roomType.find((t) => t.type === type.trim())) {
        toast.error("Room Type Is Exits");
        return;
      } else {
        let res = await createRoomType(price, type.trim(), utilities.trim(), idYacht);
        if (res && res.data) {
          toast.success("Create Successfully");
          await getRoomType();
          handleClose();
        } else {
          toast.error("Create Fail");
        }
      }
    }
  };

  const [dataUpdate, setDataUpdate] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    getRoomType();
  }, []);

  const getRoomType = async () => {
    let res = await getAllRoomTypeCompany(idYacht);
    if (res && res.data) {
      setRoomType(res.data);
    } else {
      toast.info("Not Found Room Type");
    }
  };

  const handleUpdateRoomType = (type) => {
    setIsShowModalUpdateRoomType(true);
    setDataUpdate(type);
  };

  const handleDeleteRoomType = async (type) => {
    if (window.confirm(`You Want To Delete Room Type ${type.utilities}`)) {
      let res = await deleteRoomType(type._id);
      if (res || res.data) {
        toast.success("Delete Successfully");
        getRoomType();
        setCurrentPage((prevPage) => {
          const newLength = roomType.length - 1;
          const maxPage = Math.ceil(newLength / itemsPerPage) - 1;
          return prevPage > maxPage ? maxPage : prevPage;
        });
      } else {
        toast.error("Delete Fail");
      }
    }
  };

  const handleSortByPriceDown = () => {
    const newList = [...roomType].sort((a, b) => a.price - b.price);
    setRoomType(newList);
  };

  const handleSortByPriceUp = () => {
    const newList = [...roomType].sort((a, b) => b.price - a.price);
    setRoomType(newList);
  };
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const displayedRoomTypes = roomType.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static" className="modal-add-new-yacht" size="xl" autoFocus>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: theme.palette.text.primary }}>Manage Room Type</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <div
            className="create-roomtype-form mb-4 p-3 rounded shadow-sm"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label style={{ color: theme.palette.text.primary }}>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label style={{ color: theme.palette.text.primary }}>Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label style={{ color: theme.palette.text.primary }}>Utilities</Form.Label>
                  <Form.Control
                    type="text"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Form.Group>
              </Row>
              <Button onClick={handleCreateRoomType}>Create</Button>
            </Form>
          </div>

          <div className="container">
            <table
              className="table table-hover"
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <thead>
                <tr>
                  <th>
                    Price <GoArrowDown onClick={handleSortByPriceDown} style={{ cursor: "pointer" }} />
                    <GoArrowUp onClick={handleSortByPriceUp} style={{ cursor: "pointer" }} />
                  </th>
                  <th>Type</th>
                  <th>Utilities</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedRoomTypes &&
                  displayedRoomTypes.length > 0 &&
                  displayedRoomTypes.map((type) => (
                    <tr key={type._id}>
                      <td>{type.price.toLocaleString()}</td>
                      <td>{type.type}</td>
                      <td>{type.utility}</td>
                      <td>
                        <div className="d-flex" style={{ gap: 20, justifyContent: "center" }}>
                          <Button onClick={() => handleUpdateRoomType(type)} className="btn btn-warning">
                            Update
                          </Button>
                          <Button onClick={() => handleDeleteRoomType(type)} className="btn btn-danger">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="page">
              <ReactPaginate
                nextLabel="Next >"
                onPageChange={handlePageChange}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={Math.ceil(roomType.length / itemsPerPage)}
                previousLabel="< Prev"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </div>

            <ModalUpdateRoomType
              show={isShowModalUpdateRoomType}
              setIsShowModalUpdateRoomType={setIsShowModalUpdateRoomType}
              dataUpdate={dataUpdate}
              getRoomType={getRoomType}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalRoomType;
