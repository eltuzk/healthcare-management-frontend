import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
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
			<button type="button" id="dark-mode-toggle" className="theme-toggle moon" aria-label="dark mode">
				<i className="isax isax-moon5"></i>
			</button>
			<button type="button" id="light-mode-toggle" className="theme-toggle sun" aria-label="light mode">
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
						<ul className="main-nav">
							<li className="has-submenu megamenu active">
								<a href="#" className="main-menu" >Trang chủ <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu mega-submenu">
									<li>
										<div className="megamenu-wrapper">
											<div className="row">
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/" className="inner-demo-img"><img src="assets/img/home/home.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/" className="inner-demo-img">General Home 1</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo active">
														<div className="demo-img">
															<Link to="/" className="inner-demo-img"><img src="assets/img/home/home-01.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/" className="inner-demo-img">General Home 2</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-3" className="inner-demo-img"><img src="assets/img/home/home-02.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-3" className="inner-demo-img">Dental</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-4" className="inner-demo-img"><img src="assets/img/home/home-03.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-4" className="inner-demo-img">Nhi khoa</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-5" className="inner-demo-img"><img src="assets/img/home/home-04.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-5" className="inner-demo-img">ENT</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-6" className="inner-demo-img"><img src="assets/img/home/home-05.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-6" className="inner-demo-img">Thú y</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo ">
														<div className="demo-img">
															<Link to="/index-7" className="inner-demo-img"><img src="assets/img/home/home-06.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-7" className="inner-demo-img">Cardiology</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-8" className="inner-demo-img"><img src="assets/img/home/home-07.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-8" className="inner-demo-img">Eye Care</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-9" className="inner-demo-img"><img src="assets/img/home/home-08.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-9" className="inner-demo-img">Home Care</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-10" className="inner-demo-img"><img src="assets/img/home/home-09.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-10" className="inner-demo-img">Fertility</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-11" className="inner-demo-img"><img src="assets/img/home/home-10.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-11" className="inner-demo-img">Cosmetic Surgery</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-12" className="inner-demo-img"><img src="assets/img/home/home-11.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-12" className="inner-demo-img">Laboratory</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-13" className="inner-demo-img"><img src="assets/img/home/home-12.jpg" className="img-fluid" alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-13" className="inner-demo-img">Pharmacy</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-14" className="inner-demo-img"><img src="assets/img/home/home-14.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-14" className="inner-demo-img">Dermatology</Link>
														</div>
													</div>
												</div>
												<div className="col">
													<div className="single-demo">
														<div className="demo-img">
															<Link to="/index-15" className="inner-demo-img"><img src="assets/img/home/home-15.jpg" className="img-fluid " alt="img" /></Link>
														</div>
														<div className="demo-info">
															<Link to="/index-15" className="inner-demo-img">Mental Health</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>
							<li className="has-submenu">
								<a href="#" className="main-menu" >Bác sĩ <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu sub-menu-one">
									<li>
										<div className="row">
											<div className="col-lg-6">
												<ul className="sub-menu-list">
													<li><Link to="/doctor-dashboard">Doctor Dashboard</Link></li>
													<li><Link to="/appointments">Appointments</Link></li>
													<li><Link to="/available-timings">Sẵn sàng Timing</Link></li>
													<li><Link to="/my-patients">Patients List</Link></li>
													<li><Link to="/chat-doctor">Chat</Link></li>
													<li><Link to="/invoices">Invoices</Link></li>
													<li><Link to="/doctor-profile-settings">Profile Settings</Link></li>
												</ul>
											</div>
											<div className="col-lg-6">
												<div className="menu-img">
													<img src="assets/img/home/menu-img-1.jpg" alt="listing" className="img-fluid" />
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>
							<li className="has-submenu">
								<a href="#" className="main-menu" >Bệnh nhân <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu sub-menu-one sub-menu-two">
									<li>
										<div className="row">
											<div className="col-lg-4 sub-menu-left">
												<ul className="sub-menu-list">
													<li><Link to="/patient-dashboard">Patient Dashboard</Link></li>
													<li><Link to="/map-grid">Doctors Grid</Link></li>
													<li><Link to="/map-list">Doctors List</Link></li>
													<li><Link to="/map-list-availability">Doctors Availability</Link></li>
													<li><Link to="/booking">Booking</Link></li>
													<li><Link to="/booking-1">Booking 1</Link></li>
													<li><Link to="/booking-2">Booking 2</Link></li>
													<li><Link to="/booking-popup">Booking Popup</Link></li>
												</ul>
											</div>
											<div className="col-lg-4">
												<ul className="sub-menu-list">
													<li><Link to="/search">Tìm kiếm Bác sĩ 1</Link></li>
													<li><Link to="/search-2">Tìm kiếm Bác sĩ 2</Link></li>
													<li><Link to="/doctor-profile">Doctor Profile 1</Link></li>
													<li><Link to="/doctor-profile-2">Doctor Profile 2</Link></li>
													<li><Link to="/checkout">Checkout</Link></li>
													<li><Link to="/favourites">Favourites</Link></li>
													<li><Link to="/chat">Chat</Link></li>
													<li><Link to="/profile-settings">Profile Settings</Link></li>
												</ul>
											</div>
											<div className="col-lg-4">
												<div className="menu-img">
													<img src="assets/img/home/menu-img-2.jpg" alt="listing" className="img-fluid" />
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>
							<li className="has-submenu">
								<a href="#" className="main-menu" >Nhà thuốc <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu sub-menu-one sub-menu-three">
									<li>
										<div className="row">
											<div className="col-lg-6">
												<ul className="sub-menu-list">
													<li><Link to="/index-13">Pharmacy</Link></li>
													<li><Link to="/pharmacy-details">Pharmacy Details</Link></li>
													<li><Link to="/pharmacy-search">Pharmacy Search</Link></li>
													<li><Link to="/product-all">Product</Link></li>
													<li><Link to="/product-description">Product Description</Link></li>
													<li><Link to="/cart">Cart</Link></li>
													<li><Link to="/product-checkout">Product Checkout</Link></li>
													<li><Link to="/payment-success">Payment Success</Link></li>
													<li><Link to="/pharmacy-register">Pharmacy Register</Link></li>
												</ul>
											</div>
											<div className="col-lg-6">
												<div className="menu-img">
													<img src="assets/img/home/menu-img-3.jpg" alt="listing" className="img-fluid" />
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>
							<li className="has-submenu megamenu">
								<a href="#" className="main-menu" >Trang <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu mega-submenu">
									<li>
										<div className="megamenu-wrapper megamenu-wrapper-one">
											<div className="row">
												<div className="col-lg-3 sub-menu-left">
													<ul className="sub-menu-list">
														<li><Link to="/about-us">Về chúng tôi</Link></li>
														<li><Link to="/contact-us">Liên hệ</Link></li>
														<li><Link to="/hospitals">Bệnh viện</Link></li>
														<li><Link to="/speciality">Speciality</Link></li>
														<li><Link to="/clinic">Clinic</Link></li>
														<li><Link to="/blank-page">Starter Page</Link></li>
														<li><Link to="/pricing">Bảng giá dịch vụ</Link></li>
														<li><Link to="/faq">FAQ</Link></li>
													</ul>
												</div>
												<div className="col-lg-3 sub-menu-left">
													<ul className="sub-menu-list">
														<li><Link to="/login-email">Login Email</Link></li>
														<li><Link to="/login-phone">Login Phone</Link></li>
														<li><Link to="/doctor-signup">Doctor Signup</Link></li>
														<li><Link to="/patient-signup">Patient Signup</Link></li>
														<li><Link to="/forgot-password">Forgot Password 1</Link></li>
														<li><Link to="/forgot-password2">Forgot Password 2</Link></li>
														<li><Link to="/login-email-otp">Email OTP</Link></li>
														<li><Link to="/login-phone-otp">Phone OTP</Link></li>
													</ul>
												</div>
												<div className="col-lg-3 sub-menu-left">
													<ul className="sub-menu-list">
														<li><Link to="/maintenance">Maintenance</Link></li>
														<li><Link to="/coming-soon">Coming Soon</Link></li>
														<li><Link to="/terms-condition">Terms & Condition</Link></li>
														<li><Link to="/privacy-policy">Chính sách bảo mật</Link></li>
														<li><Link to="/components">Components</Link></li>
														<li><Link to="/invoices">Invoices</Link></li>
														<li><Link to="/invoice-view">Invoice View</Link></li>
													</ul>
												</div>
												<div className="col-lg-3">
													<ul className="sub-menu-list">
														<li><Link to="/voice-call">Voice Call</Link></li>
														<li><Link to="/video-call">Video Call</Link></li>
														<li><Link to="/error-404">404 Error</Link></li>
														<li><Link to="/error-500">500 Error</Link></li>
													</ul>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</li>
							<li className="has-submenu">
								<a href="#" className="main-menu" >Tin tức <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu sub-menu-one sub-menu-default">
									<li><Link to="/blog-list">Blog List</Link></li>
									<li><Link to="/blog-grid">Blog Grid</Link></li>
									<li><Link to="/blog-details">Blog Details</Link></li>
								</ul>
							</li>
							<li className="has-submenu">
								<a href="#" className="main-menu" >Quản trị <span><i className="fas fa-chevron-down"></i></span></a>
								<ul className="submenu sub-menu-one sub-menu-default">
									<li><Link to="/admin/index" target="_blank">Admin</Link></li>
									<li><Link to="/pharmacy/index" target="_blank">Pharmacy Admin</Link></li>
								</ul>
							</li>
						</ul>
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
							<div className="banner-badge">
								<span>Công nghệ Tiên tiến</span> 
								<p>Chẩn đoán toàn diện bởi các chuyên gia hàng đầu.</p>
							</div>
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
								<p>Calling.......</p>
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

		{/* Service Section */}
		<section className="section service-section">
			<div className="container">

				<div className="row g-4">

					{/* Service Item */}
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-primary-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
							<div className="service-icon">
								<img src="assets/img/icons/booking.svg" alt="booking" className="img-fluid" />
							</div>
							<h3><Link to="/reception">Tiếp đón & Đăng ký</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

					{/* Service Item */}
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-success-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="2s">
							<div className="service-icon">
								<img src="assets/img/icons/lab.svg" alt="lab" className="img-fluid" />
							</div>
							<h3><Link to="/lab-tests">Xét nghiệm & Chẩn đoán</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

					{/* Service Item */}
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-pink-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="3s">
							<div className="service-icon">
								<img src="assets/img/icons/doctor.svg" alt="booking" className="img-fluid" />
							</div>
							<h3><Link to="/examination">Khám bệnh & Tư vấn</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

					{/* Service Item */}
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-gray-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="4s">
							<div className="service-icon">
								<img src="assets/img/icons/health-care.svg" alt="health care" className="img-fluid" />
							</div>
							<h3><Link to="/history">Hồ sơ bệnh án</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

					{/* Service Item */}					
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-secondary-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="5s">
							<div className="service-icon">
								<img src="assets/img/icons/medicine.svg" alt="medicine" className="img-fluid" />
							</div>
							<h3><Link to="/pharmacy">Dược phẩm & Vật tư</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

					{/* Service Item */}
					<div className="col-xl-2 col-lg-4 col-sm-6 d-flex">
						<div className="services-item-two bg-orange-transparent w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="6s">
							<div className="service-icon">
								<img src="assets/img/icons/home-care.svg" alt="home care" className="img-fluid" />
							</div>
							<h3><Link to="/schedules">Lịch trực Bác sĩ</Link></h3>
						</div>
					</div>
					{/* Service Item End */}

				</div>

			</div>
		</section>
		{/* Service Section End */}

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
							<Link to="/about-us" className="btn btn-md btn-primary">Tìm hiểu thêm<i className="isax isax-arrow-right-34 ms-2"></i></Link>
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

					
					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1s">
							<div className="speciality-info">
								<Link to="/examination" className="speciality-icon">
									<img src="assets/img/icons/specilaity-01.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/examination">Khám bệnh</Link></h3>
									<p>Khám chuyên khoa</p>
								</div>
							</div>
							<Link to="/examination" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="2s">
							<div className="speciality-info">
								<Link to="/lab-tests" className="speciality-icon">
									<img src="assets/img/icons/specilaity-02.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/lab-tests">Xét nghiệm</Link></h3>
									<p>Cận lâm sàng</p>
								</div>
							</div>
							<Link to="/lab-tests" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="3s">
							<div className="speciality-info">
								<Link to="/pharmacy" className="speciality-icon">
									<img src="assets/img/icons/specilaity-03.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/pharmacy">Nhà thuốc</Link></h3>
									<p>Quản lý dược</p>
								</div>
							</div>
							<Link to="/pharmacy" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="4s">
							<div className="speciality-info">
								<Link to="/inpatient" className="speciality-icon">
									<img src="assets/img/icons/specilaity-04.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/inpatient">Nội trú</Link></h3>
									<p>Quản lý buồng giường</p>
								</div>
							</div>
							<Link to="/inpatient" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="5s">
							<div className="speciality-info">
								<Link to="/history" className="speciality-icon">
									<img src="assets/img/icons/specilaity-05.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/history">Hồ sơ bệnh án</Link></h3>
									<p>Bệnh án điện tử</p>
								</div>
							</div>
							<Link to="/history" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="6s">
							<div className="speciality-info">
								<Link to="/reception" className="speciality-icon">
									<img src="assets/img/icons/specilaity-06.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/reception">Tiếp đón</Link></h3>
									<p>Đăng ký khám</p>
								</div>
							</div>
							<Link to="/reception" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="7s">
							<div className="speciality-info">
								<Link to="/billing" className="speciality-icon">
									<img src="assets/img/icons/specilaity-07.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/billing">Viện phí</Link></h3>
									<p>Hóa đơn & Thanh toán</p>
								</div>
							</div>
							<Link to="/billing" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}

					{/* Specility Item */}
					<div className="col-xl-3 col-lg-4 col-md-6 d-flex">
						<div className="speciality-item-two w-100 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="8s">
							<div className="speciality-info">
								<Link to="/schedules" className="speciality-icon">
									<img src="assets/img/icons/specilaity-08.svg" alt="speciality" />
								</Link>
								<div>
									<h3 className="custom-title"><Link to="/schedules">Lịch trực</Link></h3>
									<p>Bác sĩ & Nhân viên</p>
								</div>
							</div>
							<Link to="/schedules" className="link-icon" aria-label="Xem bác sĩ"><i className="isax isax-arrow-right-1"></i></Link>
						</div>
					</div>
					{/* Specility Item End */}
  

				</div>

			</div>
		</section>
		{/* Speciality Section End */}

		{/* Doctor Section */}
		<section className="section doctor-section-two">
			<div className="container">

				{/* Section Header */}
				<div className="section-header section-header-two">
					<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Đội ngũ của chúng tôi</div>
					<h2 className="section-title mb-0">Chuyên gia hàng đầu <span>Tận tâm chăm sóc bạn</span></h2>
				</div>
				{/* Section Header End */}

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
									<Link to="/doctor-profile">Dr. Hattie Driskell</Link>
								</h3>
								<p className="speciality">Orthopedic</p>
								<div className="available-info">
									<p><i className="isax isax-location me-1"></i>Los Angeles, CA</p>
									<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
								</div>
								<Link to="/booking" className="btn btn-md btn-light w-100"><i className="isax isax-calendar-1 me-2"></i>Đặt ngay</Link>
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
									<Link to="/doctor-profile">Dr. Calvin Haley</Link>
								</h3>
								<p className="speciality">Dentist</p>
								<div className="available-info">
									<p><i className="isax isax-location me-1"></i>Austin, TX</p>
									<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
								</div>
								<Link to="/booking" className="btn btn-md btn-light w-100"><i className="isax isax-calendar-1 me-2"></i>Đặt ngay</Link>
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
									<Link to="/doctor-profile">Dr. Lisa Labonte</Link>
								</h3>
								<p className="speciality">Neurologist</p>
								<div className="available-info">
									<p><i className="isax isax-location me-1"></i>Newyork, USA</p>
									<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
								</div>
								<Link to="/booking" className="btn btn-md btn-light w-100"><i className="isax isax-calendar-1 me-2"></i>Đặt ngay</Link>
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
									<Link to="/doctor-profile">Dr. James Davidson</Link>
								</h3>
								<p className="speciality">Immunologist</p>
								<div className="available-info">
									<p><i className="isax isax-location me-1"></i>Waipahu, HI</p>
									<span className="badge bg-success"><i className="fa-solid fa-circle fs-5 me-1"></i>Sẵn sàng</span>
								</div>
								<Link to="/booking" className="btn btn-md btn-light w-100"><i className="isax isax-calendar-1 me-2"></i>Đặt ngay</Link>
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
					<h2 className="section-title mb-0">Lựa chọn <span>Gói dịch vụ phù hợp</span></h2>
				</div>

				<div className="row align-items-end g-4">

					{/* Price Item */}
					<div className="col-xl-3 col-md-6 d-flex">
						<div className="price-item flex-fill wow fadeInUp" data-wow-duration="1s">
							<div className="price-header">
								<p className="sub-title">Free</p>
								<div className="price">$0<span>/monthly</span></div>
								<Link to="/login" className="btn btn-md btn-dark">Bắt đầu ngay</Link>
							</div>
							<div className="price-body">
								<h3>Bao gồm những gì</h3>
								<ul>
									<li>1 Người dùng</li>
									<li>Hồ sơ bệnh án điện tử</li>
									<li>Lập hóa đơn & Thanh toán</li>
									<li>Quản lý tài khoản gia đình</li>
									<li>Đặt xét nghiệm & Theo dõi mẫu</li>
									<li>Tạo báo cáo tự động</li>
								</ul>
							</div>
						</div>
					</div>
					{/* Price Item End */}

					{/* Price Item */}
					<div className="col-xl-3 col-md-6 d-flex">
						<div className="price-item flex-fill wow fadeInUp" data-wow-duration="1s">
							<div className="price-header">
								<p className="sub-title">Basic</p>
								<div className="price">$39<span>/monthly</span></div>
								<Link to="/login" className="btn btn-md btn-dark">Bắt đầu ngay</Link>
							</div>
							<div className="price-body">
								<h3>Bao gồm những gì</h3>
								<ul>
									<li>10 Người dùng</li>
									<li>Truy cập kho dược</li>
									<li>Tự động hóa hóa đơn</li>
									<li>Quản lý tài khoản gia đình</li>
									<li>Đặt xét nghiệm & Theo dõi mẫu</li>
									<li>Phân tích & Báo cáo</li>
								</ul>
							</div>
						</div>
					</div>
					{/* Price Item End */}

					{/* Price Item */}
					<div className="col-xl-3 col-md-6 d-flex">
						<div className="price-item active flex-fill wow fadeInUp" data-wow-duration="1s">
							<span className="recommend">Khuyên dùng</span>
							<div className="price-header">
								<p className="sub-title">Premium</p>
								<div className="price">$99<span>/monthly</span></div>
								<Link to="/login" className="btn btn-md btn-dark">Bắt đầu ngay</Link>
							</div>
							<div className="price-body">
								<h3>Bao gồm những gì</h3>
								<ul>
									<li>100 Người dùng</li>
									<li>Hóa đơn & Chứng từ</li>
									<li>Hỗ trợ chuyên biệt</li>
									<li>Quản lý tài khoản gia đình</li>
									<li>Đặt xét nghiệm & Theo dõi mẫu</li>
									<li>Phân tích & Báo cáo</li>
								</ul>
							</div>
						</div>
					</div>
					{/* Price Item End */}

					{/* Price Item */}
					<div className="col-xl-3 col-md-6 d-flex">
						<div className="price-item flex-fill wow fadeInUp" data-wow-duration="1s">
							<div className="price-header">
								<p className="sub-title">Enterprise</p>
								<div className="price">$129<span>/monthly</span></div>
								<Link to="/login" className="btn btn-md btn-dark">Bắt đầu ngay</Link>
							</div>
							<div className="price-body">
								<h3>Bao gồm những gì</h3>
								<ul>
									<li>Không giới hạn người dùng</li>
									<li>Truy cập kho dược</li>
									<li>Hỗ trợ chuyên biệt</li>
									<li>Quản lý tài khoản gia đình</li>
									<li>Đặt xét nghiệm & Theo dõi mẫu</li>
									<li>Phân tích & Báo cáo</li>
								</ul>
							</div>
						</div>
					</div>
					{/* Price Item End */}

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
			<div className="container-fluid">

				{/* Section Header */}
				<div className="section-header section-header-two">
					<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Đánh giá từ khách hàng</div>
					<h2 className="section-title mb-0">What Our Patients <span>Say Về chúng tôi</span></h2>
				</div>
				{/* Section Header End */}

				<div className="testimonial-slider-two">

					{/* Testimonial Item */}
					<div className="testimonial-item-two">
						<div className="testimonial-author-img">
							<img src="assets/img/patients/patient22.jpg" className="rounded-circle" alt="patient" />
						</div>
						<div className="quote-icon">
							<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
						</div>
						<div className="testimonial-content">
							<p className="description">The emergency department responded promptly and efficiently when I arrived with severe pain. The doctors didn’t rush and made sure I understood. Best healthcare experiences</p>
						</div>
						<div className="testimonial-author-info">
							<div>
								<h3 className="custom-title">Daniel Carter</h3>
								<p className="author-location">Dallas, CA</p>
							</div>
							<div className="rating">
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled"></i>
							</div>
						</div>
					</div>
					{/* Testimonial Item End */}

					{/* Testimonial Item */}
					<div className="testimonial-item-two">
						<div className="testimonial-author-img">
							<img src="assets/img/patients/patient25.jpg" className="rounded-circle" alt="patient" />
						</div>
						<div className="quote-icon">
							<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
						</div>
						<div className="testimonial-content">
							<p className="description">Sự chăm sóc tôi nhận được tại bệnh viện này thật tuyệt vời. The doctors explained everything clearly, the nurses were incredibly kind, and the facilities were spotless. I felt safe, supported, and genuinely cared for throughout my stay. Thật sự là một trong những trải nghiệm chăm sóc sức khỏe tốt nhất.</p>
						</div>
						<div className="testimonial-author-info">
							<div>
								<h3 className="custom-title">Jeni Adams</h3>
								<p className="author-location">Los Boston, USA</p>
							</div>
							<div className="rating">
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled"></i>
							</div>
						</div>
					</div>
					{/* Testimonial Item End */}

					{/* Testimonial Item */}
					<div className="testimonial-item-two">
						<div className="testimonial-author-img">
							<img src="assets/img/patients/patient24.jpg" className="rounded-circle" alt="patient" />
						</div>
						<div className="quote-icon">
							<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
						</div>
						<div className="testimonial-content">
							<p className="description">Dịch vụ xuất sắc và bầu không khí thân thiện. The staff is knowledgeable and truly cares about their patients health, ensuring every visit is enjoyable.</p>
						</div>
						<div className="testimonial-author-info">
							<div>
								<h3 className="custom-title">Mike Smith</h3>
								<p className="author-location">San Francisco, CA</p>
							</div>
							<div className="rating">
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled"></i>
							</div>
						</div>
					</div>
					{/* Testimonial Item End */}

					{/* Testimonial Item */}
					<div className="testimonial-item-two">
						<div className="testimonial-author-img">
							<img src="assets/img/patients/patient27.jpg" className="rounded-circle" alt="patient" />
						</div>
						<div className="quote-icon">
							<img src="assets/img/icons/quote-icon-01.svg" alt="quote" />
						</div>
						<div className="testimonial-content">
							<p className="description">The staff is knowledgeable and truly cares about their patients health, ensuring every visit is enjoyable. Dịch vụ xuất sắc và bầu không khí thân thiện.</p>
						</div>
						<div className="testimonial-author-info">
							<div>
								<h3 className="custom-title">Mark Andrew</h3>
								<p className="author-location">San Francisco, CA</p>
							</div>
							<div className="rating">
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled me-1"></i>
								<i className="fa-solid fa-star filled"></i>
							</div>
						</div>
					</div>
					{/* Testimonial Item End */}

				</div>

			</div>
		</section>
		{/* Testimonial Section End */}

		{/* App Section */}
		<section className="app-section-two">
			<div className="container">
				<div className="company-slider-two">
					<div className="slide-item">
						<img src="assets/img/company/company-09.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-10.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-11.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-12.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-13.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-14.svg" alt="client logo" />
					</div>
					<div className="slide-item">
						<img src="assets/img/company/company-11.svg" alt="client logo" />
					</div>
				</div>
				<div className="app-sec">
					<div className="row align-items-end">
						<div className="col-lg-6">
							<div className="app-content d-flex flex-column justify-content-center">

								<div className="section-header sec-header-one wow fadeInUp" data-wow-duration="1s">
									<p className="sub-title">Working for Your Better Health.</p>
									<h2 className="section-title">Download the Doccure App today!</h2>
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
					<div className="section-sub-title"><img src="assets/img/icons/section-icon.svg" alt="icon" />Blogs & Articles</div>
					<h2 className="section-title mb-0">Latest News & Stories</h2>
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
								<h3 className="custom-title"><Link to="/blog-details">The Importance of Early Diagnosis: Why Timing Matters...</Link></h3>
								<p className="mb-0">Early diagnosis can dramatically improve treatment success. Detecting conditions in their earliest...</p>
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
		<section className="section health-section trail-content">
			<div className="container">
				<div className="row">
					<div className="col-lg-10 mx-auto">
						<div className="content-img">
							<div className="content-img-single">
								<img src="assets/img/about/health-03.jpg" className="img-fluid" alt="health" />
							</div>
						</div>
						<div className="content-img">
							<div className="content-img-single">
								<img src="assets/img/about/health-04.jpg" className="img-fluid" alt="health" />
							</div>
						</div>
						<div className="content-img">
							<div className="content-img-single">
								<img src="assets/img/about/health-05.jpg" className="img-fluid" alt="health" />
							</div>
						</div>
						<div className="health-content">
							<h2><span className="health-img"><img src="assets/img/about/health-01.jpg" alt="health" className="img-fluid" /></span> From common illnesses to chronic disease management, we deliver <span className="avatar-list-stacked avatar-group-lg"><span className="avatar"><img src="assets/img/patients/patient24.jpg" alt="patient" className="img-fluid rounded-circle" /></span><span className="avatar"><img src="assets/img/patients/patient25.jpg" alt="patient" className="img-fluid rounded-circle" /></span><span className="avatar"><img src="assets/img/patients/patient26.jpg" alt="patient" className="img-fluid rounded-circle" /></span><span className="avatar"><img src="assets/img/patients/patient27.jpg" alt="patient" className="img-fluid rounded-circle" /></span></span> personalized care designed to improve your long-term health. <span className="health-img"><img src="assets/img/about/health-02.jpg" alt="health" className="img-fluid" /></span></h2>
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
									<p>We are a dedicated Eye Care and Vision Health Center committed to providing advanced, Diagnostic Treatments.</p>
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
									<span>Ghé thăm phòng khám</span>
									<p>1250 Sunset Boulevard</p>
								</div>
								<div className="contact-info">
									<span>Yêu cầu chung</span>
									<p><a href="mailto:info@example.com">info@example.com</a></p>
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
