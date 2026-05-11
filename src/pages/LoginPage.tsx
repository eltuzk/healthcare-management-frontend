import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Thêm class account-page vào body
		document.body.classList.add('account-page');

		const cssFiles = [
			'/assets/css/bootstrap.min.css',
			'/assets/plugins/fontawesome/css/fontawesome.min.css',
			'/assets/plugins/fontawesome/css/all.min.css',
			'/assets/css/iconsax.css',
			'/assets/css/feather.css',
			'/assets/plugins/fancybox/jquery.fancybox.min.css',
			'/assets/css/style.min.css'
		];
		const jsFiles = [
			'/assets/js/jquery-3.7.1.min.js',
			'/assets/js/bootstrap.bundle.min.js',
			'/assets/plugins/fancybox/jquery.fancybox.min.js',
			'/assets/js/script.min.js'
		];

		const injectedLinks: HTMLLinkElement[] = [];
		const injectedScripts: HTMLScriptElement[] = [];

		cssFiles.forEach(href => {
			const link = document.createElement('link');
			link.rel = 'stylesheet'; link.href = href;
			document.head.appendChild(link);
			injectedLinks.push(link);
		});

		const loadScripts = async () => {
			for (const src of jsFiles) {
				await new Promise((resolve) => {
					const script = document.createElement('script');
					script.src = src; script.async = false;
					script.onload = resolve;
					document.body.appendChild(script);
					injectedScripts.push(script);
				});
			}
		};
		loadScripts();

		return () => {
			// Cleanup
			document.body.classList.remove('account-page');
			injectedLinks.forEach(l => l.parentNode?.removeChild(l));
			injectedScripts.forEach(s => s.parentNode?.removeChild(s));
		};
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const response = await login({ email, password });
			localStorage.setItem('token', response.accessToken);
			localStorage.setItem('role', response.role);
			
			switch (response.role) {
				case 'ADMIN': navigate('/dashboard'); break;
				case 'DOCTOR': navigate('/daily-patients'); break;
				case 'RECEPTIONIST': navigate('/patients'); break;
				case 'TECHNICIAN': navigate('/lab-tests'); break;
				case 'PHARMACIST': navigate('/pharmacy-inventory'); break;
				case 'ACCOUNTANT': navigate('/billing'); break;
				default: navigate('/dashboard');
			}
		} catch (err: any) {
			setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="main-wrapper">
			{/* Header */}
			<header className="header header-default">
				<div className="container">
					<nav className="navbar navbar-expand-lg header-nav">
						<div className="navbar-header">
							<Link id="mobile_btn" to="#">
								<i className="fa-solid fa-bars"></i>
							</Link>
							<Link to="/" className="navbar-brand logo">
								<img src="/assets/img/logo.svg" className="img-fluid" alt="Logo" />
							</Link>
						</div>
						<div className="header-menu">
							<div className="main-menu-wrapper">
								<div className="menu-header">
									<Link to="/" className="menu-logo">
										<img src="/assets/img/logo.svg" className="img-fluid" alt="Logo" />
									</Link>
									<Link id="menu_close" className="menu-close" to="#">
										<i className="fas fa-times"></i>
									</Link>
								</div>
								<ul className="main-nav">
									<li><Link to="/">Trang chủ</Link></li>
									<li><Link to="/doctors">Bác sĩ</Link></li>
									<li><Link to="/patients">Bệnh nhân</Link></li>
									<li><Link to="/pharmacy">Nhà thuốc</Link></li>
								</ul>
							</div>
						</div>
						<ul className="nav header-navbar-rht">
							<li>
								<Link to="/login" className="btn btn-md btn-primary-gradient">
									<i className="isax isax-lock-1 me-2"></i><span>Đăng nhập</span> 
								</Link>
							</li>
							<li>
								<Link to="/register" className="btn btn-md btn-dark">
									<i className="isax isax-user-tick me-2"></i><span>Đăng ký</span> 
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>
			
			<div className="content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-8 offset-md-2">
							<div className="account-content">
								<div className="row align-items-center justify-content-center">
									<div className="col-md-7 col-lg-6 login-left">
										<img src="/assets/img/login-banner.png" className="img-fluid" alt="Login" />	
									</div>
									<div className="col-md-12 col-lg-6 login-right">
										<div className="login-header">
											<h3>Đăng nhập <span>The Clinical Curator</span></h3>
										</div>
										{error && <div className="alert alert-danger">{error}</div>}
										<form onSubmit={handleLogin}>
											<div className="mb-3">
												<label className="form-label">Email</label>
												<input 
													type="email" 
													className="form-control" 
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
												/>
											</div>
											<div className="mb-3">
												<div className="form-group-flex">
													<label className="form-label">Mật khẩu</label>
													<Link to="/forgot-password" style={{ color: '#007bff', fontSize: '14px' }} className="forgot-link">Quên mật khẩu?</Link>
												</div>
												<div className="pass-group">
													<input 
														type="password" 
														className="form-control pass-input"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														required
													/>
												</div>
											</div>
											<div className="mb-3">
												<button className="btn btn-primary-gradient w-100" type="submit" disabled={loading}>
													{loading ? 'Đang xử lý...' : 'Đăng nhập'}
												</button>
											</div>
											<div className="login-or">
												<span className="or-line"></span>
												<span className="span-or">hoặc</span>
											</div>
											<div className="social-login-btn">
												<Link to="#" className="btn w-100">
													<img src="/assets/img/icons/google-icon.svg" alt="google" /> Đăng nhập với Google
												</Link>
											</div>
											<div className="account-signup">
												<p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>		

			<footer className="footer inner-footer">
				<div className="footer-top">
					<div className="container">
						<div className="row">
							<div className="col-lg-3 col-md-6">
								<div className="footer-widget footer-about">
									<div className="footer-logo">
										<img src="/assets/img/logo.svg" alt="logo" />
									</div>
									<div className="footer-about-content">
										<p>The Clinical Curator - Hệ thống quản lý y tế thông minh, kết nối bác sĩ và bệnh nhân một cách hiệu quả nhất.</p>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-md-6">
								<div className="footer-widget footer-menu">
									<h2 className="footer-title">Dành cho Bệnh nhân</h2>
									<ul>
										<li><Link to="/search">Tìm kiếm Bác sĩ</Link></li>
										<li><Link to="/login">Đăng nhập</Link></li>
										<li><Link to="/register">Đăng ký</Link></li>
									</ul>
								</div>
							</div>
							<div className="col-lg-3 col-md-6">
								<div className="footer-widget footer-menu">
									<h2 className="footer-title">Dành cho Bác sĩ</h2>
									<ul>
										<li><Link to="/appointments">Lịch hẹn</Link></li>
										<li><Link to="/chat">Trò chuyện</Link></li>
										<li><Link to="/login">Cổng thông tin</Link></li>
									</ul>
								</div>
							</div>
							<div className="col-lg-3 col-md-6">
								<div className="footer-widget footer-contact">
									<h2 className="footer-title">Liên hệ</h2>
									<div className="footer-contact-info">
										<div className="footer-address">
											<p><i className="fas fa-map-marker-alt"></i> 123 Đường y học, TP. Hồ Chí Minh</p>
										</div>
										<p><i className="fas fa-phone-alt"></i> +1 315 369 5943</p>
										<p className="mb-0"><i className="fas fa-envelope"></i> curator@example.com</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="footer-bottom">
					<div className="container">
						<div className="copyright">
							<div className="row">
								<div className="col-md-6 col-lg-6">
									<div className="copyright-text">
										<p className="mb-0">Bản quyền &copy; 2026 The Clinical Curator. Bảo lưu mọi quyền.</p>
									</div>
								</div>
								<div className="col-md-6 col-lg-6">
									<div className="copyright-menu">
										<ul className="policy-menu">
											<li><Link to="#">Pháp lý</Link></li>
											<li><Link to="#">Bảo mật</Link></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LoginPage;
