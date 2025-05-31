import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { HouseFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import ImageCarousel from "../components/DetailBoat/ImageCarousel";
import Tabs from "../components/DetailBoat/Tabs";
import RoomSelector from "../components/DetailBoat/RoomSelector";
import BoatInfo from "../components/DetailBoat/BoatInfo";
import ReviewSection from "../components/DetailBoat/ReviewSection";
import { Image } from "react-bootstrap";
import { ArrowRight, CircleCheckBig } from "lucide-react";
import NewWindow from "react-new-window";
import {
  fetchReviews,
  openRegulationsWindow,
  closeRegulationsWindow,
  openFaqWindow,
  closeFaqWindow,
  setActiveTab,
} from "../redux/action";
import { fetchServices, fetchYachtById } from "../redux/asyncActions";

function DetailBoat() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentYacht, loading, error } = useSelector((state) => state.yacht);
  const { ratingData } = useSelector((state) => state.reviews);
  const servicesState = useSelector((state) => state.services) || {};
  const services = servicesState.data || [];
  const totalReviews = useSelector(
    (state) => state.reviews.ratingData?.total || 0
  );
  const {
    windows: { showRegulationsWindow, showFaqWindow },
  } = useSelector((state) => state.ui);

  const sectionRefs = useRef({
    features: null,
    rooms: null,
    introduction: null,
    regulations: null,
    reviews: null,
  });

  useEffect(() => {
    dispatch(fetchYachtById(id));
    dispatch(fetchReviews(id));
    dispatch(fetchServices(id)); // Updated to pass yachtId
  }, [dispatch, id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Object.keys(sectionRefs.current).indexOf(
              entry.target.id
            );
            if (index !== -1) {
              dispatch(setActiveTab(index));
            }
          }
        });
      },
      { rootMargin: "-100px 0px 0px 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [dispatch]);

  // const handleBookNow = () => {
  //   Swal.fire({
  //     title: "Đặt hàng thành công!",
  //     text: "Cảm ơn bạn đã đặt hàng với chúng tôi!",
  //     icon: "success",
  //     confirmButtonText: "OK",
  //   });
  // };

  const handleScrollToMap = (e) => {
    e.preventDefault();
    const mapSection = document.getElementById("map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading || !currentYacht) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const formatPrice = currentYacht.price
    ? currentYacht.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      "đ / khách"
    : "Chưa có giá";

  return (
    <div className="font-archivo">
      <div className="border-b my-4 pb-2">
        <Container maxWidth="lg" className="py-1">
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            className="flex gap-3"
          >
            <Link to="/" className="flex items-center hover:text-cyan-500">
              <HouseFill size={25} className="mr-2" />
            </Link>
            <Link
              to="/find-boat"
              className="flex items-center hover:text-cyan-500 !font-archivo"
              color="text.secondary"
            >
              Tìm du thuyền
            </Link>
            <Typography
              color="text.primary"
              className="!font-archivo hover:text-cyan-500"
            >
              {currentYacht.name}
            </Typography>
          </Breadcrumbs>
        </Container>
      </div>
      <Container className="py-10 font-archivo">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-8/12">
            <h1
              className="text-4xl font-bold light:text-gray-900"
              color="text.primary"
            >
              {currentYacht.name}
            </h1>
            <div className="flex items-center gap-2 my-5">
              <span className="bg-yellow-200 text-sm font-medium text-orange-800 rounded-2xl px-3 py-1 flex items-center">
                <svg
                  className="w-3 h-3 mr-1 fill-yellow-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {ratingData?.average} ({totalReviews}) đánh giá
              </span>
              <Link
                to="#"
                onClick={handleScrollToMap}
                className="flex text-sm items-center bg-gray-100 text-gray-700 rounded-2xl px-3 py-1"
              >
                <span>{currentYacht.IdCompanys.address}</span>
                <span className="light:text-teal-400 dark:text-teal-600 underline pl-2">
                  Xem bản đồ và lịch trình
                </span>
              </Link>
            </div>
            <Image src="../icons/heading-border.webp" className="my-4" />
          </div>
          <div className="md:w-4/12 flex flex-col">
            <p className="text-4xl font-bold light:text-teal-800 dark:text-teal-400">
              {formatPrice}
            </p>
          </div>
        </div>
      </Container>
      <ImageCarousel yachtId={id} />
      <Container className="py-20">
        <div className="sticky top-[83px] z-10 rounded-3xl">
          <Tabs />
        </div>
        <div className="flex flex-col md:flex-row mt-10 gap-6">
          <div className="md:w-8/12">
            <div
              id="features"
              className="scroll-mt-32"
              ref={(el) => (sectionRefs.current.features = el)}
            >
              <h2 className="text-4xl font-bold light:text-gray-900 dark:text.primary">
                Đặc điểm nổi bật
              </h2>
              <img
                src="../icons/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {services.slice(0, 6).map((service, idx) => (
                    <div key={service._id} className="flex items-center gap-3">
                      <CircleCheckBig size={20} color="#04efef" />
                      <p
                        className="text-base"
                        style={{ fontSize: "16px", color: "#457467" }}
                      >
                        {service.serviceId?.serviceName || "Unnamed Service"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-teal-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  <p className="text-base">{currentYacht.description}</p>
                </div>
              </div>
            </div>
            <div
              id="rooms"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.rooms = el)}
            >
              <RoomSelector yachtId={id} yachtData={currentYacht} />
            </div>
            <div
              id="introduction"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.introduction = el)}
            >
              <h2 className="text-4xl font-bold light:text-gray-900 dark:text.primary">
                Giới thiệu
              </h2>
              <img
                src="../icons/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="text-base">
                <p className="text-3xl font-bold my-4">
                  Giới thiệu về du thuyền
                </p>
                <Image
                  src="../images/yacht-2.jpg"
                  className="rounded-3xl mb-4"
                />
                <p className="my-2">{currentYacht.description}</p>
                <Image
                  src="../images/yacht-3.jpg"
                  className="rounded-3xl w-full mb-4"
                />
                <p className="my-2">
                  Du thuyền {currentYacht.name} có thiết kế tinh tế với thân vỏ
                  làm từ {currentYacht.hullBody}. Hành trình khám phá{" "}
                  {currentYacht.itinerary} mang đến trải nghiệm độc đáo giữa
                  lòng {currentYacht.locationId.name}.
                </p>
              </div>
            </div>
            <div
              id="regulations"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.regulations = el)}
            >
              <h2 className="text-4xl font-bold light:light:text-gray-900">
                Quy định chung và lưu ý
              </h2>
              <img
                src="../icons/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <p className="flex items-center gap-2 text-base font-medium">
                Bạn có thể xem Quy định chung và lưu ý:{" "}
                <Link
                  to="#"
                  onClick={() => dispatch(openRegulationsWindow())}
                  className="flex items-center text-teal-800 hover:text-teal-400"
                >
                  Tại đây <ArrowRight size={20} />
                </Link>
                {showRegulationsWindow && (
                  <NewWindow
                    onUnload={() => dispatch(closeRegulationsWindow())}
                    title="Quy định chung và lưu ý"
                    features={{ width: 800, height: 600 }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col gap-3 font-archivo justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold">
                          Quy định chung và lưu ý
                        </h2>
                        <img src="../icons/heading-border.webp" alt="Divider" />
                      </div>
                      <div className="space-y-4 font-archivo">
                        <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                          <h3 className="font-semibold">
                            Thời gian nhận phòng:
                          </h3>
                          <p>
                            Giờ nhận phòng từ 12h15-12h30. Nếu quý khách không
                            sử dụng dịch vụ xe đưa đón của tàu và tự di chuyển,
                            vui lòng có mặt tại bến tàu muộn nhất là 11h45 để
                            làm thủ tục trước khi lên tàu.
                          </p>
                        </div>
                        <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                          <h3 className="font-semibold">Thời gian trả phòng</h3>
                          <p>
                            Giờ trả phòng từ 9h30-10h30 tùy thuộc vào lịch trình
                            của tàu. Sau khi trả phòng, quý khách sẽ được phục
                            vụ bữa trưa trên tàu trước khi tàu cập bến.
                          </p>
                        </div>
                        <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                          <h3 className="font-semibold">
                            Giá phòng đã bao gồm
                          </h3>
                          <ul className="list-disc list-inside">
                            <li>Hướng dẫn viên trên tàu</li>
                            <li>
                              Các bữa ăn theo tiêu chuẩn (01 bữa trưa, 01 bữa
                              tối, 01 bữa sáng, 1 bữa trưa nhẹ)
                            </li>
                            <li>
                              Lớp học nấu ăn, Bơi lội (nếu thời tiết cho phép),
                              xem phim, câu mực, xem tivi vệ tinh
                            </li>
                            <li>Phòng tập gym trên tàu</li>
                            <li>
                              Vé tham quan các điểm trong lịch trình (nếu có)
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                          <h3 className="font-semibold">Huỷ đặt phòng</h3>
                          <p>
                            Những mức giá tốt trên đây đều có điều kiện chung là
                            không được hoàn/hủy và được phép đổi ngày. Quý khách
                            vui lòng liên hệ với chúng tôi để nhận được sự hỗ
                            trợ tốt nhất.
                          </p>
                        </div>
                      </div>
                    </div>
                  </NewWindow>
                )}
              </p>
            </div>{" "}
            <div id="map" className="mt-16 scroll-mt-32">
              <h2 className="text-4xl font-bold light:text-gray-900">
                Bản đồ và lịch trình
              </h2>
              <img
                src="../icons/heading-border.webp"
                alt="Divider"
                className="my-6"
              />
              <div className="relative w-full h-96 bg-gray-200 rounded-3xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019216683743!2d-122.41941568468132!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f5a3d7d7d%3A0x7b7b7b7b7b7b7b7b!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Map"
                ></iframe>
              </div>
            </div>
            <div
              id="reviews"
              className="mt-16 scroll-mt-32"
              ref={(el) => (sectionRefs.current.reviews = el)}
            >
              <ReviewSection yachtId={id} />
            </div>
          </div>
          <BoatInfo />
        </div>
      </Container>
      {showFaqWindow && (
        <NewWindow
          onUnload={() => dispatch(closeFaqWindow())}
          title="Câu hỏi thường gặp"
          features={{ width: 800, height: 600 }}
        >
          <div className="p-6">
            <div className="flex flex-col gap-3 font-archivo justify-between items-start mb-4">
              <h2 className="text-3xl font-bold">Câu hỏi thường gặp</h2>
              <img src="../icons/heading-border.webp" alt="Divider" />
            </div>
            <div className="space-y-4 font-archivo">
              <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                <h3 className="font-semibold">Thời gian nhận phòng:</h3>
                <p>
                  Giờ nhận phòng từ 12h15-12h30. Nếu quý khách không sử dụng
                  dịch vụ xe đưa đón của tàu và tự di chuyển, vui lòng có mặt
                  tại bến tàu muộn nhất là 11h45 để làm thủ tục trước khi lên
                  tàu.
                </p>
              </div>
              <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                <h3 className="font-semibold">Thời gian trả phòng</h3>
                <p>
                  Giờ trả phòng từ 9h30-10h30 tùy thuộc vào lịch trình của tàu.
                  Sau khi trả phòng, quý khách sẽ được phục vụ bữa trưa trên tàu
                  trước khi tàu cập bến.
                </p>
              </div>
              <div className="space-y-2 border p-4 rounded-2xl bg-gray-100 shadow-2xl">
                <h3 className="font-semibold">Chính sách hủy phòng</h3>
                <p>
                  Đặt phòng không được hoàn/hủy nhưng có thể đổi ngày nếu thông
                  báo trước ít nhất 7 ngày. Vui lòng liên hệ để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        </NewWindow>
      )}
    </div>
  );
}

export default DetailBoat;
