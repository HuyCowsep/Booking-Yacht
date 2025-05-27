import React from "react";
import { Box, Typography, Link } from "@mui/material";

const AboutUs = () => {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.background.default,
        fontFamily: "Roboto, Arial, sans-serif",
        color: "text.primary",
        pb: 0,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 1080, mx: "auto", p: { xs: "48px 16px 0 16px", md: "48px 16px 0 16px" } }}>
        {/* Heading */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
          Về 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
        </Typography>
        {/* Section 1 */}
        <Box sx={{ mb: 4.5 }}>
          <Typography component="span" sx={{ fontSize: 18, fontWeight: "bold", color: "text.primary" }}>
            1. Chúng tôi là 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
          </Typography>
          <Typography sx={{ mt: 1.5, color: "text.secondary", maxWidth: 850, lineHeight: 1.7 }}>
            𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com là sản phẩm chính thức của Công ty TNHH Du lịch và dịch vụ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Với niềm đam mê du lịch, ưa khám phá, chúng tôi đã cùng nhau xây dựng một website – nơi mà khách hàng sẽ dễ dàng lựa chọn cho mình cũng như những người thân yêu chuyến nghỉ dưỡng đáng nhớ. 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 chọn lọc các du thuyền, khách sạn và liên kết với các hãng hàng không nhằm cung cấp những dịch vụ đa dạng và tốt nhất cho du khách.
          </Typography>
        </Box>
        {/* Section 2 */}
        <Box sx={{ mb: 5.5 }}>
          <Typography component="span" sx={{ fontSize: 18, fontWeight: "bold", color: "text.primary" }}>
            2. Tại sao chọn chúng tôi?
          </Typography>
          <Typography sx={{ mt: 1.5, color: "text.secondary", maxWidth: 850, lineHeight: 1.7 }}>
            Chúng tôi mong muốn du khách tận hưởng các dịch vụ du lịch chất lượng bằng sự trải nghiệm thực tế của chính đội ngũ của 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮. Các video về du thuyền, khách sạn hay những chuyến bay mà chúng tôi đã ghi lại cũng sẽ được chúng tôi giới thiệu tới du khách. Chính từ những hình ảnh này, quý khách có thể chọn lựa cho mình hay gia đình, bạn bè, đồng nghiệp những chuyến đi ý nghĩa nhất. Chúng tôi chắc chắn sẽ mang lại cho du khách những kỳ nghỉ đáng nhớ với:
          </Typography>

          {/* Box grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
              mt: 3.5,
              maxWidth: 1024,
            }}
          >
            {/* Box 1 */}
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: "18px",
                boxShadow: (theme) => theme.shadows[1],
                p: 3,
                display: "flex",
                gap: 2,
                border: "1px solid",
                borderColor: (theme) => theme.palette.divider,
              }}
            >
              <Box>
                <img
                  src="https://ext.same-assets.com/3852569666/2318023905.svg"
                  alt="Chuyên nghiệp"
                  style={{ width: 36 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1, color: "text.primary" }}>
                  Đội ngũ chuyên nghiệp, tâm huyết
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: 15 }}>
                  Chúng tôi có đội ngũ nhân viên kinh nghiệm, tâm huyết, luôn lắng nghe những thắc mắc, ý kiến của khách hàng thông qua hotline, fanpage để tư vấn sản phẩm phù hợp cũng như xử lý các vấn đề phát sinh trong chuyến đi. Ngoài ra, chúng tôi còn có những nhân viên mới trẻ trung, năng động hứa hẹn sẽ giới thiệu nhiều điểm đến mới hấp dẫn cho du khách.
                </Typography>
              </Box>
            </Box>
            {/* Box 2 */}
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: "18px",
                boxShadow: (theme) => theme.shadows[1],
                p: 3,
                display: "flex",
                gap: 2,
                border: "1px solid",
                borderColor: (theme) => theme.palette.divider,
              }}
            >
              <Box>
                <img
                  src="https://ext.same-assets.com/3852569666/3478103347.svg"
                  alt="Phong phú"
                  style={{ width: 36 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1, color: "text.primary" }}>
                  Sản phẩm phong phú
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: 15 }}>
                  Tại địa chỉ website:{" "}
                  <Link href="https://noexist_example.com" sx={{ color: "primary.main" }}>
                    https://𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com
                  </Link>{" "}
                  của chúng tôi, du khách có thể dễ dàng tìm thấy một du thuyền sang trọng, một chuyến bay khứ hồi hay một khu nghỉ dưỡng tuyệt đẹp ở mọi miền đất nước. Chúng tôi cũng đưa ra những thông tin đầy đủ, hình ảnh thực tế về các dịch vụ chất lượng. Qua đó, du khách sẽ chọn lựa cho mình hoặc cho gia đình bạn bè, đồng nghiệp một chuyến đi phù hợp, an lành, hạnh phúc.
                </Typography>
              </Box>
            </Box>
            {/* Box 3 */}
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: "18px",
                boxShadow: (theme) => theme.shadows[1],
                p: 3,
                display: "flex",
                gap: 2,
                border: "1px solid",
                borderColor: (theme) => theme.palette.divider,
              }}
            >
              <Box>
                <img
                  src="https://ext.same-assets.com/3852569666/3822063303.svg"
                  alt="Giá hấp dẫn"
                  style={{ width: 36 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1, color: "text.primary" }}>
                  Mức giá hấp dẫn
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: 15 }}>
                  𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 luôn cam kết sẽ đem đến các dịch vụ chất lượng với các mức giá tốt nhất. Chúng tôi tin chắc rằng chi phí mà quý khách thanh toán là hoàn toàn xứng đáng. Bên cạnh đó, quý khách cũng có thể tìm thấy nhiều món quà hấp dẫn trong những đợt khuyến mại trên website của chúng tôi.
                </Typography>
              </Box>
            </Box>
            {/* Box 4 */}
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: "18px",
                boxShadow: (theme) => theme.shadows[1],
                p: 3,
                display: "flex",
                gap: 2,
                border: "1px solid",
                borderColor: (theme) => theme.palette.divider,
              }}
            >
              <Box>
                <img
                  src="https://ext.same-assets.com/3852569666/3753958941.svg"
                  alt="Bảo mật"
                  style={{ width: 36 }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1, color: "text.primary" }}>
                  Bảo mật thông tin
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: 15 }}>
                  Chúng tôi cam kết toàn bộ mọi thông tin cá nhân của khách hàng sẽ được giữ bảo mật tuyệt đối. Quý khách có thể toàn yên tâm trải nghiệm dịch vụ thực sự thoải mái và riêng tư. Hy vọng 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮.com sẽ là một địa chỉ tin cậy trong mỗi chuyến đi, mỗi kỳ nghỉ của quý khách.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Section 3: Dịch vụ */}
        <Box sx={{ mb: 4.5 }}>
          <Typography component="span" sx={{ fontSize: 18, fontWeight: "bold", color: "text.primary" }}>
            3. Sản phẩm dịch vụ
          </Typography>
          <Typography sx={{ mt: 1.5, color: "text.secondary", maxWidth: 850, lineHeight: 1.7 }}>
            𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 cung cấp nhiều dịch vụ du lịch phong phú và đa dạng giúp du khách có nhiều lựa chọn:
          </Typography>
          <Box component="ul" sx={{ lineHeight: 1.7, mb: 1, color: "text.secondary" }}>
            <li>Du thuyền Hạ Long với đa dạng du thuyền, phù hợp với từng nhu cầu của du khách</li>
            <li>Đặt phòng khách sạn và resort</li>
          </Box>
          <Typography sx={{ mb: 0, color: "text.secondary" }}>
            Ngoài ra, chúng tôi cũng cung cấp nhiều dịch vụ khác như: thuê xe du lịch cdu thuyền chất lượng cao, thuê hướng dẫn viên du lịch, visa, vé tàu… giúp du khách thoải mái và dễ dàng cho những chuyến du lịch.
          </Typography>
        </Box>

        {/* Section 4: Đối tác */}
        <Typography component="span" sx={{ fontSize: 18, fontWeight: "bold", color: "text.primary" }}>
          4. Đối tác của chúng tôi
        </Typography>
        <Box sx={{ my: 2.5, mb: 4.75, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
          {/* FARES partner box */}
          <Box
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: "16px",
              p: 2.75,
              boxShadow: (theme) => theme.shadows[1],
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
              <img
                src="https://ext.same-assets.com/3852569666/888454979.png"
                alt="fares"
                style={{ height: 34 }}
              />
              <Typography sx={{ fontWeight: 600, fontSize: 16, color: "text.primary" }}>
                Công nghệ thông tin
              </Typography>
              <Link
                href="https://fares.vn/"
                rel="noopener"
                sx={{ ml: "auto", color: "primary.main", fontWeight: 500 }}
              >
                Website
              </Link>
            </Box>
            <Typography sx={{ fontSize: 15, color: "text.secondary", lineHeight: 1.7 }}>
              FARES., JSC cung cấp các giải pháp toàn diện về chuyển đổi số cho doanh nghiệp: Phát triển phần mềm theo yêu cầu, xây dựng hệ thống thông tin, xử lý và phân tích dữ liệu lớn phục vụ chiến lược Marketing, kinh doanh & quản lý. Với đội ngũ chuyên gia tài năng và kinh nghiệm, FARES., JSC cam kết mang đến những giải pháp tối ưu và sáng tạo, giúp khách hàng tận dụng tối đa tiềm năng của công nghệ để nâng cao hiệu suất kinh doanh và tạo cơ sở cạnh tranh trong môi trường kinh doanh ngày càng phức tạp. FARES., JSC đã hỗ trợ và đồng hành cùng 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 trong việc xây dựng hệ thống website, nhằm mang lại cho khách hàng những thông tin nhanh và tin cậy nhất.
            </Typography>
          </Box>
          {/* Zestif partner box */}
          <Box
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: "16px",
              p: 2.75,
              boxShadow: (theme) => theme.shadows[1],
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
              <img
                src="https://ext.same-assets.com/3852569666/673611222.png"
                alt="zestif"
                style={{ height: 34 }}
              />
              <Typography sx={{ fontWeight: 600, fontSize: 16, color: "text.primary" }}>
                Tư vấn thiết kế
              </Typography>
              <Link
                href="https://zestif.com/"
                rel="noopener"
                sx={{ ml: "auto", color: "primary.main", fontWeight: 500 }}
              >
                Website
              </Link>
            </Box>
            <Typography sx={{ fontSize: 15, color: "text.secondary", lineHeight: 1.7 }}>
              Zestif là một công ty công nghệ blockchain có trụ sở tại Hà Lan và Hà Nội, Việt Nam. Công ty được thành lập vào năm 2017 với sứ mệnh mang công nghệ blockchain đến với các doanh nghiệp và tổ chức ở Việt Nam và Hà Lan. Zestif cung cấp các dịch vụ tư vấn, đào tạo và phát triển giải pháp blockchain. Công ty đã triển khai thành công nhiều giải pháp blockchain cho các doanh nghiệp và tổ chức ở Hà Lan, Vương quốc Anh và các quốc gia EU khác.
            </Typography>
          </Box>
        </Box>

        {/* Section 5: Liên hệ */}
        <Typography component="span" sx={{ fontSize: 18, fontWeight: "bold", color: "text.primary" }}>
          5. Liên hệ với chúng tôi:
        </Typography>
        <Box sx={{ my: 3, mb: 4.75 }}>
          <Box
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: "16px",
              p: 3.5,
              maxWidth: 1048,
              fontSize: 15,
              color: "text.secondary",
              lineHeight: 1.7,
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
              boxShadow: (theme) => theme.shadows[1],
            }}
          >
            <Typography component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>
              CÔNG TY TNHH DU LỊCH VÀ DỊCH VỤ 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮
              <br /> 𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 TRAVEL AND SERVICE COMPANY LIMITED
            </Typography>
            <Box sx={{ mt: 2, mb: 0.5, color: "text.secondary" }}>
              Mã số thuế: 88888888888
              <br />
              Giấy phép kinh doanh số: 9999999999
              <br />
              Nơi cấp: Sở KH & ĐT TP Hà Nội.
              <br />
            </Box>
            <Box sx={{ mt: 1.25, mb: 0.5, color: "text.secondary" }}>
              Hà Nội: Km29 Đại học FPT, khu CNC Hoà Lạc, huyện Thạch Thất, TP. Hà Nội
              <br />
              Điện thoại: 0912 202 885
              <br />
              Địa chỉ email: huyndhe176876@fpt.edu.vn
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;