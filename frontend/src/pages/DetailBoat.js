import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import { HouseFill } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import ImageCarousel from "../components/DetailBoat/ImageCarousel";
import Tabs from "../components/DetailBoat/Tabs";
import RoomSelector from "../components/DetailBoat/RoomSelector";
import BoatInfo from "../components/DetailBoat/BoatInfo";
import ReviewSection from "../components/DetailBoat/ReviewSection";
import { Image } from "react-bootstrap";
import { ArrowRight, CircleCheckBig } from "lucide-react";
import { fetchReviews, setActiveTab } from "../redux/actions";
import { fetchServices } from "../redux/asyncActions/servicesAsyncActions";
import { fetchYachtById } from "../redux/asyncActions/yachtAsyncActions";

function DetailBoat() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentYacht, loading, error } = useSelector((state) => state.yacht);
  const { ratingData } = useSelector((state) => state.reviews);
  const services = useSelector((state) => state.services?.data) || [];
  const totalReviews = useSelector(
    (state) => state.reviews.ratingData?.total || 0
  );

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
    dispatch(fetchServices(id));
  }, [dispatch, id]);

  useEffect(() => {
    const currentRefs = { ...sectionRefs.current };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Object.keys(currentRefs).indexOf(entry.target.id);
            if (index !== -1) {
              dispatch(setActiveTab(index));
            }
          }
        });
      },
      { rootMargin: "-100px 0px 0px 0px", threshold: 0.1 }
    );

    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [dispatch]);

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

  return (
    <div className="font-archivo">
      <div className="border-b my-4 pb-2">
        <Container maxWidth="lg" className="py-1">
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            className="flex gap-3"
          >
            <Link
              to="/"
              className="flex items-center text-teal-600 hover:text-cyan-500"
            >
              <HouseFill size={25} className="mr-2" />
            </Link>
            <Link
              to="/find-boat"
              className="flex items-center text-teal-600 hover:text-cyan-500 !font-archivo"
              color="text.primary"
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
            <div className="flex items-center gap-2 my-2">
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
              Liên hệ
            </p>
          </div>
        </div>
      </Container>
      <ImageCarousel yachtId={id} />
      <Container className="py-20">
        {/* Thanh điều hướng */}
        <div className="sticky top-[100px] z-10 rounded-3xl">
          <Tabs />
        </div>

        <div className="flex flex-col md:flex-row mt-10 gap-6">
          <div className="md:w-8/12">
            {/* Đặc điểm nổi bật của YACHT */}
            <div
              id="features"
              className="scroll-mt-44"
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
              <div className="space-y-1 grid grid-cols-2 ">
                {services && services.length > 0 ? (
                  services.slice(0, 6).map((service, idx) => (
                    <div
                      key={service._id || idx}
                      className="flex items-center gap-1"
                    >
                      <CircleCheckBig
                        size={20}
                        color="#04efef"
                        className="mt-3"
                      />
                      <p
                        className="text-base mt-3 pt-1"
                        style={{ fontSize: "18px", color: "text.primary" }}
                      >
                        {service.serviceId?.serviceName ||
                          service.serviceName ||
                          "Unnamed Service"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Chưa có dịch vụ cho du thuyền này.</p>
                )}
              </div>
              <div className="mt-4 pr-5">
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
                  <p className="text-base" style={{ fontSize: "18px" }}>
                    {currentYacht.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Phòng & Giá để đặt phòng của YACHT */}
            <div
              id="rooms"
              className="mt-16 scroll-mt-44"
              ref={(el) => (sectionRefs.current.rooms = el)}
            >
              <RoomSelector yachtId={id} yachtData={currentYacht} />
            </div>

            {/* Giới thiệu của YACHT */}
            <div
              id="introduction"
              className="mt-16 scroll-mt-44"
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

            {/* Quy định chung và lưu ý */}
            <div
              id="regulations"
              className="mt-16 scroll-mt-44"
              ref={(el) => (sectionRefs.current.regulations = el)}
            >
              <h2 className="text-4xl font-bold light:text-gray-900">
                Quy Định Chung Và Lưu Ý
              </h2>
              <img src="/images/border.jpg" alt="Divider" className="my-6" />
              <p className="flex items-center gap-2 text-base font-medium">
                Bạn có thể xem Quy Định Chung Và Lưu Ý:{" "}
                <Link
                  to="/quy-dinh-chung-va-luu-y"
                  className="flex items-center text-teal-400 hover:text-teal-800"
                  target="_blank" //mở trong tab mới
                  rel="noopener noreferrer" // bảo mật khi mở tab mới
                >
                  Tại đây <ArrowRight size={20} />
                </Link>
              </p>
            </div>

            {/* Các câu hỏi thường gặp */}
            <div id="faq" className="mt-16 scroll-mt-44">
              <h2 className="text-4xl font-bold light:text-gray-900">
                Các Câu Hỏi Thường Gặp
              </h2>
              <img src="/images/border.jpg" alt="Divider" className="my-6" />
              <p className="flex items-center gap-2 text-base font-medium">
                Bạn có thể xem Các Câu Hỏi Thường Gặp:{" "}
                <Link
                  to="/cau-hoi-thuong-gap"
                  className="flex items-center text-teal-400 hover:text-teal-800"
                  target="_blank" // mở trong tab mới
                  rel="noopener noreferrer" // bảo mật khi mở tab mới
                >
                  Tại đây <ArrowRight size={20} />
                </Link>
              </p>
            </div>

            {/* bản đồ và lịch trình */}
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

            {/* đánh giá sao */}
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
    </div>
  );
}

export default DetailBoat;
