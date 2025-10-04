import { ShoppingCart, Search } from "lucide-react";
import Button from "./Button.jsx";
import { useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropDown, setOpenDropDown] = useState(false);
  const handleSearch = () => {};
  const handleBussiness = () => {};
  const handleTeaching = () => {};
  const handleCart = () => {};
  const handleLogIn = () => {};
  const handleSignUp = () => {};
  return (
    <header className="absolute top-0 left-0 w-full shadow-lg bg-white z-50">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src={"https://placehold.co/120x30"} alt="Logo" />
          <Button
            variant="default"
            className="h-full text-sm relative"
            onMouseEnter={() => setOpenDropDown(true)}
            onMouseLeave={() => setOpenDropDown(false)}
          >
            <a href="#">Khám Phá</a>
            {openDropDown && (
              <div className="absolute top-full left-0 mt-4 border border-1 border-gray-300 w-48 h-60 bg-white rounded-lg shadow-lg p-2 z-10"></div>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 mx-2 max-w-2xl">
          <div className="flex items-center border border-2 border-gray-300 rounded-full px-3 py-2 focus-within:border-[#098be4]">
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
          {!isAuthenticated ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-sm w-28"
                onClick={handleLogIn}
              >
                Đăng nhập
              </Button>
              <Button
                variant="reverse"
                className="text-sm w-28"
                onClick={handleSignUp}
              >
                Đăng ký
              </Button>
            </div>
          ) : (
            <Button variant="default" className="rounded-full w-8 h-8 border-1 border-[#098be4]">
                <img src={"https://placehold.co/16x16"} alt="User Avatar" className="w-8 h-8 rounded-full"/>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
