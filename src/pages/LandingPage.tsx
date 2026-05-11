import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Heart, 
  Stethoscope, 
  Microscope, 
  ShieldPlus,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const handleTimeUpdate = () => {
      const duration = video.duration;
      const current = video.currentTime;

      if (!duration || isNaN(duration)) {
        animationFrameId = requestAnimationFrame(handleTimeUpdate);
        return;
      }

      if (current < 0.5) {
        video.style.opacity = (current / 0.5).toString();
      } else if (duration - current < 0.5) {
        video.style.opacity = ((duration - current) / 0.5).toString();
      } else {
        video.style.opacity = "1";
      }

      animationFrameId = requestAnimationFrame(handleTimeUpdate);
    };

    const handleEnded = () => {
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("play", () => {
      animationFrameId = requestAnimationFrame(handleTimeUpdate);
    });
    video.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-grey-blue">
      {/* Hero Section with Medical Video Background */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0 }}
        >
          <source src="/e_cf_e_b_f_mp_.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for clean clinical feel */}
        <div className="absolute inset-0 z-0 bg-white/20"></div>

        {/* Floating Navbar */}
        <header className="absolute top-0 left-0 right-0 z-20 w-full px-6 md:px-12 lg:px-16 pt-6">
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
            {/* Logo area */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-bold font-montserrat text-deep-navy">
                MEDICARE®
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center text-base font-medium">
              <a href="#specialties" className="text-deep-navy hover:text-medical-blue transition">Chuyên khoa</a>
              <a href="#doctors" className="text-grey-blue hover:text-deep-navy transition">Đội ngũ bác sĩ</a>
              <a href="#technology" className="text-grey-blue hover:text-deep-navy transition">Công nghệ</a>
              <a href="#news" className="text-grey-blue hover:text-deep-navy transition">Tin tức</a>
              <a href="#contact" className="text-grey-blue hover:text-deep-navy transition">Liên hệ</a>
            </nav>

            <div className="hidden md:block">
              <button className="bg-medical-blue text-white px-6 py-2.5 rounded-full font-medium hover:scale-105 transition-transform duration-300 shadow-sm">
                Đặt lịch khám
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-deep-navy hover:text-medical-blue focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </header>

        {/* Center Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold font-montserrat tracking-[-1px] text-deep-navy animate-fade-rise">
            Chăm sóc bằng <span className="text-medical-blue italic">tâm</span>, vươn tầm <span className="text-medical-blue italic">quốc tế</span>.
          </h1>
          
          <p className="text-lg max-w-3xl mt-6 leading-relaxed text-grey-blue animate-fade-rise-delay">
            Hệ thống y tế dẫn đầu với công nghệ chẩn đoán tiên tiến và đội ngũ chuyên gia tận tâm. Chúng tôi đồng hành cùng bạn trên hành trình bảo vệ sức khỏe trọn đời.
          </p>
          
          <button className="bg-medical-blue text-white rounded-full px-12 py-4 text-lg mt-10 font-medium hover:bg-deep-navy transition-colors animate-fade-rise-delay-2">
            Tìm hiểu dịch vụ
          </button>
        </div>
      </section>

      {/* Stats / Features Banner */}
      <div className="bg-teal-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center"
          >
            {[
              { stat: "20+", label: "Năm kinh nghiệm" },
              { stat: "500+", label: "Y Bác sĩ giỏi" },
              { stat: "1M+", label: "Bệnh nhân tin tưởng" },
              { stat: "24/7", label: "Cấp cứu & Hỗ trợ" },
            ].map((item, index) => (
              <motion.div key={index} variants={slideUp}>
                <p className="text-4xl font-extrabold text-teal-200">{item.stat}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Chuyên khoa nổi bật</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Hệ thống chuyên khoa đa dạng, đáp ứng toàn diện nhu cầu chăm sóc sức khỏe.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Service Card 1 */}
            <motion.div 
              variants={slideUp}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tim mạch</h3>
              <p className="text-gray-600 mb-4">Chẩn đoán và điều trị chuyên sâu các bệnh lý về tim mạch với hệ thống máy móc tiên tiến nhất.</p>
              <span className="text-teal-600 font-medium inline-flex items-center group-hover:text-teal-800 transition">
                Chi tiết <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>

            {/* Service Card 2 */}
            <motion.div 
              variants={slideUp}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Khám tổng quát</h3>
              <p className="text-gray-600 mb-4">Gói khám sức khỏe định kỳ đa dạng, thiết kế phù hợp cho từng cá nhân và doanh nghiệp.</p>
              <span className="text-teal-600 font-medium inline-flex items-center group-hover:text-teal-800 transition">
                Chi tiết <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>

            {/* Service Card 3 */}
            <motion.div 
              variants={slideUp}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                <Microscope size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Xét nghiệm & Chẩn đoán</h3>
              <p className="text-gray-600 mb-4">Hệ thống phòng lab đạt chuẩn quốc tế, cho kết quả nhanh chóng và chính xác tuyệt đối.</p>
              <span className="text-teal-600 font-medium inline-flex items-center group-hover:text-teal-800 transition">
                Chi tiết <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button className="inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-base font-medium rounded-md text-teal-600 bg-transparent hover:bg-teal-50 transition">
              Xem tất cả chuyên khoa
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-50 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-2/3 mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-extrabold text-teal-900 sm:text-4xl mb-4">
              Bạn cần tư vấn sức khỏe?
            </h2>
            <p className="text-xl text-teal-800">
              Hãy đặt lịch khám ngay hôm nay để trải nghiệm dịch vụ y tế chuẩn quốc tế.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/3 flex justify-center md:justify-end w-full"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-700 shadow-lg transition"
            >
              <Calendar className="mr-2" />
              Đăng ký khám
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <ShieldPlus size={32} className="text-teal-400" />
                <span className="font-bold text-xl leading-tight">BỆNH VIỆN<br/>ĐA KHOA QUỐC TẾ</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất với tiêu chuẩn y tế quốc tế cho cộng đồng.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Liên hệ</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>123 Đường Y Tế, Quận Trung Tâm, Thành phố Hà Nội</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 text-teal-400 flex-shrink-0" />
                  <span>Hotline: 1900 1234<br/>Cấp cứu: 115</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Thông tin</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Đội ngũ Bác sĩ</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Hướng dẫn khách hàng</a></li>
                <li><a href="#" className="hover:text-teal-400 transition">Tin tức y tế</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Giờ làm việc</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span>07:00 - 17:00</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Thứ 7 - CN:</span>
                  <span>07:00 - 12:00</span>
                </li>
                <li className="flex justify-between pb-2 text-teal-400 font-medium mt-2">
                  <span>Cấp cứu:</span>
                  <span>24/7</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 Bệnh Viện Đa Khoa Quốc Tế. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
