import { useEffect, useState } from "react";
import { ButtonGroup } from "react-bootstrap";
import ModalUpdateProfile from "./Modal/ModalUpdateProfile";
// import { useSelector } from 'react-redux';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileCompany } from "../../services/ApiServices";
import ModalChangePassCompany from "./Modal/ModalChangePassCompany";
import { Box, Typography, Button } from "@mui/material";

const ProfileCompany = () => {
  // const idCompany = useSelector(state => state.account.account.idCompany);
  const idCompany = useSelector((state) => state.account.account.idCompany);

  const [isShowModal, setIsShowModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [showModalChangePass, setShowModalChangePass] = useState(false);

  const handleClose = () => {
    setIsShowModal(false);
    setShowModalChangePass(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    let res = await getProfileCompany(idCompany);
    if (res && res.data) {
      setProfile(res.data);
    }
  };

  return (
    <Box sx={{ backgroundColor: "background.default", py: 5, minHeight: "100vh" }}>
      <Box className="container">
        <Box className="row d-flex justify-content-center align-items-center" sx={{ minHeight: "100%" }}>
          <Box className="col col-lg-6 mb-4 mb-lg-0">
            <Box
              className="card mb-3"
              sx={{
                borderRadius: ".5rem",
                backgroundColor: "background.paper",
                boxShadow: 2,
                overflow: "hidden",
              }}
            >
              <Box className="row g-0" display="flex">
                {/* Logo */}
                <Box
                  className="col-md-4 text-center"
                  sx={{
                    background: "linear-gradient(180deg, #68bfb5, #4f908a)",
                    borderTopLeftRadius: ".3rem",
                    borderBottomLeftRadius: ".3rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box component="img" src={profile.logo} alt="logo" sx={{ width: 80, my: 5 }} />
                </Box>

                {/* Thông tin */}
                <Box className="col-md-8">
                  <Box className="card-body p-4">
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Thông tin
                    </Typography>
                    <Box component="hr" sx={{ my: 1 }} />
                    <Box className="row pt-1">
                      <Box className="col-6 mb-3">
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                          Email
                        </Typography>
                        <Typography color="text.secondary">{profile.email}</Typography>
                      </Box>
                      <Box className="col-6 mb-3">
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                          Địa chỉ
                        </Typography>
                        <Typography color="text.secondary">{profile.address}</Typography>
                      </Box>
                    </Box>

                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                      Tên công ty
                    </Typography>
                    <Box component="hr" sx={{ my: 1 }} />
                    <Box className="row pt-1">
                      <Box className="col-9 mb-2">
                        <Typography color="text.secondary">{profile.name}</Typography>
                      </Box>
                      <Box className="col-3 mb-3" />
                    </Box>

                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                      {/* Nút Chỉnh sửa */}
                      <Button
                        onClick={() => setIsShowModal(true)}
                        variant="outlined"
                        sx={{
                          borderRadius: 20,
                          color: "primary.main",
                          borderColor: "primary.main",
                          fontWeight: 500,
                          px: 3,
                          "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white",
                            borderColor: "primary.dark",
                          },
                        }}
                      >
                        Chỉnh sửa
                      </Button>

                      {/* Nút Đổi mật khẩu */}
                      <Button
                        onClick={() => setShowModalChangePass(true)}
                        variant="outlined"
                        sx={{
                          borderRadius: 20,
                          color: "text.secondary",
                          borderColor: "text.secondary",
                          fontWeight: 500,
                          px: 3,
                          "&:hover": {
                            backgroundColor: "text.secondary",
                            color: "white",
                            borderColor: "primary.dark",
                          },
                        }}
                      >
                        Đổi mật khẩu
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal Update */}
      <ModalUpdateProfile show={isShowModal} handleClose={handleClose} profile={profile} getProfile={getProfile} />
      <ModalChangePassCompany show={showModalChangePass} handleClose={handleClose} />
    </Box>
  );
};

export default ProfileCompany;
