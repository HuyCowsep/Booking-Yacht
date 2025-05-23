import React from "react";
import { Box, Breadcrumbs, Link, Typography, Chip, Container, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import { useParams } from "react-router-dom";

const articles = [
  {
    id: "bun-moc-ha-noi",
    title: "Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử",
    date: "18/05/2025",
    img: "https://storage.googleapis.com/a1aa/image/eaad327a-c20b-40e7-e982-352c9317fea2.jpg",
    intro:
      "Không chỉ có bún chả, bún hải sản… mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hấp dẫn của ẩm thực Hà thành. Món ăn có sự kết hợp giữa nhiều nguyên liệu bình dân nhưng dư vị lại vô cùng thơm ngon, khó cưỡng. Khi tới Hà Nội, bạn nhất định phải thử nhé!",
    content: [
      {
        heading: "1. Quán bún mọc măng tiết ở phố Cầu Đông",
        paragraphs: [
          "Mở cửa hoạt động gần 30 năm, quán bún mọc măng tiết của bà Nguyễn Thị Tính (SN 1954) ở cạnh cổng chợ Cầu Đông (quận Hoàn Kiếm), phía sau chợ Đồng Xuân là một trong những địa chỉ ăn uống quen thuộc của người dân địa phương lẫn du khách.",
          'Gọi là quán nhưng nơi đây thực tế chỉ có 2 hàng bàn ghế nhựa được xếp trên vỉa hè, che chắn bằng bạt xanh. Tới quán, thực khách có thể nhìn thấy gian bếp "lộ thiên" với nồi nước dùng nóng hổi, có nhiều nguyên liệu kèm theo như măng, tiết, mọc,...',
        ],
        image: "https://storage.googleapis.com/a1aa/image/4a34ced4-8b45-4a17-cffd-843437d65f58.jpg",
      },
      {
        heading: "2. Bún mọc Hàng Lược",
        paragraphs: [
          "Nằm trong khu phố cổ, quán bún mọc trên phố Hàng Lược đã trở thành điểm đến quen thuộc vào mỗi sáng của người dân quanh khu vực. Nước dùng trong, thanh ngọt được ninh từ xương ống và không có mùi hôi.",
          "Một tô bún ở đây có đầy đủ mọc thịt, mọc nấm, vài miếng măng và lát tiết mềm. Không gian quán nhỏ nhưng sạch sẽ và phục vụ nhanh nhẹn.",
        ],
        image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/B%C3%BAn_m%E1%BB%8Dc_s%C6%B0%E1%BB%9Dn.jpg",
      },
      {
        heading: "3. Bún mọc Bát Đàn – Hương vị truyền thống",
        paragraphs: [
          "Quán bún mọc tại Bát Đàn thường xuyên đông khách nhờ giữ nguyên hương vị truyền thống nhiều năm qua. Mọc được nặn tay, kết hợp với mộc nhĩ giòn sần sật và thịt băm nhuyễn.",
          "Ngoài mọc, quán còn phục vụ thêm giò tai, giò lụa và tiết luộc. Rau sống ăn kèm luôn tươi mới, tạo nên tổng thể cân bằng giữa vị ngọt của nước và sự thanh mát.",
        ],
        image:
          "https://file.hstatic.net/1000275435/file/bun-doc-mung-bat-dan_95a9b1540ebf4b989081b97e672c587b_grande.jpg",
      },
      {
        heading: "4. Bún mọc Hạnh – Phố Lò Đúc",
        paragraphs: [
          "Bún mọc Hạnh nổi bật với nước dùng đậm vị, chan đầy bát. Quán tọa lạc ở đầu phố Lò Đúc nên khá dễ tìm và có chỗ để xe máy thuận tiện.",
          "Ngoài món chính là bún mọc, quán còn bán kèm bún sườn chua và bún mọc thập cẩm. Mọc ở đây mềm, dậy mùi tiêu và có độ dai vừa phải.",
        ],
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXOKG8w6wUdIOcjM0ulXEdOFl0dZgZmV4kkEWMXBzTkRff-2nE3aPHVjx9pAl1W8vW6rQ&usqp=CAU",
      },
      {
        heading: "5. Bún mọc Hương Lan – Định Công",
        paragraphs: [
          "Bún mọc Hương Lan là lựa chọn yêu thích của sinh viên và dân văn phòng khu vực Định Công. Bát bún đầy đặn với mọc viên to, chả lá lốt và giò bò.",
          "Điểm đặc biệt là nước dùng ở đây có thêm chút dứa và hành nướng, tạo ra hương thơm khó cưỡng. Giá cả phải chăng và phục vụ nhiệt tình.",
        ],
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3RED_g3zbvLf_hfHMO5IYQtwezodUGmsrA&s",
      },
    ],
  },
  {
    id: "banh-xiu-pao",
    title: "Bánh Xíu Páo Nam Định – Món Bánh Nhỏ Mang Hương Vị Lớn",
    date: "08/05/2025",
    img: "https://storage.googleapis.com/a1aa/image/b3a1307c-3297-4dc8-c733-411818cf45f4.jpg",
    intro:
      "Ẩm thực Nam Định từ lâu đã được biết đến với những món ăn vừa mộc mạc, vừa tinh tế – từ phở bò trứ danh đến những chiếc bánh nhỏ gói trọn tâm tình quê hương. Bánh Xíu Páo là một trong số đó – món bánh tuy nhỏ nhưng hương vị đậm đà, cuốn hút, khiến ai từng thử qua cũng không thể quên.",
    content: [
      {
        heading: "1. Nguồn gốc và ý nghĩa của bánh Xíu Páo",
        paragraphs: [
          'Bánh Xíu Páo có nguồn gốc từ người Hoa nhưng qua thời gian đã được người dân Nam Định biến tấu để phù hợp với khẩu vị người Việt. Tên gọi "Xíu Páo" trong tiếng Quảng Đông có nghĩa là "nướng thơm".',
          "Chiếc bánh nhỏ nhắn được làm từ lớp vỏ bánh mì mềm thơm, bên trong là phần nhân gồm thịt xá xíu, trứng cút, mộc nhĩ... tạo nên sự hòa quyện hoàn hảo giữa vị mặn, ngọt và béo.",
        ],
        image:
          "https://i1-dulich.vnecdn.net/2023/07/12/IMG-0138-1689145491.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=wgriBgB5ZohkHPVx8j0DYA",
      },
      {
        heading: "2. Bánh Xíu Páo Bà Cụ - Hơn 70 năm truyền thống",
        paragraphs: [
          "Nằm trên phố Hoàng Văn Thụ, tiệm bánh Xíu Páo Bà Cụ là một trong những nơi nổi tiếng nhất ở Nam Định với truyền thống hơn 70 năm. Mỗi chiếc bánh đều được làm thủ công với công thức bí truyền.",
          "Vỏ bánh được nướng vàng ruộm, phần nhân đậm đà, thơm mùi hạt tiêu và hành phi. Bánh được bọc trong giấy thấm dầu mộc mạc, mang lại cảm giác thân quen.",
        ],
        image:
          "https://i1-dulich.vnecdn.net/2023/07/12/IMG-0132-1689145502.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=V9QuwsUZEO3QeALBKSnqBw",
      },
      {
        heading: "3. Những địa điểm bán Xíu Páo ngon khác tại Nam Định",
        paragraphs: [
          "Ngoài tiệm Bà Cụ, bạn có thể tìm thấy bánh Xíu Páo ngon tại các chợ truyền thống như chợ Rồng, chợ Giết hay các cửa hàng quanh khu vực đường Trần Hưng Đạo.",
          "Giá mỗi chiếc bánh chỉ khoảng 10.000 - 15.000 đồng, rất phù hợp cho bữa ăn nhẹ hoặc mua làm quà sau chuyến đi.",
        ],
        image: "https://poliva.vn/wp-content/uploads/2019/04/banh-xiu-pao-nam-dinh-1.jpg",
      },
    ],
  },
  {
    id: "du-lich-ha-long",
    title: "Du lịch Hạ Long - thời gian nào là đẹp nhất?",
    date: "24/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/89346d98-2e05-4bec-8bd7-25e0035cf891.jpg",
    intro:
      "Hạ Long – vùng di sản thiên nhiên thế giới được UNESCO công nhận – luôn nằm trong top điểm đến hấp dẫn nhất miền Bắc. Nhưng để có trải nghiệm trọn vẹn nhất, việc chọn thời điểm du lịch hợp lý là điều vô cùng quan trọng.",
    content: [
      {
        heading: "1. Mùa hè (tháng 5 - 8): Du lịch biển lý tưởng",
        paragraphs: [
          "Khoảng thời gian từ tháng 5 đến tháng 8 là mùa hè – mùa lý tưởng để du lịch Hạ Long. Trời trong, nắng đẹp, nước biển xanh ngắt rất phù hợp để tắm biển, chèo kayak và tham quan các hang động kỳ vĩ.",
          "Tuy nhiên, cần lưu ý đây cũng là mùa mưa bão, bạn nên theo dõi dự báo thời tiết trước khi lên kế hoạch.",
        ],
        image: "https://bazaarvietnam.vn/wp-content/uploads/2025/04/harper-bazaar-du-lich-ha-long-5.jpg",
      },
      {
        heading: "2. Mùa thu (tháng 9 - 11): Thời tiết đẹp, ít mưa",
        paragraphs: [
          "Thời điểm này trời thu mát mẻ, ít mưa, thích hợp cho những ai thích không khí yên bình và trải nghiệm du thuyền trên vịnh.",
          "Lượng khách du lịch không quá đông như mùa hè, giá dịch vụ cũng ổn định hơn.",
        ],
        image: "https://bazaarvietnam.vn/wp-content/uploads/2025/04/harper-bazaar-du-lich-ha-long-6.jpg",
      },
      {
        heading: "3. Mùa xuân (tháng 2 - 4): Dịu nhẹ, lý tưởng cho nghỉ dưỡng",
        paragraphs: [
          "Đây là khoảng thời gian sau Tết, khí hậu ôn hòa, rất phù hợp cho các chuyến đi nghỉ dưỡng kết hợp lễ chùa, khám phá văn hóa địa phương.",
          "Bạn có thể tận hưởng khung cảnh sương mờ trên vịnh buổi sớm – một vẻ đẹp huyền ảo chỉ có ở Hạ Long mùa xuân.",
        ],
        image:
          "https://bazaarvietnam.vn/wp-content/uploads/2025/04/harper-bazaar-cac-dia-diem-du-lich-ha-long-1-e1744295874283.jpeg",
      },
    ],
  },
  {
    id: "bien-hoi-an",
    title: "Khám phá 5 bãi biển nổi bật tại Hội An cho mùa hè này",
    date: "22/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/5d022070-5037-46b2-9eeb-4b40e710d124.jpg",
    intro:
      "Hội An không chỉ nổi tiếng với phố cổ thơ mộng mà còn có những bãi biển tuyệt đẹp cho những ai muốn tận hưởng kỳ nghỉ hè sôi động. Nếu bạn đang có kế hoạch đến Hội An mùa hè này, đừng bỏ lỡ 5 bãi biển nổi bật dưới đây – nơi hội tụ vẻ đẹp thiên nhiên hoang sơ cùng các hoạt động biển thú vị.",
    content: [
      {
        heading: "1. Biển An Bàng – Biển xanh cát trắng bình yên",
        paragraphs: [
          "Biển An Bàng cách phố cổ Hội An chỉ khoảng 4km, nổi bật với không khí yên bình, làn nước trong xanh và bãi cát mịn. Đây là lựa chọn lý tưởng để thư giãn, tắm nắng và thưởng thức hải sản tươi sống.",
          "An Bàng còn được các tạp chí du lịch nước ngoài vinh danh là một trong những bãi biển đẹp nhất châu Á.",
        ],
        image: "https://statics.vinwonders.com/bai-bien-ha-my-1_1633328009.jpg",
      },
      {
        heading: "2. Biển Cửa Đại – Địa điểm du lịch sôi động",
        paragraphs: [
          "Cửa Đại là bãi biển nổi tiếng nhất Hội An, thu hút đông đảo khách du lịch nhờ không gian rộng lớn và nhiều hoạt động như cano kéo dù, mô tô nước,…",
          "Đây cũng là nơi lý tưởng để đón bình minh hoặc hoàng hôn, khi mặt trời phủ lên mặt biển một màu vàng cam tuyệt đẹp.",
        ],
        image: "https://statics.vinwonders.com/bai-bien-ha-my-2_1632824191.jpg",
      },
      {
        heading: "3. Bãi biển Hà My – Viên ngọc hoang sơ",
        paragraphs: [
          'Nằm giữa Đà Nẵng và Hội An, bãi biển Hà My còn khá vắng vẻ, giữ được nét hoang sơ vốn có. Cát trắng trải dài, nước biển xanh biếc và hàng dừa rì rào tạo nên khung cảnh lý tưởng để "trốn khỏi thế giới".',
          "Nhiều resort cao cấp đã xây dựng tại đây nhưng không làm mất đi vẻ yên bình đặc trưng.",
        ],
        image: "https://statics.vinwonders.com/bai-bien-ha-my-4_1632824257.jpg",
      },
      {
        heading: "4. Biển Rạng – Khám phá làng chài",
        paragraphs: [
          "Biển Rạng không nổi bật về du lịch nhưng lại là nơi để bạn cảm nhận trọn vẹn cuộc sống làng chài của ngư dân Hội An. Đến đây, bạn có thể tham gia kéo lưới, ăn hải sản vừa đánh bắt và trò chuyện cùng người dân địa phương.",
          "Một trải nghiệm bình dị, gần gũi nhưng vô cùng đáng nhớ.",
        ],
        image: "https://statics.vinwonders.com/bai-bien-ha-my-8_1632824369.jpg",
      },
      {
        heading: "5. Biển Tân Thành – Địa điểm ngắm hoàng hôn lý tưởng",
        paragraphs: [
          'Biển Tân Thành còn được gọi là "thiên đường sống ảo" mới nổi tại Hội An với bãi cát đen đặc trưng và không khí mát mẻ. Vào buổi chiều, bạn có thể bắt gặp nhiều nhóm bạn trẻ, cặp đôi đến đây ngắm hoàng hôn và chụp ảnh.',
          "Ngoài ra còn có nhiều quán cafe ven biển phong cách boho rất chill.",
        ],
        image: "https://statics.vinwonders.com/bai-bien-ha-my-7_1632824345.jpg",
      },
    ],
  },
  {
    id: "lang-tam-o-hue",
    title: "Top 5 Lăng Tẩm Đẹp Nhất Ở Huế – Những Di Sản Trường Tồn Cùng Thời Gian",
    date: "18/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/24c33b8c-a232-4173-4fd2-4ba39ca9d97d.jpg",
    intro:
      "Huế – mảnh đất của những hoài niệm, nơi thời gian dường như chậm lại với tiếng chuông chùa, tiếng nước sông Hương và đặc biệt là những lăng tẩm uy nghi, cổ kính của triều Nguyễn. Dưới đây là 5 lăng tẩm nổi bật bạn không nên bỏ lỡ khi đến với vùng đất Cố đô.",
    content: [
      {
        heading: "1. Lăng Tự Đức – Vẻ đẹp thơ mộng giữa rừng thông",
        paragraphs: [
          "Lăng Tự Đức (khiêm Cung) là nơi yên nghỉ của vua Tự Đức – vị vua trị vì lâu nhất triều Nguyễn. Khuôn viên lăng mang đậm nét thi vị, được ví như một công viên thơ mộng với hồ nước, rừng thông và kiến trúc hài hòa với thiên nhiên.",
          "Đây cũng là nơi vua thường lui tới nghỉ ngơi, làm thơ khi còn sống.",
        ],
        image: "https://statics.vinwonders.com/lang-minh-mang-hue-1_1690357157.jpg",
      },
      {
        heading: "2. Lăng Minh Mạng – Sự cân bằng và uy nghi",
        paragraphs: [
          "Lăng Minh Mạng được đánh giá là công trình quy hoạch tổng thể hài hòa nhất với thiên nhiên. Kiến trúc đối xứng qua trục chính thể hiện tư tưởng Nho giáo và quyền lực vương triều.",
          "Nằm giữa không gian sông nước hữu tình, lăng là biểu tượng của sự quy củ và trang nghiêm.",
        ],
        image: "https://statics.vinpearl.com/lang-minh-mang-hue-2_1624691360.jpg",
      },
      {
        heading: "3. Lăng Khải Định – Giao thoa văn hóa Đông – Tây",
        paragraphs: [
          "Lăng Khải Định là công trình độc đáo kết hợp giữa kiến trúc Á – Âu, giữa truyền thống và hiện đại. Nằm trên núi Châu Chữ, lăng có thiết kế bậc thang cao với nhiều họa tiết tinh xảo bằng sành sứ và thủy tinh.",
          "Điểm nhấn là điện Khải Thành với tượng vua ngồi uy nghi và bức tranh Cửu Long ấn tượng trên trần.",
        ],
        image: "https://statics.vinwonders.com/lang-minh-mang-hue-4_1624691405.jpg",
      },
      {
        heading: "4. Lăng Gia Long – Hoang sơ và trầm mặc",
        paragraphs: [
          "Nằm xa trung tâm, lăng Gia Long (Thiên Thọ Lăng) ít người biết đến nhưng lại mang vẻ đẹp cổ kính và bình yên hiếm có. Đây là lăng của vị vua sáng lập triều Nguyễn, có vị trí đắc địa với núi, sông bao quanh.",
          "Không gian yên tĩnh cùng rêu phong cổ kính tạo cảm giác trầm mặc, hoài niệm.",
        ],
        image: "https://statics.vinwonders.com/lang-minh-mang-hue-7_1624691623.jpg",
      },
      {
        heading: "5. Lăng Đồng Khánh – Lăng chuyển tiếp giữa hai triều đại",
        paragraphs: [
          "Lăng Đồng Khánh là công trình có sự pha trộn giữa lối kiến trúc cổ điển của Huế và nét cách tân do ảnh hưởng của Pháp. Dù quy mô không lớn như các lăng khác, nhưng lăng vẫn nổi bật với nghệ thuật điêu khắc và trang trí công phu.",
          "Đây là nơi lưu giữ dấu ấn của giai đoạn chuyển giao trong lịch sử triều Nguyễn.",
        ],
        image: "https://statics.vinwonders.com/lang-minh-mang-hue-_1624702173.jpg",
      },
    ],
  },

  // Bạn có thể thêm nhiều bài viết khác tại đây
];

export default function BlogDetail() {
  const { id } = useParams();
  const article = articles.find((a) => a.id === id);
  const theme = useTheme();

  if (!article) {
    return (
      <Container maxWidth="lg" sx={{ pt: 10 }}>
        <Typography variant="h6" color="error">
          Không tìm thấy bài viết.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.primary,
        backgroundImage: (theme) =>
          theme.palette.mode === "light" ? `url(https://mixivivu.com/section-background.png)` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box display="flex" alignItems="center" mb={3} fontSize="0.875rem" color="gray">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" sx={{ display: "flex", alignItems: "center" }}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/blog">
              Blogs
            </Link>
            <Typography color="primary">{article.title}</Typography>
          </Breadcrumbs>
        </Box>

        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          {article.title}
        </Typography>

        {/* Date */}
        <Chip
          label={article.date}
          size="small"
          sx={{
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            fontSize: "1rem",
            borderRadius: "9999px",
          }}
        />

        <Box mt={3} mb={6} display="flex" alignItems="center">
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ color: "#FFD700" }} />
          ))}
        </Box>

        {/* Intro paragraph */}
        <Typography variant="body1" color="text.secondary" fontStyle="italic" mb={6} maxWidth="600px" lineHeight={1.75}>
          {article.intro}
        </Typography>

        {/* Main image */}
        <Box
          component="img"
          src={article.img}
          alt={article.title}
          sx={{
            width: "100%",
            borderRadius: "12px",
            objectFit: "cover",
            mb: 6,
          }}
        />

        {/* Article content */}
        <Box maxWidth="md">
          {article.content.map((section, index) => (
            <Box key={index} mb={6}>
              <Typography variant="body1" fontWeight="bold" fontSize="1.5rem" color="text.primary" mb={1}>
                {section.heading}
              </Typography>
              {section.paragraphs.map((p, i) => (
                <Typography key={i} variant="body1" color="text.secondary" mb={2} lineHeight={1.75}>
                  {p}
                </Typography>
              ))}
              {section.image && (
                <Box
                  component="img"
                  src={section.image}
                  alt={section.heading}
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: "12px",
                    objectFit: "cover",
                    mt: 2,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
//BlogDetail
