import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";

const Header = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/sign-in";
    };

    return (
        <header className="w-full bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="font-bold text-xl text-indigo-600">eLearning</Link>
                <nav className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link to="/sign-in" className="px-4 py-2 text-indigo-600 font-medium">Đăng nhập</Link>
                            <Link to="/sign-up" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Đăng ký</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-700">Xin chào, {user.firstName || user.email}</span>
                            <button onClick={handleLogout} className="px-4 py-2 border rounded-md">Đăng xuất</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;


