import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import authService from "../services/authService";
import Modal from "./Modal";

const SignUpModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName.trim()) {
      toast.error("👤 Vui lòng nhập tên của bạn");
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error("👤 Vui lòng nhập họ của bạn");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("📧 Vui lòng nhập email của bạn");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("🔒 Vui lòng nhập mật khẩu");
      return;
    }
    if (!formData.confirmPassword.trim()) {
      toast.error("🔐 Vui lòng xác nhận mật khẩu");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("📧 Email không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("🔐 Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("🔒 Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;

      // Explicitly set role to 'user'
      registerData.role = "user";

      const response = await authService.register(registerData);

      if (response && response.success) {
        toast.success("🎉 Đăng ký thành công! Chào mừng bạn đến với cộng đồng học tập!");
        onClose();
        onSwitchToSignIn();
      } else {
        toast.error(response?.message || "❌ Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Registration error details:", error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message;
        
        switch (status) {
          case 400:
            if (errorMessage && errorMessage.includes("email")) {
              toast.error("📧 Email đã được sử dụng. Vui lòng chọn email khác!");
            } else {
              toast.error(errorMessage || "⚠️ Thông tin đăng ký không hợp lệ");
            }
            break;
          case 409:
            toast.error("👥 Email đã tồn tại. Bạn có muốn đăng nhập không?");
            break;
          case 404:
            toast.error("🔗 Lỗi kết nối với máy chủ. Vui lòng thử lại sau");
            break;
          case 500:
            toast.error("🚨 Lỗi máy chủ. Vui lòng thử lại sau");
            break;
          default:
            toast.error(errorMessage || "❌ Đăng ký thất bại");
        }
      } else if (error.request) {
        toast.error("🌐 Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng");
      } else {
        toast.error("💥 Đã xảy ra lỗi khi gửi yêu cầu đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng ký" size="lg">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#27B5FC] to-[#098be4] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserPlus className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tạo tài khoản mới</h3>
          <p className="text-gray-600">Tham gia cùng hàng nghìn học viên khác</p>
        </div>

        {/* Switch to sign in */}
        <div className="text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToSignIn}
              className="text-[#27B5FC] hover:text-[#098be4] font-semibold hover:underline transition-colors"
            >
              Đăng nhập
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:border-[#27B5FC] transition-all duration-200"
                  placeholder="Nhập tên"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Họ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:border-[#27B5FC] transition-all duration-200"
                  placeholder="Nhập họ"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:border-[#27B5FC] transition-all duration-200"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:border-[#27B5FC] transition-all duration-200"
                  placeholder="Tạo mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:border-[#27B5FC] transition-all duration-200"
                  placeholder="Xác nhận mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#27B5FC] border-gray-300 rounded focus:ring-[#27B5FC]"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                Tôi đồng ý với{" "}
                {/* <Link to="/terms" className="text-[#27B5FC] hover:text-[#098be4] hover:underline"> */}
                  Điều khoản dịch vụ{" "}
                {/* </Link>{" "} */}
                và{" "}
                {/* <Link to="/privacy" className="text-[#27B5FC] hover:text-[#098be4] hover:underline"> */}
                  Chính sách bảo mật
                {/* </Link> */}
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#27B5FC] to-[#098be4] text-white rounded-xl hover:from-[#098be4] hover:to-[#27B5FC] focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang tạo tài khoản...
              </div>
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </form>

        {/* Social signup options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
