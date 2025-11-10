import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { useLoginMutation, useResendVerificationEmailMutation } from "../redux/api/authSlice";

import Modal from "./Modal";

const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading } ] = useLoginMutation();
  const [resendVerificationEmail, { isLoading: isResending }] = useResendVerificationEmailMutation();
  const [errors, setErrors] = useState({});
  const [showResendEmail, setShowResendEmail] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
    useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setErrors({});
      setShowResendEmail(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail({ email }).unwrap();
      toast.success("Email xác nhận đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.", {
        position: "bottom-right",
      });
      setShowResendEmail(false);
    } catch (resendError) {
      toast.error(
        resendError?.data?.message || "Không thể gửi email. Vui lòng thử lại sau.",
        { position: "bottom-right" }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "📧 Vui lòng nhập email của bạn";
    }
    if (!password.trim()) {
      newErrors.password = "🔒 Vui lòng nhập mật khẩu";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setCredentials(user));
      toast.success("Đăng nhập thành công! Chào mừng bạn trở lại!", { position: "bottom-right" });
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      const status = error?.status;
      const errorMessage = error?.data?.message;
      const errorCode = error?.data?.code;
      
      switch (status) {
        case 403:
          if (errorCode === "EMAIL_NOT_VERIFIED") {
            setShowResendEmail(true);
            toast.error(errorMessage, { position: "bottom-right", autoClose: 5000 });
          } else {
            toast.error(errorMessage || "Bạn không có quyền truy cập", { position: "bottom-right" });
          }
          break;
        case 400:
        case 401:
          toast.error("Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại!", { position: "bottom-right" });
          break;
        case 500:
          toast.error("Lỗi máy chủ. Vui lòng thử lại sau", { position: "bottom-right" });
          break;
        default:
          toast.error(errorMessage || "❌ Đăng nhập thất bại", { position: "bottom-right" });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng nhập" size="md">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#27B5FC] to-[#098be4] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng trở lại!</h3>
          <p className="text-gray-600">Đăng nhập để tiếp tục học tập</p>
        </div>

        {/* Switch to sign up */}
        <div className="text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-[#27B5FC] hover:text-[#098be4] font-semibold hover:underline transition-colors"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({...errors, email: ''});
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#27B5FC] focus:border-[#27B5FC]'
                }`}
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({...errors, password: ''});
                  }
                }}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#27B5FC] focus:border-[#27B5FC]'
                }`}
                placeholder="Nhập mật khẩu của bạn"
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
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#27B5FC] hover:text-[#098be4] hover:underline font-medium transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Resend verification email */}
          {showResendEmail && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800 mb-3">
                Email của bạn chưa được xác nhận. Vui lòng kiểm tra email và xác nhận tài khoản trước khi đăng nhập.
              </p>
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi lại email xác nhận"
                )}
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#27B5FC] to-[#098be4] text-white rounded-xl hover:from-[#098be4] hover:to-[#27B5FC] focus:outline-none focus:ring-2 focus:ring-[#27B5FC] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Social login options */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
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
        </div> */}
      </div>
    </Modal>
  );
};

export default SignInModal;
