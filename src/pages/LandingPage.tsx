import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { title: 'Khám Tổng quát', desc: 'Kiểm tra sức khỏe định kỳ với quy trình nhanh chóng, chuẩn xác.', icon: '🏥', color: 'bg-primary/10 text-primary' },
    { title: 'Xét nghiệm Lab', desc: 'Hệ thống phòng Lab tự động đạt chuẩn quốc tế, trả kết quả nhanh.', icon: '🔬', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Chuyên khoa Nội', desc: 'Đội ngũ giáo sư, tiến sĩ đầu ngành trực tiếp thăm khám và tư vấn.', icon: '🫀', color: 'bg-rose-50 text-rose-600' },
    { title: 'Chẩn đoán Hình ảnh', desc: 'Công nghệ MRI, CT 128 lát cắt mới nhất cho hình ảnh sắc nét.', icon: '☢️', color: 'bg-amber-50 text-amber-600' },
    { title: 'Nhà thuốc GPP', desc: 'Cung cấp thuốc chính hãng với sự tư vấn tận tâm của dược sĩ.', icon: '💊', color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Cấp cứu 24/7', desc: 'Đội ngũ ứng trực sẵn sàng mọi lúc, mọi nơi khi bạn cần nhất.', icon: '🚑', color: 'bg-error-container text-error' },
  ];

  const steps = [
    { title: 'Tìm Bác sĩ', desc: 'Tìm kiếm bác sĩ theo chuyên khoa, kinh nghiệm hoặc vị trí của bạn.', icon: '🔍' },
    { title: 'Xem Hồ sơ', desc: 'Kiểm tra thông tin chi tiết, đánh giá và lịch trình của bác sĩ.', icon: '📋' },
    { title: 'Đặt Lịch khám', desc: 'Chọn thời gian phù hợp và xác nhận lịch hẹn chỉ trong vài thao tác.', icon: '📅' },
    { title: 'Nhận Tư vấn', desc: 'Đến phòng khám hoặc nhận tư vấn trực tuyến từ bác sĩ của bạn.', icon: '💡' }
  ];

  return (
    <div className="min-h-screen bg-background font-body text-on-surface selection:bg-primary/20">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-on-surface">MedCare<span className="text-primary">Plus</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Dịch vụ</a>
            <a href="#about" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Về chúng tôi</a>
            <a href="#specialities" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Chuyên khoa</a>
            <Link to="/login" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
              Đăng nhập hệ thống
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Công nghệ y tế tiên tiến
              </div>
              <h1 className="font-display text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                Tư vấn sức khỏe cùng <br />
                <span className="text-primary">Chuyên gia hàng đầu</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                Bắt đầu hành trình chăm sóc sức khỏe của bạn với MedCare Plus. Tìm kiếm bác sĩ uy tín, đặt lịch khám dễ dàng và quản lý hồ sơ y tế an toàn trong một nền tảng duy nhất.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link to="/appointments" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Đặt lịch khám ngay
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <a href="#services" className="w-full sm:w-auto bg-white text-on-surface px-8 py-4 rounded-2xl font-bold border border-surface-container-highest shadow-sm hover:bg-surface-container-low transition-all text-center">
                  Tìm hiểu dịch vụ
                </a>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" alt="Doctor" className="w-full h-full object-cover" />
              </div>
              
              {/* Floating "Calling" Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-2xl border border-surface-container-low flex items-center gap-4 animate-bounce hover:animate-none transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Patient" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-outline mb-1">Cuộc gọi khẩn cấp...</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></div>
                    <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg></div>
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="absolute -top-6 -right-6 bg-white px-6 py-4 rounded-2xl shadow-xl border border-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <p className="font-display font-bold text-on-surface text-xl">4.9/5</p>
                    <p className="text-xs text-on-surface-variant font-medium">Đánh giá bệnh nhân</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <div className="bg-primary py-4 overflow-hidden shadow-inner">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center text-white/90 font-bold text-sm md:text-lg uppercase tracking-wider">
            <span>Khám chữa bệnh tận tâm</span> <span className="hidden md:inline text-white/50">•</span>
            <span>Chuyên gia y tế</span> <span className="hidden md:inline text-white/50">•</span>
            <span>Công nghệ tiên tiến</span> <span className="hidden md:inline text-white/50">•</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Dịch Vụ Y Tế</h2>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-4">Hỗ trợ y tế cho mọi nhu cầu</h3>
            <p className="text-on-surface-variant">Chúng tôi cung cấp đa dạng các dịch vụ y tế chất lượng cao, đáp ứng mọi nhu cầu chăm sóc sức khỏe của bạn và gia đình.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="group bg-white border border-surface-container-highest p-8 rounded-3xl shadow-sm hover:shadow-ambient hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h4 className="font-display text-xl font-bold text-on-surface mb-3">{service.title}</h4>
                <p className="text-on-surface-variant leading-relaxed mb-6 text-sm">{service.desc}</p>
                <a href="#" className="inline-flex items-center text-primary font-semibold hover:text-primary-container">
                  Tìm hiểu thêm <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-surface-container-low overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 relative w-full">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" alt="About MedCare" className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/50 transition-colors">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-lg pl-1">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary text-white p-8 rounded-[2rem] shadow-xl max-w-xs hidden md:block">
                <p className="font-display text-4xl font-extrabold mb-1">10+</p>
                <p className="text-white/80 font-medium">Năm kinh nghiệm trong lĩnh vực y tế</p>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Về Chúng Tôi</h2>
              <h3 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-6 leading-tight">Mỗi bệnh nhân đều là một câu chuyện riêng. <br/>Chúng tôi thấu hiểu.</h3>
              <p className="text-on-surface-variant leading-relaxed mb-8 text-lg">
                MedCare Plus hướng tới việc cung cấp dịch vụ chẩn đoán nhanh hơn, thông tin rõ ràng hơn và quyết định điều trị chính xác hơn, đảm bảo mỗi bệnh nhân đều nhận được sự chăm sóc an toàn và cá nhân hóa.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-highest">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl mb-4">🎯</div>
                  <h4 className="font-bold text-on-surface mb-2">Sứ Mệnh</h4>
                  <p className="text-sm text-on-surface-variant">Mang đến dịch vụ chăm sóc sức khỏe tận tâm, lấy bệnh nhân làm trung tâm kết hợp công nghệ.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-container-highest">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">👁️</div>
                  <h4 className="font-bold text-on-surface mb-2">Tầm Nhìn</h4>
                  <p className="text-sm text-on-surface-variant">Trao quyền cho bác sĩ phát hiện bệnh sớm, cải thiện kết quả và định hình tương lai y tế.</p>
                </div>
              </div>
              
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-primary-container transition-colors">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Quy trình</h2>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-4">4 Bước Dễ Dàng Đặt Khám</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-surface-container-highest z-0"></div>
            
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-surface-container-low rounded-full flex items-center justify-center text-4xl mb-6 shadow-ambient group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="font-display text-xl font-bold text-on-surface mb-3">{step.title}</h4>
                <p className="text-on-surface-variant text-sm px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-20 bg-on-surface relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-6">Tải Ứng Dụng MedCare Plus Ngay!</h2>
          <p className="text-outline-variant text-lg mb-10 max-w-2xl mx-auto">Quản lý lịch khám, theo dõi hồ sơ sức khỏe và nhận tư vấn trực tuyến mọi lúc mọi nơi trên điện thoại của bạn.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-white hover:text-on-surface transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.49.09 2.58.62 3.32 1.4-2.82 1.63-2.31 5.34.62 6.55-.7 1.95-1.57 3.93-2.52 5.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              <div className="text-left">
                <div className="text-[10px] font-normal">Download on the</div>
                <div className="text-sm leading-none">App Store</div>
              </div>
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-white hover:text-on-surface transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12l-10.183 10.186c-.198-.242-.317-.549-.317-.887V2.701c0-.338.119-.645.317-.887zM14.619 12.827L18.435 16.64l-11.236 6.319 7.42-10.132zm.833-1.654l4.57-2.612a1.002 1.002 0 0 0 0-1.74l-4.57-2.612-4.116 4.116 4.116 4.115zm-1.66-1.66L6.372 1.042 17.608 7.36l-3.816 2.153z"/></svg>
              <div className="text-left">
                <div className="text-[10px] font-normal">GET IT ON</div>
                <div className="text-sm leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low text-on-surface-variant pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-on-surface">MedCare<span className="text-primary">Plus</span></span>
              </div>
              <p className="text-sm leading-relaxed">
                Chúng tôi là trung tâm chăm sóc sức khỏe toàn diện, tận tâm cung cấp các phương pháp điều trị và chẩn đoán tiên tiến nhất cho cộng đồng.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-surface-container-highest flex items-center justify-center hover:bg-primary hover:text-white transition-colors">FB</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-surface-container-highest flex items-center justify-center hover:bg-primary hover:text-white transition-colors">TW</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-surface-container-highest flex items-center justify-center hover:bg-primary hover:text-white transition-colors">IG</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-on-surface font-bold mb-6 text-lg">Công ty</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Phòng khám</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Bệnh viện</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Chuyên khoa</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-on-surface font-bold mb-6 text-lg">Cần hỗ trợ?</h4>
              <ul className="space-y-6 text-sm">
                <li>
                  <span className="block text-outline mb-1">Đến phòng khám</span>
                  <p className="text-on-surface font-medium">123 Đường Y Học, TP. Hồ Chí Minh</p>
                </li>
                <li>
                  <span className="block text-outline mb-1">Email hỗ trợ</span>
                  <a href="mailto:info@medcare.plus" className="text-on-surface font-medium hover:text-primary">info@medcare.plus</a>
                </li>
                <li>
                  <span className="block text-outline mb-1">Hotline</span>
                  <a href="tel:02812345678" className="text-primary font-bold text-lg hover:text-primary-container">028 1234 5678</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-on-surface font-bold mb-6 text-lg">Đăng ký nhận tin</h4>
              <p className="text-sm mb-4">Nhận thông tin cập nhật mới nhất về sức khỏe từ MedCare Plus!</p>
              <form className="flex">
                <input type="email" placeholder="Nhập email của bạn" className="bg-white border border-surface-container-highest rounded-l-xl px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                <button type="button" className="bg-primary px-4 rounded-r-xl hover:bg-primary-container transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2026 MedCare Plus. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
