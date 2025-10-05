import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import Button from "./Button.jsx";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropDown, setOpenDropDown] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/sign-in";
  };

  const handleSearch = () => {};
  const handleBussiness = () => {};
  const handleTeaching = () => {};
  const handleCart = () => {};
  
  const handleOpenSignIn = () => {
    setIsSignInModalOpen(true);
  };
  
  const handleOpenSignUp = () => {
    setIsSignUpModalOpen(true);
  };
  
  const handleCloseSignIn = () => {
    setIsSignInModalOpen(false);
  };
  
  const handleCloseSignUp = () => {
    setIsSignUpModalOpen(false);
  };
  
  const handleSwitchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  return (
    <header className="sticky top-0 w-full shadow-lg bg-white z-50">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src={"https://placehold.co/120x30"} alt="Logo" />
          </Link>
          <Button
            variant="default"
            className="h-full text-sm relative"
            onMouseEnter={() => setOpenDropDown(true)}
            onMouseLeave={() => setOpenDropDown(false)}
          >
            <a href="#">Khám Phá</a>
            {openDropDown && (
              <div className="absolute top-full left-0 mt-4 border border-gray-300 w-48 h-60 bg-white rounded-lg shadow-lg p-2 z-10"></div>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 mx-2 max-w-2xl">
          <div className="flex items-center border-2 border-gray-300 rounded-full px-3 py-2 focus-within:border-[#098be4]">
            <Search
              className="text-gray-500 rounded p-1 cursor-pointer hover:text-[#098be4] hover:bg-[#cee8fb]"
              onClick={handleSearch}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bất kì thứ gì..."
              className="flex-1 px-2 outline-none text-sm"
              onKeyDown={(e) => {
                e.key === "Enter" && handleSearch();
              }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 text-sm">
          <Button
            variant="default"
            className="text-sm"
            onClick={handleBussiness}
          >
            <a href="#" title="Khám Phá NewZLearn">
              NewZLearn Doanh nghiệp
            </a>
          </Button>
          <Button
            variant="default"
            className="text-sm"
            onClick={handleTeaching}
          >
            <a href="#" title="Khám Phá NewZLearn">
              Dạy học cùng NewZLearn
            </a>
          </Button>

          <Button variant="default" className="text-sm" onClick={handleCart}>
            <ShoppingCart className="text-lg cursor-pointer" />
          </Button>
          {!user ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-sm w-28"
                onClick={handleOpenSignIn}
              >
                Đăng nhập
              </Button>
              <Button
                variant="reverse"
                className="text-sm w-28"
                onClick={handleOpenSignUp}
              >
                Đăng ký
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Xin chào, {user.firstName || user.email}</span>
              <Button 
                variant="default" 
                className="rounded-full w-8 h-8 border-1 border-[#098be4]"
                onClick={handleLogout}
              >
                <img src={"https://placehold.co/16x16"} alt="User Avatar" className="w-8 h-8 rounded-full"/>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={handleCloseSignIn}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen}
        onClose={handleCloseSignUp}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </header>
  );
}

