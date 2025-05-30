import { Close, StarOutline } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Container, Typography } from "@mui/material";
import { ArrowRight, CheckIcon, ChevronLeft, ChevronRight, Info, Minus, Plus, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { HouseFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { FaAnchor, FaBox, FaBriefcase, FaLocationDot, FaShip } from "react-icons/fa6";
import ReviewSection from "./ReviewSection";


function DetailBoat() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng Delta Suite",
      image: "./images/yacht-10.jpg",
      area: "33",
      beds: 2,
      price: 4150000,
      quantity: 0,
    },
    {
      id: 2,
      name: "Phòng Ocean Suite",
      image: "./images/yacht-10.jpg",
      area: "33",
      beds: 2,
      price: 4370000,
      quantity: 0,
    },
    {
      id: 3,
      name: "Phòng Captain Suite",
      image: "./images/yacht-10.jpg",
      area: "35",
      beds: 2,
      price: 4620000,
      quantity: 0,
    },
    {
      id: 4,
      name: "Phòng Regal Suite",
      image: "./images/yacht-10.jpg",
      area: "45",
      beds: 2,
      price: 4870000,
      quantity: 0,
    },
  ]);
  const mainImages = [
    {
      src: "./images/yacht-10.jpg",
      alt: "Ambassador Cruise ship front view",
    },
    {
      src: "./images/yacht-10.jpg",
      alt: "Ambassador Cruise ship deck",
    },
    {
      src: "./images/yacht-10.jpg",
      alt: "Ambassador Cruise interior",
    },
  ];

  // Thumbnail images at the bottom
  const thumbnails = ["./images/ambassador/ambassador-cruise1.webp", "./images/yacht-10.jpg", "./images/yacht-10.jpg"];
  const tabs = [
    { label: "Đặc điểm", badge: null },
    { label: "Phòng & giá", badge: null },
    { label: "Giới thiệu", badge: null },
    { label: "Quy định", badge: null },
    { label: "Đánh giá", badge: "12" },
  ];

  // Side images that stay fixed
  const leftImage = "./images/yacht-8.jpg";
  const rightImage = "./images/yacht-9.jpg";
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === mainImages.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? mainImages.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, currentIndex]);

  const handleDecrement = (id) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, quantity: Math.max(0, room.quantity - 1) } : room)));
  };

  const handleIncrement = (id) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, quantity: room.quantity + 1 } : room)));
  };
  const totalAmount = rooms.reduce((total, room) => total + room.price * room.quantity, 0);

  return (
    <>
      <div className="border-b my-4 items-center pb-2">
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Breadcrumbs className="cursor-pointer !gap-3" separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" to={"/"} className="!flex !items-center hover:text-black">
              <HouseFill sx={{ mr: 0.5 }} size={25} fontSize="inherit" />
            </Link>
            <Link
              underline="hover"
              color="inherit"
              className="!flex  !items-center hover:text-gray-900"
              to={"/find-boat"}
            >
              Tìm du thuyền
            </Link>
            <Typography
              fontFamily={"Archivo, sans-serif"}
              className="!items-center !text-[#0e4f4f] hover:!text-cyan-400"
            >
              Du thuyền
            </Typography>
          </Breadcrumbs>
        </Container>
      </div>
      <div className="font-[Archivo,_sans-serif]">
        <Container>
          <Row>
            <Col md={9} className="gap-16 flex-grow">
              <p className="font-bold text-gray-900 text-4xl ">Du Thuyền Heritage Bình Chuẩn Cát Bà </p>
              <Row className="items-center flex gap-2">
                <p className="bg-[#fedf89] w-fit my-5 p-[4px_12px] gap-1 to-inherit text-[#7a2e0e] text-sm font-medium rounded-2xl flex items-center">
                  <StarOutline sx={{ fontSize: "12px", color: "#f79009" }} />
                  4.9 (12) đánh giá{" "}
                </p>
                <Link to={"#"}>
                  <div className="flex text-sm items-center p-[4px_12px] rounded-2xl flex-1 bg-gray-100 text-gray-700 ">
                    <p className="">Cảng tàu quốc tế Hạ Long, Hạ Long, Quảng Ninh </p>
                    <p className="text-[#77dada] underline  pl-2">Xem bản đồ và lịch trình</p>
                  </div>
                </Link>
              </Row>
              <Row>
                <Col>
                  <Image src={"./images/heading-border.webp"} />
                </Col>
              </Row>
            </Col>
            <Col md={3} className="flex flex-col justify-center items-end">
              <p className="text-[#0e4f4f] font-bold text-4xl">3,850,000 đ/khách</p>
            </Col>
          </Row>
        </Container>
        <div className="w-full mt-10 max-w-full overflow-hidden relative">
          {/* Full-width container for all three panels */}
          <div className="flex w-full px-6 ">
            {/* Left panel with navigation arrow */}
            <div className="w-1/6 relative h-auto  flex items-center justify-center">
              <img src={leftImage} alt="Halong Bay view" className="object-cover w-full rounded-l-3xl h-60" />
              <button
                onClick={prevSlide}
                className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Center panel with main cruise image */}
            <div
              className="w-4/6 relative h-auto  flex items-center justify-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Main carousel images */}
              {mainImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full   px-6 transition-opacity duration-500 ease-in-out ${
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img src={image.src} alt={image.alt} className="object-cover w-full  h-60" />
                </div>
              ))}
              {/* Thumbnails at the bottom */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    onClick={() => goToSlide(index % mainImages.length)} // Ensure we don't exceed image array
                    className={`h-16 w-16 overflow-hidden cursor-pointer border-2 rounded-xl  ${
                      index % mainImages.length === currentIndex ? "border-white " : "border-transparent opacity-80"
                    }`}
                  >
                    <img src={thumb} alt={`Thumbnail ${index + 1}`} className="object-cover w-full rounded-xl h-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel with navigation arrow */}
            <div className="w-1/6 relative h-auto  flex items-center justify-center">
              <img src={rightImage} alt="Halong Bay view" className="object-cover w-full rounded-r-3xl h-60" />
              <button
                onClick={nextSlide}
                className="absolute z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        <Container className="py-20">
          <Row className="bg-gray-100  shadow-md rounded-xl border-b border-gray-200 items-center">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <div key={index} className="flex-shrink-0 my-2 transition-all duration-200  mx-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`relative flex items-center px-2 py-1 text-sm ${
                      activeTab === index
                        ? "text-gray-700 bg-gray-50 border shadow-lg rounded-xl"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50  hover:border hover:shadow hover:rounded-xl"
                    }`}
                  >
                    <label className="cursor-pointer">{tab.label}</label>
                    {tab.badge && (
                      <div className="ml-1 bg-gray-100 rounded px-1">
                        <label className="text-xs">{tab.badge}</label>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Row>
          <Row className="flex">
            <Col className="pt-10 lg:w-9/12 md:w-12/12  sm:w-12/12 mr-6 gap-8">
              <div>
                <p className="font-bold text-gray-900 text-4xl ">Đặc điểm nổi bật</p>
                <Image src={"./images/heading-border.webp"} className="pt-6 " />
                <Col className="flex gap-2 py-10 items-center">
                  <Image src={"./icons/Wine.svg"} />
                  <p className="text-md font-medium">Quầy bar </p>
                </Col>
                <Col className="flex flex-col gap-6">
                  <div className="flex items-items-center font-medium gap-3">
                    <CheckIcon size={25} className="mt-3 text-[#77dada]" />
                    <p className="text-base">
                      Du thuyền Ambassador nổi tiếng là một trong những du thuyền sang trọng và lớn nhất vịnh Hạ Long,
                      Ambassador cũng là du thuyền duy nhất có thang máy.
                    </p>
                  </div>
                  <div className="flex items-items-center font-medium gap-3">
                    <CheckIcon size={25} className="mt-3 text-[#77dada]" />
                    <p className="text-base">
                      Du thuyền Ambassador nổi tiếng là một trong những du thuyền sang trọng và lớn nhất vịnh Hạ Long,
                      Ambassador cũng là du thuyền duy nhất có thang máy.
                    </p>
                  </div>
                  <div className="flex items-items-center font-medium gap-3">
                    <CheckIcon size={25} className="mt-3 text-[#77dada]" />
                    <p className="text-base">
                      Du thuyền Ambassador nổi tiếng là một trong những du thuyền sang trọng và lớn nhất vịnh Hạ Long,
                      Ambassador cũng là du thuyền duy nhất có thang máy.
                    </p>
                  </div>
                </Col>
                <Col className="my-5 ">
                  <p className="font-bold text-gray-900 text-4xl ">Các loại phòng & giá</p>
                  <Image src={"./images/heading-border.webp"} className="py-6 " />
                  <div
                    className=" gap-10 flex flex-col rounded-3xl p-8 bg-repeat"
                    style={{ backgroundImage: "url('/images/boat-bg.webp')" }}
                  >
                    <Col className="flex justify-end">
                      <Button className="!font-archivo hover:!bg-gray-400 hover:!shadow-2xl shadow-md !capitalize !gap-3 !rounded-full !p-[10px_16px] !whitespace-nowrap border !text-gray-800 !bg-gradient-to-t !from-slate-50 !to-slate-300 ">
                        {" "}
                        <Close /> <p className="text-gray-800">Xoá lựa chọn</p>
                      </Button>
                    </Col>
                    <Col className="flex flex-col ">
                      <Row>
                        <div className=" space-y-4">
                          {rooms.map((room) => (
                            <div
                              key={room.id}
                              className="bg-white p-4 rounded-[32px] shadow-sm flex justify-between items-center border"
                            >
                              <div className="flex">
                                <img src={room.image} alt={room.name} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="ml-3 flex flex-col flex-grow items-start gap-2">
                                  <h3 className="font-bold text-base break-words underline cursor-pointer text-gray-900">
                                    {room.name}
                                  </h3>
                                  <div className="flex items-center text-gray-500 gap-4 text-sm mt-1">
                                    <span className="flex items-center mr-4">
                                      <svg viewBox="0 0 24 24" width="16" height="16" className="mr-1 fill-current">
                                        <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                                      </svg>
                                      {room.area} m²
                                    </span>
                                    <span className="flex items-center">
                                      <svg viewBox="0 0 24 24" width="16" height="16" className="mr-1 fill-current">
                                        <path d="M19,7H5C3.89,7 3,7.89 3,9V17H5V13H19V17H21V9C21,7.89 20.11,7 19,7M19,11H5V9H19V11Z" />
                                      </svg>
                                      Tối đa: {room.beds} <User size={15} className="" />
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="gap-4 items-center flex justify-between ">
                                <div className="text-[#0e4f4f] text-lg font-bold">{room.price.toLocaleString()} đ</div>
                                <div className="text-gray-400 text-xs font-semibold">/khách</div>

                                <div className="mt-2 py-2 border border-gray-300 rounded-3xl  flex items-center justify-end">
                                  <button
                                    onClick={() => handleDecrement(room.id)}
                                    className="w-8 h-8 rounded-md flex items-center justify-center "
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="mx-3 w-4 text-center">{room.quantity}</span>
                                  <button
                                    onClick={() => handleIncrement(room.id)}
                                    className="w-8 h-8 rounded-md flex items-center justify-center "
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 rounded-lg p-4 shadow-sm flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm text-gray-500 ">Tổng tiền</div>
                            <div className="text-xl text-[#0e4f4f] font-bold">{totalAmount.toLocaleString()} đ</div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button className="bg-white font-semibold text-gray-800 fill-gray-800 border whitespace-nowrap rounded-full px-4 py-2 flex items-center">
                              Thuế trọn tàu
                            </button>
                            <button className="bg-[#77dada] border hover:bg-[#0e4f4f] hover:text-white border-[#77dada] font-semibold fill-[#0e4f4f] whitespace-nowrap text-[#0e4f4f] rounded-full px-4 py-2 flex items-center">
                              <span className="mr-1">Đặt ngay</span>
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </Row>
                    </Col>
                  </div>
                </Col>

                <Col className="my-5 scroll-mt-[150px]">
                  <p className="font-bold  text-gray-900 text-4xl ">Giới thiệu</p>
                  <Image src={"./images/heading-border.webp"} className="pt-6 " />
                  <div className="text-base">
                    <p className="m-[15px_0px_8px] text-2xl font-bold">Giới thiệu về du thuyền</p>
                    <p className="my-1 text-left break-words">
                      Du thuyền Ambassador được thiết kế tinh tế đặc biệt với 46 cabin giống như một khách sạn sang
                      trọng đẳng cấp giữa lòng vịnh Hạ Long chắc chắn sẽ là sự lựa chọn hoàn hảo nhất để khám phá vẻ đẹp
                      của di sản kỳ quan thiên nhiên thế giới vịnh Hạ.
                    </p>
                    <Image src="./images/ambassador/ambassador-cruise1.webp" />
                    <p className="my-1 text-left break-words">
                      Du thuyền Ambassador có 5 tầng, được đóng mới với chiều dài lên tới 86m, chiều rộng 13.9m và cao
                      13m. Với 2 tầng dành riêng cho thư giãn, tắm nắng hoặc đắm mình trong bể sục Jacuzzi ngoài trời
                      cùng không gian rộng rãi nhìn ra toàn cảnh Hạ Long.{" "}
                    </p>
                  </div>
                </Col>

                <Col className="my-5 ">
                  <p className="font-bold  text-gray-900 text-4xl ">Quy định chung và lưu ý </p>
                  <Image src={"./images/heading-border.webp"} className="pt-6 " />
                  <p className="flex items-center gap-2 text-base font-medium">
                    Bạn có thể xem Quy định chung và lưu ý:{" "}
                    <Link
                      to={"#"}
                      className="gap-2 hover:text-[#77dada] items-center flex text-[#0e4f4f] fill-[#0e4f4f] bg-transparent"
                    >
                      Tại đây <ArrowRight size={20} />
                    </Link>
                  </p>
                </Col>
                <Col className="my-16 ">
                  <p className="font-bold  text-gray-900 text-4xl ">Câu hỏi thường gặp</p>
                  <Image src={"./images/heading-border.webp"} className="pt-6 " />
                  <p className="flex items-center gap-2 text-base font-medium">
                    Bạn có thể xem Câu hỏi thường gặp:{" "}
                    <Link
                      to={"#"}
                      className="gap-2 hover:text-[#77dada] items-center flex text-[#0e4f4f] fill-[#0e4f4f] bg-transparent"
                    >
                      Tại đây <ArrowRight size={20} />
                    </Link>
                  </p>
                </Col>
                <Col className="my-5 ">
                  <p className="font-bold  text-gray-900 text-4xl ">Bản đồ và lịch trình</p>
                  <Image src={"./images/heading-border.webp"} className="pt-6 " />
                  <div className="gap-4 mt-5 flex flex-col">
                    <div className="relative bg-gray-100 text-gray-700 fill-gray-700 stroke-gray-700 p-4 rounded-2xl shadow-sm border border-gray-300">
                      {/* Close button */}
                      <div className="absolute top-2 p-2 right-2 cursor-pointer">
                        <Close />
                      </div>

                      {/* Info icon */}
                      <div className="flex">
                        <div className="mr-2">
                          <Info />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <label className="text-sm font-medium">Thông tin cần biết:</label>
                          <div className="mt-1">
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>
                                Du thuyền Du thuyền Heritage Bình Chuẩn Cát Bà xuất phát từ Lux Cruises, Lô 28 Cảng Quốc
                                Tế Tuần Châu
                              </li>
                              <li>
                                Bạn có thể xem chi tiết lịch trình 2 ngày 1 đêm.{" "}
                                <Link
                                  to={
                                    "https://docs.google.com/document/d/1mEUXbaHQZmmjGfAuyuYHpRQimyt0y0YJRWjLZnvCa7U/edit?usp=sharing"
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-teal-800 underline"
                                >
                                  tại đây
                                </Link>
                                .
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Google Maps iframe */}
                    <div className="w-full">
                      <iframe
                        title="google-map"
                        width="100%"
                        height="332"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        className="border-0 rounded-3xl"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.7436108855272!2d106.98803167489945!3d20.922632380700293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5ec6c1fba745%3A0xd8c824609119f9db!2zQ-G6o25nIHTDoHUga2jDoWNoIFF14buRYyB04bq_IFR14bqnbiBDaMOidQ!5e0!3m2!1svi!2s!4v1695975094490!5m2!1svi!2s"
                      />
                    </div>
                  </div>
                </Col>

                <Col className="my-5 ">
                  <ReviewSection />
                </Col>
              </div>
            </Col>
            <Col className="w-3/12 pt-10">
              <div class=" mx-auto w-fit  border shadow-lg rounded-xl flex flex-col justify-center items-center bg-white">
                <div class="content py-5 px-6">
                  <p class="title text-xl font-bold text-center text-gray-800">Thông tin du thuyền</p>
                  <hr class="w-full border-t border-gray-300 my-2" />
                  <div class="details space-y-4 pt-4">
                    <div class="item flex gap-6 items-start">
                      <div class="icon-text text-gray-600 flex gap-2 items-center">
                        <FaAnchor size={20} />
                        <p class="font-normal">Hạ Thủy</p>
                      </div>
                      <p class="text-gray-900 font-medium">9999</p>
                    </div>
                    <div class="item flex gap-6 items-start">
                      <div class="icon-text text-gray-600 flex gap-2 items-center">
                        <FaBox size={20} />
                        <p class="font-normal">Cabin</p>
                      </div>
                      <p class="text-gray-900 font-medium">46</p>
                    </div>
                    <div class="item flex gap-6 items-start">
                      <div class="icon-text text-gray-600 flex gap-2 items-center">
                        <FaShip size={20} />
                        <p class="font-normal">Thân vỏ</p>
                      </div>
                      <p class="text-gray-900 font-medium">Kim loại</p>
                    </div>
                    <div class="item flex gap-6 items-start">
                      <div class="icon-text text-gray-600 flex gap-2 items-center">
                        <FaLocationDot size={20} />
                        <p class="font-normal">Hành trình</p>
                      </div>
                      <p class="text-gray-900 font-medium">Vịnh Hạ Long – Hang Sửng Sốt - Hồ Động Tiên - Đảo Titop</p>
                    </div>
                    <div class="item flex gap-6 items-start">
                      <div class="icon-text text-gray-600 flex gap-2 items-center">
                        <FaBriefcase size={20} />

                        <p class="font-normal">Điều hành</p>
                      </div>
                      <p class="text-gray-900 font-medium">Công ty cổ phần thương mại và dịch vụ Sư Tử châu Á</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default DetailBoat;
