import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AiFillHome } from "react-icons/ai";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { GoArrowDown, GoArrowUp } from "react-icons/go";
import ReactPaginate from "react-paginate";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createServiceYacht, deleteServiceYacht, getServiceByYacht } from "../../services/ApiServices";
import "./ManageServiceYacht.scss";
import ModalUpdateServiceYacht from "./Modal/ModalUpdateServiceYacht";

const ManageServiceYacht = () => {
  const { idYacht } = useParams();
  const [showModalUpdateServiceYacht, setShowModalUpdateServiceYacht] = useState(false);

  const [yachtServices, setYachtServices] = useState([]);
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [serviceUpdate, setServiceUpdate] = useState({});
  const [searchService, setSearchService] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    getServiceYacht();
  }, [refreshKey]);

  const handleClose = () => {
    setShowModalUpdateServiceYacht(false);
  };

  const getServiceYacht = async () => {
    try {
      let res = await getServiceByYacht(idYacht);

      // ✅ Xử lý nhiều trường hợp response
      let servicesData = [];

      if (res && res.data) {
        if (Array.isArray(res.data)) {
          // Trường hợp 1: res.data là array trực tiếp
          servicesData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          // Trường hợp 2: res.data.data là array
          servicesData = res.data.data;
        } else if (res.data.services && Array.isArray(res.data.services)) {
          // Trường hợp 3: res.data.services là array
          servicesData = res.data.services;
        }
      }

      if (servicesData.length > 0) {
        setYachtServices(servicesData);
      } else {
        setYachtServices([]);
        toast.info("Chưa có dịch vụ nào cho du thuyền này");
      }
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ");
      setYachtServices([]);
    }
  };

  const handleCreateYachtSurvice = async () => {
    // ✅ Validation chi tiết hơn
    if (!service || !service.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ!");
      return;
    }

    if (!price || price <= 0) {
      toast.error("Vui lòng nhập giá dịch vụ hợp lệ!");
      return;
    }

    if (service.trim().length < 3) {
      toast.error("Tên dịch vụ phải có ít nhất 3 ký tự!");
      return;
    }

    // ✅ Disable button và hiển thị loading
    setIsCreating(true);

    try {
      // ✅ Chờ tạo service hoàn toàn
      let res = await createServiceYacht(idYacht.trim(), service.trim(), price.trim());

      console.log("Create service response:", res);
      console.log("Response status:", res?.status);
      console.log("Response data:", res?.data);

      // ✅ Kiểm tra response - chỉ cần có response là thành công
      if (res) {
        console.log("Success detected!");

        // ✅ Hiển thị toast thành công
        toast.success("Tạo dịch vụ thành công!");

        // ✅ Clear form
        setService("");
        setPrice("");

        // ✅ Reset về trang đầu tiên
        setCurrentPage(0);

        // ✅ Force refresh và reload data
        setRefreshKey((prev) => prev + 1);

        // ✅ Chờ thêm 2 giây rồi reload để đảm bảo backend đã xử lý xong hoàn toàn
        setTimeout(async () => {
          console.log("Reloading data...");
          try {
            await getServiceYacht();
            console.log("Data reloaded successfully");
            // ✅ Hiển thị toast thông báo reload thành công
            toast.info("Danh sách dịch vụ đã được cập nhật!");
          } catch (error) {
            console.error("Error reloading data:", error);
            toast.error("Không thể cập nhật danh sách dịch vụ");
          }
        }, 2000);
      } else {
        console.log("Response không thành công:", res);
        toast.error("Tạo dịch vụ thất bại!");
      }
    } catch (error) {
      // ✅ Hiển thị lỗi chi tiết hơn
      let errorMessage = "Lỗi không xác định";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ";
      } else if (error.response?.status === 401) {
        errorMessage = "Không có quyền truy cập";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      // ✅ Re-enable button sau khi hoàn tất
      setTimeout(() => {
        setIsCreating(false);
      }, 500);
    }
  };

  const handleUpdateServiceYacht = (Service) => {
    setShowModalUpdateServiceYacht(true);
    setServiceUpdate(Service);
  };

  const handleDeleteServiceYacht = async (service) => {
    if (window.confirm(`You Want To Delete service ${service.service}`)) {
      let res = await deleteServiceYacht(idYacht, service.idService);
      if (res && res.data === true) {
        toast.success("Delete Successfully");
        getServiceYacht();
        setCurrentPage((prevPage) => {
          const maxPage = Math.ceil((yachtServices.length - 1) / itemsPerPage) - 1;
          return prevPage > maxPage ? maxPage : prevPage;
        });
      } else {
        toast.error("Delete Fail");
      }
    }
  };

  const handleSortByPriceDown = () => {
    const newList = [...yachtServices].sort((a, b) => a.price - b.price);
    setYachtServices(newList);
  };

  const handleSortByPriceUp = () => {
    const newList = [...yachtServices].sort((a, b) => b.price - a.price);
    setYachtServices(newList);
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const displayedService = yachtServices.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="manage-service-yacht">
      <NavLink to="/manage-company/view-yacht" className="back-link">
        <AiFillHome /> <p>Back To Manage Company</p>
      </NavLink>

      <div className="container">
        {/* LUÔN HIỂN THỊ FORM TẠO DỊCH VỤ */}
        <div className="create-service-form mb-4 p-3 bg-white rounded shadow-sm">
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridServiceName">
                <Form.Label>Tên dịch vụ *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên dịch vụ"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  isInvalid={service && service.trim().length > 0 && service.trim().length < 3}
                />
                <Form.Control.Feedback type="invalid">Tên dịch vụ phải có ít nhất 3 ký tự</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridServicePrice">
                <Form.Label>Giá dịch vụ *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Nhập giá dịch vụ (VNĐ)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="1000"
                  isInvalid={price && price <= 0}
                />
                <Form.Control.Feedback type="invalid">Giá dịch vụ phải lớn hơn 0</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button onClick={handleCreateYachtSurvice} variant="success" disabled={isCreating} className="me-2">
              {isCreating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang tạo...
                </>
              ) : (
                "Tạo dịch vụ"
              )}
            </Button>
          </Form>
        </div>

        <div className="service-table-container">
          <div className="search-container">
            <FormControl
              className="form-control"
              type="text"
              placeholder="Search Service"
              onChange={(e) => setSearchService(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>
                    Price
                    <div className="sort-icons">
                      <GoArrowDown onClick={handleSortByPriceDown} />
                      <GoArrowUp onClick={handleSortByPriceUp} />
                    </div>
                  </th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedService &&
                  displayedService.length > 0 &&
                  displayedService
                    .filter(
                      (service) =>
                        service.service && service.service.toLowerCase().includes(searchService.toLowerCase())
                    )
                    .map((service) => (
                      <tr key={service._id}>
                        <td>{service.service || service.name}</td>
                        <td>{service.price.toLocaleString("en-US")}</td>{" "}
                        <td>
                          <div className="action-buttons">
                            <div className="action-btn edit-btn" onClick={() => handleUpdateServiceYacht(service)}>
                              <BiSolidEditAlt size={25} />
                              <label>Edit</label>
                            </div>
                            <div className="action-btn delete-btn" onClick={() => handleDeleteServiceYacht(service)}>
                              <FaDeleteLeft size={25} />
                              <label>Delete</label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <ReactPaginate
              nextLabel="Next >"
              onPageChange={handlePageChange}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(yachtServices.length / itemsPerPage)}
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
        </div>
      </div>

      <ModalUpdateServiceYacht
        show={showModalUpdateServiceYacht}
        serviceUpdate={serviceUpdate}
        handleClose={handleClose}
        idYacht={idYacht}
        getServiceYacht={getServiceYacht}
      />
    </div>
  );
};

export default ManageServiceYacht;
