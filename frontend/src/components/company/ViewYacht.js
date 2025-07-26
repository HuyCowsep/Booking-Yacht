import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputBase, Typography } from "@mui/material";
import { FaCirclePlus, FaLocationDot } from "react-icons/fa6";
import { RiShipLine } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllLocation, getYachtByIdCompany, getYachtType, updateYachtStatus } from "../../services/ApiServices";
import ModalCreateYacht from "./Modal/ModalCreateYacht";
import "./ViewYacht.scss";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";

const ViewYacht = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isShowModal, setIsShowModal] = useState(false);
  const idCompany = useSelector((state) => state.account.account.idCompany);
  const [yachtType, setYachtType] = useState([]);
  const [yacht, setYacht] = useState([]);
  const [searchYacht, setSearchYacht] = useState("");
  const [filteredYachts, setFilteredYachts] = useState([]);
  const [location, setLocation] = useState([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterYachtType, setFilterYachtType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    listYacht();
    getLocation();
    getTypeYacht();
  }, []);

  useEffect(() => {
    filterAndPaginateYachts();
  }, [searchYacht, filterLocation, filterYachtType, currentPage, yacht]);

  const listYacht = async () => {
    let res = await getYachtByIdCompany(idCompany);
    if (res && res.data) {
      setYacht(res.data);
      setFilteredYachts(res.data);
    } else {
      toast.info("Please Adding New Yacht");
    }
  };

  const handleToggleYachtStatus = async (id, isDeleted) => {
    const confirmMsg = isDeleted ? "Bạn muốn ẩn du thuyền này?" : "Bạn muốn hiển thị lại du thuyền này?";
    const confirmResult = await Swal.fire({
      title: "Xác nhận",
      text: confirmMsg,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#68bfb5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
    });

    if (confirmResult.isConfirmed) {
      const res = await updateYachtStatus(id, isDeleted);
      if (res && res.data) {
        toast.success(isDeleted ? "Đã ẩn du thuyền!" : "Đã hiển thị du thuyền!");
        listYacht();
      } else {
        toast.error("Cập nhật trạng thái thất bại!");
      }
    }
  };

  const getLocation = async () => {
    let res = await getAllLocation();
    if (res && res.data) {
      setLocation(res.data);
    }
  };

  const getTypeYacht = async () => {
    let res = await getYachtType();
    if (res && res.data) {
      setYachtType(res.data);
    }
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filterAndPaginateYachts = () => {
    const filtered = yacht
      .filter((y) => y.name.toLowerCase().includes(searchYacht.toLowerCase().trim()))
      .filter((y) => (filterLocation === "0" ? true : y.locationId && y.locationId._id.includes(filterLocation)))
      .filter((y) => (filterYachtType === "0" ? true : !y.yachtTypeId || y.yachtTypeId._id.includes(filterYachtType)));

    setFilteredYachts(filtered);
  };

  const displayedYachts = filteredYachts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Box sx={{ px: 2 }}>
      {/* Filter & Add */}
      <Box className="row my-4 mx-1 g-3 align-items-center" sx={{ color: theme.palette.text.primary }}>
        <Box className="col-lg-2 col-md-3 col-sm-6">
          <Button
            variant="contained"
            fullWidth
            onClick={() => setIsShowModal(true)}
            startIcon={<FaCirclePlus />}
            sx={{ fontWeight: 600 }}
          >
            Add New Yacht
          </Button>
        </Box>

        <Box className="col-lg-2 col-md-3 col-sm-6">
          <FormControl fullWidth>
            <select onChange={(e) => setFilterLocation(e.target.value)} className="form-select">
              <option value="0">All Location</option>
              {location.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </FormControl>
        </Box>

        <Box className="col-lg-2 col-md-3 col-sm-6">
          <FormControl fullWidth>
            <select onChange={(e) => setFilterYachtType(e.target.value)} className="form-select">
              <option value="0">All Yacht Type</option>
              {yachtType.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.starRanking} Sao
                </option>
              ))}
            </select>
          </FormControl>
        </Box>

        <Box className="col-lg-4 col-md-3 col-sm-6">
          <InputBase
            placeholder="Search Yacht..."
            value={searchYacht}
            onChange={(e) => setSearchYacht(e.target.value)}
            fullWidth
            sx={{
              bgcolor: theme.palette.background.paper,
              px: 2,
              py: 1,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      </Box>

      {/* Yacht List */}
      <div className="row container">
        <div className="col-xl-12">
          {displayedYachts.map((yacht) => (
            <Box
              key={yacht._id}
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: theme.shadows[1],
                p: 2,
                mb: 3,
              }}
            >
              <div className="media d-flex">
                <img
                  src={yacht.image}
                  alt="Yacht"
                  style={{
                    width: "300px",
                    height: "auto",
                    borderRadius: "8px",
                    marginRight: "16px",
                  }}
                />
                <div className="media-body flex-grow-1">
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {yacht.name}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2, color: theme.palette.text.secondary }}>
                    <p>
                      <FaLocationDot /> {yacht.locationId?.name || "N/A"}
                    </p>
                    <p>
                      <RiShipLine /> {yacht.yachtTypeId?.name || "N/A"}
                    </p>
                    <p>Số phòng tối đa: {yacht.maxRoom || 0}</p>
                  </Box>
                  <Box className="d-flex gap-2 flex-wrap">
                    {yacht.isDeleted === false ? (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate(`/manage-services-yacht/${yacht._id}`)}
                        >
                          Manage Services
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(`/manage-schedule/${yacht._id}`)}>
                          Manage Schedule
                        </Button>
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => navigate(`/manage-yacht/${yacht._id}`)}
                        >
                          Manage Yacht
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => navigate(`/manage-room/${yacht._id}`)}
                        >
                          Manage Room
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleToggleYachtStatus(yacht._id, true)}
                        >
                          Ẩn Du Thuyền
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleToggleYachtStatus(yacht._id, false)}
                      >
                        Hiện Du Thuyền
                      </Button>
                    )}
                  </Box>
                </div>
              </div>
            </Box>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Box className="page" mt={3}>
        <ReactPaginate
          nextLabel="Next >"
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={Math.ceil(filteredYachts.length / itemsPerPage)}
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
      </Box>

      {/* Modal */}
      <ModalCreateYacht
        show={isShowModal}
        setShow={setIsShowModal}
        idCompany={idCompany}
        listYacht={listYacht}
        location={location}
      />
    </Box>
  );
};

export default ViewYacht;
