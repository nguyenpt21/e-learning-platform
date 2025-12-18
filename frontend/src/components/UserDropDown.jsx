import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/redux/api/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/features/authSlice";
import { LogOut, User } from "lucide-react";

function UserDropDown() {
  const [logoutApi] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout thất bại, thử lại");
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          className="rounded-full w-8 h-8 border border-[#098be4]"
        >
          <img
            src={"https://placehold.co/16x16"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"max-w-md w-auto p-2"}>
        <Button className={"w-full flex gap-2 text-[0.9rem]"} onClick={()=>navigate("/student/profile")}>
            <User />
            Hồ sơ
        </Button>
        <Button className={"w-full flex gap-2 text-[0.9rem]"} onClick={handleLogout}>
            <LogOut />
            Đăng xuất
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default UserDropDown;
