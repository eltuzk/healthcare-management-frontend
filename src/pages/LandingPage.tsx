import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpecialties } from '../services/specialtyService';
import { getConsultationFees } from '../services/consultationFeeService';

const LandingPage: React.FC = () => {
	const [specialties, setSpecialties] = useState<any[]>([]);
	const [consultationFees, setConsultationFees] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('darkMode');
		const initialMode = savedTheme === 'enabled';
		setIsDarkMode(initialMode);
		document.documentElement.className = initialMode ? 'dark-mode' : 'light-mode';
	}, []);

	const toggleTheme = (mode: boolean) => {
		setIsDarkMode(mode);
		document.documentElement.className = mode ? 'dark-mode' : 'light-mode';
		localStorage.setItem('darkMode', mode ? 'enabled' : 'disabled');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [specRes, feeRes] = await Promise.all([
					getSpecialties(),
					getConsultationFees()
				]);

				const fetchedSpecialties = specRes.data || [];
				if (fetchedSpecialties.length === 0) {
					setSpecialties([
						{ specialtyCode: 'INT', specialtyName: 'Nội tổng quát' },
						{ specialtyCode: 'SUR', specialtyName: 'Ngoại tổng quát' },
						{ specialtyCode: 'PED', specialtyName: 'Nhi khoa' },
						{ specialtyCode: 'OBG', specialtyName: 'Sản phụ khoa' },
						{ specialtyCode: 'CAR', specialtyName: 'Tim mạch' },
						{ specialtyCode: 'DER', specialtyName: 'Da liễu' },
						{ specialtyCode: 'ENT', specialtyName: 'Tai Mũi Họng' },
						{ specialtyCode: 'DEN', specialtyName: 'Răng Hàm Mặt' },
						{ specialtyCode: 'OPH', specialtyName: 'Mắt' },
						{ specialtyCode: 'IMA', specialtyName: 'Chẩn đoán hình ảnh' },
					]);
				} else {
					setSpecialties(fetchedSpecialties);
				}

				const fetchedFees = feeRes.data || [];
				if (fetchedFees.length === 0) {
					setConsultationFees([
						{ feeName: 'Nội khoa tổng quát', price: 150000, feeCode: 'INT', specialty: { specialtyName: 'Nội khoa' } },
						{ feeName: 'Ngoại khoa', price: 200000, feeCode: 'SUR', specialty: { specialtyName: 'Ngoại khoa' } },
						{ feeName: 'Nhi khoa (Tư vấn dinh dưỡng)', price: 250000, feeCode: 'PED', specialty: { specialtyName: 'Nhi khoa' } },
						{ feeName: 'Sản phụ khoa định kỳ', price: 300000, feeCode: 'OBG', specialty: { specialtyName: 'Sản phụ khoa' } },
						{ feeName: 'Da liễu (Soi da)', price: 180000, feeCode: 'DER', specialty: { specialtyName: 'Da liễu' } },
						{ feeName: 'Tim mạch chuyên sâu', price: 500000, feeCode: 'CAR', specialty: { specialtyName: 'Tim mạch' } },
						{ feeName: 'Mắt (Đo thị lực)', price: 120000, feeCode: 'OPH', specialty: { specialtyName: 'Mắt' } },
						{ feeName: 'Tư vấn Tâm lý/Tâm thần', price: 450000, feeCode: 'PSY', specialty: { specialtyName: 'Tâm thần' } },
						{ feeName: 'Phí khám ban đầu tai mũi họng', price: 50000, feeCode: 'ENT', specialty: { specialtyName: 'Tai Mũi Họng' } },
					]);
				} else {
					setConsultationFees(fetchedFees);
				}
			} catch (error) {
				console.error("Error fetching landing page data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	useEffect(() => {
		// List of CSS files
		const cssFiles = [
			'/assets/css/bootstrap.min.css',
			'/assets/plugins/fontawesome/css/fontawesome.min.css',
			'/assets/plugins/fontawesome/css/all.min.css',
			'/assets/plugins/fancybox/jquery.fancybox.min.css',
			'/assets/plugins/wow/css/animate.css',
			'/assets/css/iconsax.css',
			'/assets/css/feather.css',
			'/assets/css/style.min.css'
		];

		// List of JS files
		const jsFiles = [
			'/assets/js/theme-script.js',
			'/assets/js/jquery-3.7.1.min.js',
			'/assets/js/bootstrap.bundle.min.js',
			'/assets/js/slick.js',
			'/assets/js/backToTop.js',
			'/assets/plugins/fancybox/jquery.fancybox.min.js',
			'/assets/plugins/wow/js/wow.min.js',
			'/assets/plugins/gsap/gsap.min.js',
			'/assets/js/script.min.js'
		];

		const injectedLinks: HTMLLinkElement[] = [];
		const injectedScripts: HTMLScriptElement[] = [];

		// Inject CSS
		cssFiles.forEach(href => {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = href;
			document.head.appendChild(link);
			injectedLinks.push(link);
		});

		// Inject JS sequentially
		const loadScriptsSequentially = async () => {
			for (const src of jsFiles) {
				await new Promise((resolve) => {
					const script = document.createElement('script');
					script.src = src;
					script.async = false; // ensure order
					script.onload = resolve;
					document.body.appendChild(script);
					injectedScripts.push(script);
				});
			}
		};
		loadScriptsSequentially();

		// Cleanup on unmount
		return () => {
			injectedLinks.forEach(link => {
				if (link.parentNode) link.parentNode.removeChild(link);
			});
			injectedScripts.forEach(script => {
				if (script.parentNode) script.parentNode.removeChild(script);
			});
		};
	}, []);

	return (
		<>
			<div className="main-wrapper">

				<div className="header-theme header-theme-two">
					<button 
						type="button" 
						id="dark-mode-toggle" 
						className={`theme-toggle moon ${isDarkMode ? '' : 'activate'}`} 
						aria-label="dark mode"
						onClick={() => toggleTheme(true)}
					>
						<i className="isax isax-moon5"></i>
					</button>
					<button 
						type="button" 
						id="light-mode-toggle" 
						className={`theme-toggle sun ${isDarkMode ? 'activate' : ''}`} 
						aria-label="light mode"
						onClick={() => toggleTheme(false)}
					>
						<i className="isax isax-sun-15"></i>
					</button>
				</div>

				{/* Header */}
				<header className="header header-two home-menu">
					<div className="container">
						<nav className="navbar navbar-expand-lg header-nav">
							<div className="navbar-header">
								<a id="mobile_btn" href="#" aria-label="Open menu" >
									<i className="fa-solid fa-bars"></i>
								</a>
								<Link to="/" className="navbar-brand logo">
									<img src="assets/img/logo-white-02.svg" className="img-fluid white-logo" alt="Logo" />
									<img src="assets/img/logo-02.svg" className="img-fluid normal-logo" alt="Logo" />
								</Link>
							</div>
							<div className="main-menu-wrapper">
								<div className="menu-header">
									<Link to="/" className="menu-logo">
										<img src="assets/img/logo-02.svg" className="img-fluid" alt="Logo" />
									</Link>
									<a id="menu_close" className="menu-close" href="#" aria-label="Close menu" >
										<i className="fas fa-times"></i>
									</a>
								</div>
								<div className="header-items">
									{/* Item 1 */}
									<div className="about-popup-item border-0 pb-0">
										<h3 className="title">Thông tin liên hệ</h3>
										<div className="support-item mb-3">
											<div className="avatar avatar-lg bg-primary rounded-circle">
												<i className="isax isax-messages-3"></i>
											</div>
											<div>
												<p className="title">Yêu cầu chung</p>
												<h5 className="link">info@example.com</h5>
											</div>
										</div>
										<div className="support-item">
											<div className="avatar avatar-lg bg-primary rounded-circle">
												<i className="isax isax-call-calling"></i>
											</div>
											<div>
												<p className="title">Trường hợp khẩn cấp</p>
												<h5 className="link">+1 24565 89856</h5>
											</div>
										</div>
									</div>
									{/* Item 2 */}
									<div className="about-popup-item border-0 pb-0">
										<h3 className="title">Theo dõi chúng tôi</h3>
										<ul className="d-flex align-items-center gap-2 social-iyem">
											<li>
												<a href="#" className="social-icon" aria-label="facebook"><i className="fa-brands fa-facebook"></i></a>
											</li>
											<li>
												<a href="#" className="social-icon" aria-label="twitter"><i className="fa-brands fa-x-twitter"></i></a>
											</li>
											<li>
												<a href="#" className="social-icon" aria-label="instagram"><i className="fa-brands fa-instagram"></i></a>
											</li>
											<li>
												<a href="#" className="social-icon" aria-label="linkedin"><i className="fa-brands fa-linkedin"></i></a>
											</li>
										</ul>
									</div>

									<div className="header-items-button">
										<Link to="/login" className="btn btn-primary"><i className="isax isax-lock-1 me-2"></i>Đăng nhập</Link>
										<Link to="/register" className="btn btn-secondary"><i className="isax isax-user-tick4 me-2"></i>Đăng ký</Link>
									</div>
								</div>
							</div>
							<ul className="nav header-navbar-rht">
								<li>
									<Link to="/login" className="btn btn-md btn-primary">
										<i className="isax isax-lock-1"></i> <span>Đăng nhập</span>
									</Link>
								</li>
								<li>
									<Link to="/register" className="btn btn-md btn-secondary">
										<i className="isax isax-user-tick"></i> <span>Đăng ký</span>
									</Link>
								</li>
							</ul>
						</nav>
					</div>
				</header>
				{/* Header End */}

				{/* Banner */}
				<section className="banner-section-two">
					<div className="container">
						<div className="row align-items-end">
							<div className="col-xl-6">
								<div className="banner-content wow fadeInUp" data-wow-duration="1s">
									<h1>Tư vấn <span>Bác sĩ chuyên khoa</span> hàng đầu tại cơ sở gần bạn.</h1>
									<p>Bắt đầu hành trình chăm sóc sức khỏe của bạn với The Clinical Curator, nơi bạn có thể dễ dàng quản lý lịch hẹn và hồ sơ y tế.</p>

									<Link to="/booking" className="btn btn-md btn-white"><i className="isax isax-lock me-2"></i>Đặt lịch hẹn ngay</Link>
								</div>
							</div>
							<div className="col-xl-6">
								<div className="banner-img wow fadeInUp" data-wow-duration="2s">
									<img src="assets/img/banner/banner-02.png" alt="banner" fetchpriority="high" className="img-fluid" />
									<div className="banner-user-call">
										<span className="avatar">
											<img src="assets/img/patients/patient22.jpg" alt="patient" className="img-fluid rounded-circle" />
										</span>
										<p>Đang gọi.......</p>
									</div>
									<div className="call-items">
										<a href="#" className="item-1 item" aria-label="Video call"><i className="isax isax-video"></i></a>
										<a href="#" className="item-2 item" aria-label="End call"><i className="isax isax-call-slash"></i></a>
										<a href="#" className="item-3 item" aria-label="Mute microphone"><i className="isax isax-microphone-2"></i></a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<img src="assets/img/bg/banner-01.png" alt="bg" className="img-fluid banner-bg-01" />
					<img src="assets/img/bg/banner-02.png" alt="bg" className="img-fluid banner-bg-02" />
					<img src="assets/img/bg/banner-03.png" alt="bg" className="img-fluid banner-bg-03" />
					<img src="assets/img/bg/banner-04.png" alt="bg" className="img-fluid banner-bg-04" />
					<img src="assets/img/bg/banner-05.png" alt="bg" className="img-fluid banner-bg-05" />
					<img src="assets/img/bg/banner-06.png" alt="bg" className="img-fluid banner-bg-06" />
					<img src="assets/img/bg/banner-07.png" alt="bg" className="img-fluid banner-bg-07" />
				</section>
				{/* Banner End */}

				{/* Slider Section */}
				<section className="slider-section wow fadeInUp" data-wow-duration="1s">
					<div className="horizontal-slide slide-one bg-primary d-flex" data-direction="left" data-speed="slow">
						<div className="slide-list d-flex gap-4">
							<div className="services-slide">
								<h3>Chuyên gia Y tế Chứng nhận</h3>
							</div>
							<div className="services-slide">
								<h3>Công cụ Chẩn đoán Tiên tiến</h3>
							</div>
							<div className="services-slide">
								<h3>Đặt lịch hẹn Trực tuyến</h3>
							</div>
							<div className="services-slide">
								<h3>Hồ sơ Sức khỏe Điện tử</h3>
							</div>
						</div>
					</div>
					<div className="horizontal-slide slide-two bg-dark d-flex" data-direction="right" data-speed="slow">
						<div className="slide-list d-flex gap-4">
							<div className="services-slide">
								<h3>Báo cáo & Kết quả Xét nghiệm Nhanh</h3>
							</div>
							<div className="services-slide">
								<h3>Tư vấn Khám bệnh Từ xa</h3>
							</div>
							<div className="services-slide">
								<h3>Theo dõi Sức khỏe & Tái khám</h3>
							</div>
							<div className="services-slide">
								<h3>Chăm sóc Khẩn cấp & Cấp cứu</h3>
							</div>
						</div>
					</div>
				</section>
				{/* Slider Section End */}


				{/* About Section */}
				<section className="section about-section-two">
					<div className="container">
						<div className="row align-items-center">

							{/* About Img */}
							<div className="col-lg-6">
								<div className="about-img-two wow fadeInUp" data-wow-duration="2s">
									<img src="assets/img/about/about.png" alt="about" className="img-fluid" />
									<a href="https://youtu.be/MyQxnFgPgQU?si=Z9y2WdynImbFnqL2" data-fancybox>
										<button className="animate-button" data-text="Play Video · Play Video ·" aria-label="Play video">
											<p className="button-text"></p>
											<span className="button-circle">
												<i className="isax isax-play"></i>
											</span>
										</button>
									</a>
								</div>
							</div>
							{/* About Img End */}

							{/* About Content */}
							<div className="col-lg-6">
								<div className="about-content-two">
									<div className="section-header section-header-two">
										<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Về chúng tôi</div>
										<h2 className="section-title">Thấu hiểu từng cá nhân & hành trình <span>Chăm sóc sức khỏe.</span></h2>
										<p>Chúng tôi hướng tới việc cung cấp chẩn đoán nhanh hơn, thông tin chi tiết rõ ràng hơn và quyết định điều trị chính xác hơn, đảm bảo mỗi bệnh nhân đều nhận được sự chăm sóc an toàn và cá nhân hóa.</p>
									</div>
									<div className="row g-4">
										<div className="col-md-6">
											<div className="mission-item wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
												<div className="mission-inner">
													<div className="mission-info">
														<div className="mission-icon bg-primary">
															<img src="assets/img/icons/mission.svg" alt="mission" className="img-fluid" />
														</div>
														<h3 className="custom-title">Sứ mệnh của chúng tôi</h3>
													</div>
													<p>Mang đến dịch vụ chăm sóc sức khỏe tận tâm, lấy bệnh nhân làm trung tâm bằng cách kết hợp chuyên môn lâm sàng với công nghệ hiện đại.</p>
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="mission-item wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="4s">
												<div className="mission-inner">
													<div className="mission-info">
														<div className="mission-icon bg-secondary">
															<img src="assets/img/icons/vision.svg" alt="vision" className="img-fluid" />
														</div>
														<h3 className="custom-title">Tầm nhìn của chúng tôi</h3>
													</div>
													<p>Hỗ trợ bác sĩ phát hiện bệnh sớm hơn, cải thiện kết quả điều trị và định nghĩa lại tương lai của ngành y tế hiện đại.</p>
												</div>
											</div>
										</div>
									</div>
									<a href="https://www.youtube.com/watch?v=MyQxnFgPgQU" className="btn btn-md btn-primary" target="_blank" rel="noopener noreferrer">Tìm hiểu thêm<i className="isax isax-arrow-right-34 ms-2"></i></a>
								</div>
							</div>
							{/* About Content End */}

						</div>
					</div>
					<img src="assets/img/bg/about-bg.png" alt="icon" className="img-fluid about-bg-01" />
				</section>
				{/* About Section End */}

				{/* Speciality Section */}
				<section className="section speciality-section-two">
					<div className="container">
						<div className="section-header section-header-two">
							<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Chuyên khoa</div>
							<h2 className="section-title mb-0">Hỗ trợ y tế cho <span>Mọi nhu cầu.</span></h2>
						</div>

						<div className="row justify-content-center g-4">
							{specialties.map((spec, index) => {
								const specialtyIcons: { [key: string]: string } = {
									INT: 'assets/img/icons/specilaity-01.svg', // Nội khoa
									SUR: 'assets/img/icons/specilaity-02.svg', // Ngoại khoa
									PED: 'assets/img/icons/specilaity-06.svg', // Nhi khoa
									OBG: 'assets/img/icons/specilaity-08.svg', // Sản phụ khoa
									CAR: 'assets/img/icons/specilaity-03.svg', // Tim mạch
									DER: 'assets/img/icons/specilaity-05.svg', // Da liễu (Dùng chung bộ solid)
									ENT: 'assets/img/icons/specilaity-01.svg', // Tai Mũi Họng (Dùng chung bộ solid)
									DEN: 'assets/img/icons/specilaity-04.svg', // Răng Hàm Mặt
									OPH: 'assets/img/icons/specilaity-07.svg', // Mắt
									IMA: 'assets/img/icons/specilaity-02.svg', // Chẩn đoán hình ảnh (Dùng chung bộ solid)
								};
								const icon = specialtyIcons[spec.specialtyCode] || 'assets/img/icons/specilaity-01.svg';

								return (
									<div key={spec.specialtyId || index} className="col-xl-3 col-lg-4 col-md-6 d-flex">
										<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay={`${0.1 * (index + 1)}s`} data-wow-duration="1s" style={{ cursor: 'default' }}>
											<div className="speciality-info">
												<div className="speciality-icon">
													<img src={icon} alt={spec.specialtyName} />
												</div>
												<div style={{ flex: 1 }}>
													<h3 className="custom-title mb-0" style={{ whiteSpace: 'normal', overflow: 'visible' }}>{spec.specialtyName}</h3>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>
				{/* Speciality Section End */}

				{/* Doctor Section */}
				<section className="section doctor-section-two">
					<div className="container">

						{/* Section Header */}
						<style>{`
							.doctor-item-two {
								display: flex;
								flex-direction: column;
								height: 100%;
								background: #fff;
								border-radius: 20px;
								overflow: hidden;
								box-shadow: 0 10px 30px rgba(0,0,0,0.05);
								transition: all 0.3s ease;
								border: 1px solid #f1f5f9;
							}
							.doctor-item-two:hover {
								transform: translateY(-5px);
								box-shadow: 0 15px 40px rgba(14, 130, 253, 0.1);
								border-color: #0E82FD;
							}
							.doctor-image img {
								width: 100%;
								height: 250px;
								object-fit: cover;
							}
							.doctor-content {
								padding: 20px;
								flex-grow: 1;
								display: flex;
								flex-direction: column;
							}
							.doctor-content .custom-title {
								font-size: 1.25rem;
								font-weight: 700;
								margin-bottom: 5px;
							}
							.doctor-content .speciality {
								color: #64748b;
								font-size: 0.95rem;
								margin-bottom: 20px;
							}
							.available-info {
								margin-top: auto;
								display: flex;
								align-items: center;
								justify-content: space-between;
								padding-top: 15px;
								border-top: 1px solid #f1f5f9;
								gap: 10px;
							}
							.available-info p {
								margin-bottom: 0;
								font-size: 0.85rem;
								color: #475569;
								display: flex;
								align-items: center;
								line-height: 1.2;
							}
							.available-info .badge {
								padding: 6px 12px;
								font-weight: 600;
								border-radius: 8px;
								white-space: nowrap;
								display: flex;
								align-items: center;
								gap: 5px;
								background-color: #28C76F !important;
							}
							.available-info .badge i {
								font-size: 8px;
							}
						`}</style>
						<div className="row g-4">
							<div className="col-xl-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">

								{/* Doctor Widget */}
								<div className="doctor-item-two">
									<div className="doctor-image">
										<Link to="/doctor-profile">
											<img className="img-fluid" alt="doctor" src="assets/img/doctors/general-01.jpg" />
										</Link>
									</div>
									<div className="doctor-content">
										<h3 className="custom-title">
											<Link to="/doctor-profile">Bác sĩ Hattie Driskell</Link>
										</h3>
										<p className="speciality">Chỉnh hình</p>
										<div className="available-info">
											<p><i className="isax isax-location me-1"></i>TP. Hồ Chí Minh</p>
											<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
										</div>
									</div>
								</div>
								{/* Doctor Widget End */}

							</div>

							<div className="col-xl-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">

								{/* Doctor Widget */}
								<div className="doctor-item-two">
									<div className="doctor-image">
										<Link to="/doctor-profile">
											<img className="img-fluid" alt="doctor" src="assets/img/doctors/general-02.jpg" />
										</Link>
									</div>
									<div className="doctor-content">
										<h3 className="custom-title">
											<Link to="/doctor-profile">Bác sĩ Calvin Haley</Link>
										</h3>
										<p className="speciality">Nha sĩ</p>
										<div className="available-info">
											<p><i className="isax isax-location me-1"></i>Hà Nội</p>
											<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
										</div>
									</div>
								</div>
								{/* Doctor Widget End */}

							</div>

							<div className="col-xl-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">

								{/* Doctor Widget */}
								<div className="doctor-item-two">
									<div className="doctor-image">
										<Link to="/doctor-profile">
											<img className="img-fluid" alt="doctor" src="assets/img/doctors/general-03.jpg" />
										</Link>
									</div>
									<div className="doctor-content">
										<h3 className="custom-title">
											<Link to="/doctor-profile">Bác sĩ Lisa Labonte</Link>
										</h3>
										<p className="speciality">Thần kinh</p>
										<div className="available-info">
											<p><i className="isax isax-location me-1"></i>Đà Nẵng</p>
											<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
										</div>
									</div>
								</div>
								{/* Doctor Widget End */}

							</div>

							<div className="col-xl-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">

								{/* Doctor Widget */}
								<div className="doctor-item-two">
									<div className="doctor-image">
										<Link to="/doctor-profile">
											<img className="img-fluid" alt="doctor" src="assets/img/doctors/general-04.jpg" />
										</Link>
									</div>
									<div className="doctor-content">
										<h3 className="custom-title">
											<Link to="/doctor-profile">Bác sĩ James Davidson</Link>
										</h3>
										<p className="speciality">Miễn dịch học</p>
										<div className="available-info">
											<p><i className="isax isax-location me-1"></i>Cần Thơ</p>
											<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
										</div>
									</div>
								</div>
								{/* Doctor Widget End */}

							</div>

						</div>
					</div>
					<img src="assets/img/bg/doctor-bg-01.png" alt="bg" className="img-fluid doctor-bg-01" />
					<img src="assets/img/bg/about-bg.png" alt="bg" className="img-fluid doctor-bg-02" />
				</section>
				{/* Doctor Section End */}

				{/* Speciality Section */}
				<section className="section speciality-section-two">
					<div className="container">
						<div className="section-header section-header-two">
							<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Bảng giá dịch vụ</div>
							<h2 className="section-title mb-0">Danh mục <span>Phí khám bệnh</span></h2>
						</div>

						<div className="row">
							<div className="col-lg-12 mx-auto">
								<div className="card shadow-lg border-0 wow fadeInUp" data-wow-duration="1.2s" style={{ borderRadius: '20px', overflow: 'hidden' }}>
									<div className="card-body p-0">
										<div className="table-responsive">
											<style>{`
										.premium-table thead {
											background: linear-gradient(90deg, #0E82FD 0%, #28C76F 100%);
											color: white;
										}
										.premium-table th {
											font-weight: 600;
											text-transform: uppercase;
											font-size: 0.85rem;
											letter-spacing: 1px;
											border: none;
										}
										.premium-table tbody tr {
											transition: all 0.3s ease;
											cursor: pointer;
										}
										.premium-table tbody tr:hover {
											background-color: rgba(14, 130, 253, 0.05) !important;
											transform: scale(1.01);
											box-shadow: 0 4px 15px rgba(0,0,0,0.05);
										}
										.price-tag {
											background: rgba(14, 130, 253, 0.1);
											padding: 5px 15px;
											border-radius: 50px;
											display: inline-block;
											transition: all 0.3s ease;
										}
										.premium-table tr:hover .price-tag {
											background: #0E82FD;
											color: white;
											transform: translateX(-5px);
										}
										.spec-badge {
											padding: 4px 12px;
											border-radius: 6px;
											font-size: 0.8rem;
											background: #f8f9fa;
											border: 1px solid #eee;
										}
									`}</style>
											<table className="table premium-table mb-0">
												<thead>
													<tr>
														<th className="py-4 ps-5">Tên dịch vụ</th>
														<th className="py-4">Chuyên khoa</th>
														<th className="py-4 pe-5 text-end">Đơn giá</th>
													</tr>
												</thead>
												<tbody>
													{consultationFees.map((fee, index) => (
														<tr key={fee.feeId || index}>
															<td className="py-4 ps-5">
																<div className="d-flex align-items-center">
																	<div className="avatar avatar-sm bg-primary-transparent me-3">
																		<i className="isax isax-activity me-0"></i>
																	</div>
																	<span className="fw-bold text-dark">{fee.feeName}</span>
																</div>
															</td>
															<td className="py-4">
																<span className="spec-badge text-secondary">
																	<i className="isax isax-medal-star me-1"></i>
																	{fee.specialty?.specialtyName || 'Đa khoa'}
																</span>
															</td>
															<td className="py-4 pe-5 text-end">
																<div className="price-tag fw-bold">
																	{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.price)}
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Speciality Section End */}

				{/* Work Section */}
				<section className="section work-section-two">
					<div className="container">

						<div className="row">
							<div className="col-xl-5">
								<div className="work-img-two">
									<img src="assets/img/about/about-01.png" alt="work" className="img-fluid" />
								</div>
							</div>

							<div className="col-xl-7 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
								<div className="section-header section-header-two text-start">
									<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Quy trình hoạt động</div>
									<h2 className="section-title mb-0">4 Bước đơn giản để <span>Nhận kết quả</span></h2>
								</div>
								<div className="row g-4">

									{/* Work Item */}
									<div className="col-md-6 d-flex">
										<div className="work-item w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
											<div className="work-icon">
												<img src="assets/img/icons/search.svg" alt="search doctor" />
											</div>
											<div>
												<h3 className="custom-title">Tìm kiếm Bác sĩ</h3>
												<p>Tìm kiếm bác sĩ dựa trên chuyên khoa, địa điểm hoặc thời gian rảnh. </p>
											</div>
										</div>
									</div>
									{/* Work Item End */}

									{/* Work Item */}
									<div className="col-md-6 d-flex">
										<div className="work-item w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
											<div className="work-icon">
												<img src="assets/img/icons/profile.svg" alt="profile" />
											</div>
											<div>
												<h3 className="custom-title">Xem Hồ sơ</h3>
												<p>Khám phá hồ sơ bác sĩ chi tiết để đưa ra lựa chọn chăm sóc sức khỏe tốt nhất. </p>
											</div>
										</div>
									</div>
									{/* Work Item End */}

									{/* Work Item */}
									<div className="col-md-6 d-flex">
										<div className="work-item w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
											<div className="work-icon">
												<img src="assets/img/icons/schedule.svg" alt="booking" />
											</div>
											<div>
												<h3 className="custom-title">Đặt Lịch hẹn</h3>
												<p>Sau khi chọn bác sĩ yêu thích, hãy chọn khung giờ thuận tiện và xác nhận. </p>
											</div>
										</div>
									</div>
									{/* Work Item End */}

									{/* Work Item */}
									<div className="col-md-6 d-flex">
										<div className="work-item w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
											<div className="work-icon">
												<img src="assets/img/icons/solution.svg" alt="your solution" />
											</div>
											<div>
												<h3 className="custom-title">Nhận Kết quả</h3>
												<p>Tìm kiếm bác sĩ dựa trên chuyên khoa, địa điểm hoặc thời gian rảnh. </p>
											</div>
										</div>
									</div>
									{/* Work Item End */}

								</div>
							</div>
						</div>
					</div>
					<img src="assets/img/bg/about-bg.png" alt="bg" className="img-fluid work-bg-01" />
					<img src="assets/img/bg/work-bg.png" alt="bg" className="work-bg-02" />
					<img src="assets/img/bg/work-bg-01.png" alt="bg" className="work-bg-03" />
					<img src="assets/img/bg/work-bg-02.png" alt="bg" className="work-bg-04" />
				</section>
				{/* Work Section End */}

				{/* Testimonial Section */}
				<section className="section testimonial-section-two">
					<div className="container">

						{/* Section Header */}
						<div className="section-header section-header-two text-center">
							<div className="section-sub-title justify-content-center"><img src="assets/img/icons/section-icon.svg" alt="icon" />Đánh giá từ khách hàng</div>
							<h2 className="section-title mb-0">Bệnh nhân <span>Nói về chúng tôi</span></h2>
						</div>
						{/* Section Header End */}

						<div className="row">
							<div className="col-lg-12">
								<style>{`
							.testimonial-item-two {
								margin: 15px;
								padding: 30px;
								border-radius: 20px;
								background: #fff;
								box-shadow: 0 10px 30px rgba(0,0,0,0.05);
								height: 100%;
								display: flex !important;
								flex-direction: column;
								justify-content: space-between;
							}
							.testimonial-slider-two {
								padding-bottom: 30px;
							}
						`}</style>
								<div className="testimonial-slider-two owl-carousel owl-theme">

									{/* Testimonial Item */}
									<div className="testimonial-item-two">
										<div>
											<div className="testimonial-author-img">
												<img src="assets/img/patients/patient22.jpg" className="rounded-circle" alt="patient" />
											</div>
											<div className="quote-icon">
												<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
											</div>
											<div className="testimonial-content">
												<p className="description">Khoa cấp cứu đã phản ứng nhanh chóng và hiệu quả khi tôi nhập viện với cơn đau dữ dội. Các bác sĩ không hề vội vàng và đảm bảo rằng tôi đã hiểu rõ tình trạng của mình. Trải nghiệm chăm sóc sức khỏe tốt nhất.</p>
											</div>
										</div>
										<div className="testimonial-author-info">
											<div>
												<h3 className="custom-title">Daniel Carter</h3>
												<p className="author-location">Dallas, Hoa Kỳ</p>
											</div>
											<div className="rating">
												{[...Array(5)].map((_, i) => (
													<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="me-1">
														<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
													</svg>
												))}
											</div>
										</div>
									</div>
									{/* Testimonial Item End */}

									{/* Testimonial Item */}
									<div className="testimonial-item-two">
										<div>
											<div className="testimonial-author-img">
												<img src="assets/img/patients/patient25.jpg" className="rounded-circle" alt="patient" />
											</div>
											<div className="quote-icon">
												<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
											</div>
											<div className="testimonial-content">
												<p className="description">Sự chăm sóc tôi nhận được tại bệnh viện này thật tuyệt vời. Các bác sĩ giải thích mọi thứ rõ ràng, các y tá cực kỳ tốt bụng và cơ sở vật chất không chê vào đâu được. Thật sự là một trong những trải nghiệm chăm sóc sức khỏe tốt nhất.</p>
											</div>
										</div>
										<div className="testimonial-author-info">
											<div>
												<h3 className="custom-title">Jeni Adams</h3>
												<p className="author-location">Boston, Hoa Kỳ</p>
											</div>
											<div className="rating">
												{[...Array(5)].map((_, i) => (
													<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="me-1">
														<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
													</svg>
												))}
											</div>
										</div>
									</div>
									{/* Testimonial Item End */}

									{/* Testimonial Item */}
									<div className="testimonial-item-two">
										<div>
											<div className="testimonial-author-img">
												<img src="assets/img/patients/patient24.jpg" className="rounded-circle" alt="patient" />
											</div>
											<div className="quote-icon">
												<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
											</div>
											<div className="testimonial-content">
												<p className="description">Dịch vụ xuất sắc và bầu không khí thân thiện. Đội ngũ nhân viên am hiểu và thực sự quan tâm đến sức khỏe của bệnh nhân, đảm bảo mỗi lần thăm khám đều thoải mái.</p>
											</div>
										</div>
										<div className="testimonial-author-info">
											<div>
												<h3 className="custom-title">Mike Smith</h3>
												<p className="author-location">San Francisco, Hoa Kỳ</p>
											</div>
											<div className="rating">
												{[...Array(5)].map((_, i) => (
													<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="me-1">
														<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
													</svg>
												))}
											</div>
										</div>
									</div>
									{/* Testimonial Item End */}

								</div>
							</div>
						</div>

					</div>
				</section>
				{/* Testimonial Section End */}

				{/* App Section */}
				<section className="app-section-two">
					<div className="container">
						<div className="app-sec">
							<div className="row align-items-end">
								<div className="col-lg-6">
									<div className="app-content d-flex flex-column justify-content-center">

										<div className="section-header sec-header-one wow fadeInUp" data-wow-duration="1s">
											<p className="sub-title">Vì sức khỏe tốt hơn của bạn.</p>
											<h2 className="section-title">Tải ứng dụng Doccure ngay hôm nay!</h2>
										</div>
										<div className="app-imgs wow fadeInUp" data-wow-duration="1s">
											<a href="#" aria-label="Download on App Store"><img src="assets/img/icons/app-store.svg" alt="apple-icon" /></a>
											<a href="#" aria-label="Get it on Google Play"><img src="assets/img/icons/google-play.svg" alt="google-play" /></a>
										</div>
									</div>
								</div>
								<div className="col-lg-6 wow fadeInUp" data-wow-duration="1s">
									<div className="app-img">
										<img src="assets/img/about/app-01.png" className="img-fluid" alt="app" />
									</div>
								</div>
							</div>
							<img src="assets/img/bg/app-bg-05.png" alt="img" className="app-bg-01" />
						</div>
					</div>
				</section>
				{/* App Section End */}

				{/* Blog Section */}
				<section className="section blog-section">
					<div className="container">

						{/* Section Header */}
						<div className="section-header section-header-two">
							<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Tin tức & Bài viết</div>
							<h2 className="section-title mb-0">Tin tức & Câu chuyện Mới nhất</h2>
						</div>
						{/* Section Header End */}

						<div className="row justify-content-center g-4">
							<div className="col-lg-4 col-md-6 d-flex">

								{/* Blog Post */}
								<div className="blog-item-two w-100 wow fadeInUp" data-wow-duration="1s">
									<div className="blog-img">
										<Link to="/blog-details">
											<img className="img-fluid" src="assets/img/blog/general-blog-01.jpg" alt="blog" />
										</Link>
										<Link to="/blog-grid" className="badge">Health Awareness</Link>
									</div>
									<div className="blog-content">
										<div className="blog-user-info">
											<div className="blog-user">
												<a href="#" className="avatar avatar-md">
													<img src="assets/img/patients/patient12.jpg" className="img-fluid rounded-circle" alt="user" />
												</a>
												<a href="#">Grace Morgan</a>
											</div>
											<p className="date">10, Sep 2026</p>
										</div>
										<h3 className="custom-title"><Link to="/blog-details">Tầm quan trọng của Chẩn đoán sớm: Tại sao Thời điểm lại Quan trọng...</Link></h3>
										<p className="mb-0">Chẩn đoán sớm có thể cải thiện đáng kể thành công của việc điều trị. Phát hiện các tình trạng ở giai đoạn sớm nhất...</p>
									</div>
								</div>
								{/* Blog Post End */}

							</div>
							<div className="col-lg-4 col-md-6 d-flex">


								{/* Blog Post */}
								<div className="blog-item-two w-100 wow fadeInUp" data-wow-duration="1s">
									<div className="blog-img">
										<Link to="/blog-details">
											<img className="img-fluid" src="assets/img/blog/general-blog-02.jpg" alt="blog" />
										</Link>
										<Link to="/blog-grid" className="badge">Công nghệ Y tế</Link>
									</div>
									<div className="blog-content">
										<div className="blog-user-info">
											<div className="blog-user">
												<a href="#" className="avatar avatar-md">
													<img src="assets/img/patients/patient20.jpg" className="img-fluid rounded-circle" alt="user" />
												</a>
												<a href="#">Daniel Scott</a>
											</div>
											<p className="date">15, Sep 2026</p>
										</div>
										<h3 className="custom-title"><Link to="/blog-details">Công nghệ đang thay đổi các bệnh viện hiện đại như thế nào</Link></h3>
										<p className="mb-0">Các bệnh viện ngày nay sử dụng chẩn đoán tiên tiến, công cụ AI, phẫu thuật robot và bệnh án điện tử...</p>
									</div>
								</div>
								{/* Blog Post End */}

							</div>
							<div className="col-lg-4 col-md-6 d-flex">

								{/* Blog Post */}
								<div className="blog-item-two w-100 wow fadeInUp" data-wow-duration="1s">
									<div className="blog-img">
										<Link to="/blog-details">
											<img className="img-fluid" src="assets/img/blog/general-blog-03.jpg" alt="blog" />
										</Link>
										<Link to="/blog-grid" className="badge">Nha khoa Tổng quát</Link>
									</div>
									<div className="blog-content">
										<div className="blog-user-info">
											<div className="blog-user">
												<a href="#" className="avatar avatar-md">
													<img src="assets/img/patients/patient21.jpg" className="img-fluid rounded-circle" alt="user" />
												</a>
												<a href="#">Jacob Allen</a>
											</div>
											<p className="date">25, Sep 2026</p>
										</div>
										<h3 className="custom-title"><Link to="/blog-details">Công nghệ đang thay đổi các bệnh viện hiện đại như thế nào</Link></h3>
										<p className="mb-0">Các bệnh viện ngày nay sử dụng chẩn đoán tiên tiến, công cụ AI, phẫu thuật robot và bệnh án điện tử...</p>
									</div>
								</div>
								{/* Blog Post End */}

							</div>
						</div>
						<div className="view-all text-center wow fadeInUp" data-wow-duration="1s">
							<Link to="/blog-list" className="btn btn-md btn-dark">Xem tất cả tin tức</Link>
						</div>
					</div>
				</section>
				{/* Blog Section End */}

				{/* Health Section */}
				<section className="section health-section trail-content" style={{ background: '#ffffff' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-10 mx-auto">
								{/* Removed image placeholders for a cleaner map view */}
								<style>{`
							.location-grid {
								display: grid;
								grid-template-columns: 1fr 1fr;
								gap: 30px;
								margin-bottom: 50px;
							}
							.map-container, .layout-container {
								width: 100%;
								height: 450px;
								border-radius: 30px;
								overflow: hidden;
								box-shadow: 0 20px 40px rgba(0,0,0,0.1);
								border: 5px solid #fff;
								background: #f8f9fa;
							}
							.map-container iframe, .layout-container img {
								width: 100%;
								height: 100%;
								border: 0;
								object-fit: contain;
								background: #fff;
							}
							@media (max-width: 991px) {
								.location-grid {
									grid-template-columns: 1fr;
								}
							}
						`}</style>
								<div className="health-content">
									<div className="section-header section-header-two text-center mb-5" style={{ width: '100%' }}>
										<h2 className="section-title"><span style={{ background: 'linear-gradient(90deg, #0E82FD 0%, #28C76F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vị trí & Sơ đồ Bệnh viện</span></h2>
										<p className="mt-2" style={{ color: '#64748b', fontSize: '1.1rem' }}>Địa chỉ: 527 Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ Chí Minh.</p>
									</div>
									<div className="location-grid">
										<div className="map-container wow fadeInLeft" data-wow-duration="1s">
											<iframe
												src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.7423699475496!2d106.66366944442747!3d10.774137000000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fa0cad4da25%3A0x6170fb9603ff966!2s115%20People%E2%80%99s%20Hospital!5e0!3m2!1sen!2s!4v1778522346768!5m2!1sen!2s"
												allowFullScreen
												loading="lazy"
												referrerPolicy="no-referrer-when-downgrade"
												title="Bản đồ Bệnh viện Nhân dân 115"
											></iframe>
										</div>
										<div className="layout-container wow fadeInRight" data-wow-duration="1s">
											<img src="assets/img/sodo.jpg" alt="Sơ đồ bệnh viện" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<img src="assets/img/bg/doctor-bg-01.png" alt="bg" className="img-fluid health-bg-01" />
					<img src="assets/img/bg/banner-05.png" alt="bg" className="img-fluid health-bg-02" />
				</section>
				{/* Health Section End */}

				{/* Footer */}
				<footer className="footer-two">

					{/* Footer Top */}
					<div className="footer-top">
						<div className="container">
							<div className="row g-4">
								<div className="col-xl-4 col-lg-3 col-md-6">

									{/* Footer Widget */}
									<div className="footer-widget footer-about">
										<div className="footer-logo">
											<img src="assets/img/logo-02.svg" alt="logo" />
										</div>
										<div className="footer-about-content">
											<p>Chúng tôi là Trung tâm Chăm sóc Mắt và Sức khỏe Thị lực chuyên nghiệp, cam kết cung cấp các dịch vụ chẩn đoán và điều trị tiên tiến.</p>
											<div className="social-icon">
												<ul>
													<li>
														<a href="#" aria-label="Facebook">FB</a>
													</li>
													<li>
														<a href="#" aria-label="Twitter">TW</a>
													</li>
													<li>
														<a href="#" aria-label="LinkedIn">LN</a>
													</li>
													<li>
														<a href="#" aria-label="YouTube">YT</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
									{/* Footer Widget End */}

								</div>

								<div className="col-lg-2 col-md-6">

									{/* Footer Widget */}
									<div className="footer-widget">
										<h3 className="footer-title">Công ty</h3>
										<ul className="footer-menu">
											<li><Link to="/about-us">Giới thiệu</Link></li>
											<li><Link to="/clinic">Phòng khám</Link></li>
											<li><Link to="/hospitals">Bệnh viện</Link></li>
											<li><Link to="/speciality">Chuyên khoa</Link></li>
											<li><Link to="/contact-us">Liên hệ</Link></li>
										</ul>
									</div>
									{/* Footer Widget End */}

								</div>

								<div className="col-xl-2 col-lg-3 col-md-6">

									{/* Footer Widget */}
									<div className="footer-widget footer-contact">
										<h3 className="footer-title">Bạn cần hỗ trợ?</h3>
										<div className="contact-info">
											<span>Ghé thăm bệnh viện</span>
											<p>1250 Đại lộ Sunset</p>
										</div>
										<div className="contact-info">
											<span>Yêu cầu chung</span>
											<p><a href="mailto:info@example.com">info@healthcare.com</a></p>
										</div>
										<div className="contact-info">
											<span>Gọi cho chúng tôi</span>
											<p><a href="tel:5456564578">+1 54565 64578</a></p>
										</div>
									</div>
									{/* Footer Widget End */}

								</div>

								<div className="col-lg-4 col-md-6">

									{/* Footer Widget */}
									<div className="footer-widget">
										<h3 className="footer-title">Giữ liên lạc với chúng tôi</h3>
										<div className="footer-subscribe">
											<p>Đăng ký nhận bản tin để cập nhật tin tức mới nhất từ hệ thống!</p>
											<div className="subscribe-input">
												<form action="#">
													<input type="email" className="form-control" placeholder="Nhập địa chỉ email" aria-label="Email address" />
													<button type="submit" className="btn-icon btn btn-primary-gradient" aria-label="Subscribe"><i className="isax isax-arrow-right-1"></i></button>
												</form>
											</div>
										</div>
									</div>
									{/* Footer Widget End */}

								</div>

							</div>
						</div>
						<img src="assets/img/bg/footer-bg-06.png" alt="bg" className="footer-bg-01" />
						<img src="assets/img/bg/footer-bg-07.png" alt="bg" className="footer-bg-02" />
					</div>
					{/* /Footer Top */}

					{/* Footer Bottom */}
					<div className="footer-bottom">
						<div className="container">

							{/* Copyright */}
							<div className="copyright">
								<div className="copyright-text">
									<p className="mb-0">Bản quyền &copy; 2026 The Clinical Curator. Bảo lưu mọi quyền.</p>
								</div>
								<div className="copyright-menu">
									<ul>
										<li><a href="#">Thông báo pháp lý</a></li>
										<li><Link to="/privacy-policy">Chính sách bảo mật</Link></li>
										<li><a href="#">Chính sách hoàn tiền</a></li>
									</ul>
								</div>
							</div>
							{/* Copyright End */}

						</div>
					</div>
					{/* Footer Bottom End */}

				</footer>
				{/* Footer End */}

				{/* Cursor */}
				<div className="mouse-cursor cursor-outer"></div>
				<div className="mouse-cursor cursor-inner"></div>
				{/* /Cursor */}

			</div>
			{/* Main Wrapper End */}
		</>
	);
};

export default LandingPage;
