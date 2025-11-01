import { Outlet, useLocation, Link, useParams } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";
const CourseManageLayout = () => {
    const location = useLocation();
    const { courseId } = useParams();
    const MENU_ITEMS = [
        {
            title: "Đối tượng học viên",
            to: "goal",
        },
        {
            title: "Chương trình giảng dạy",
            to: "curriculum",
        },
        {
            title: "Thông tin khóa học",
            to: "basics",
        },
        {
            title: "Phụ đề",
            to: "captions",
        },
    ];
    return (
        <div>
            <div className="flex container mt-[60px] gap-[30px] px-4">
                <div className="w-[20%] py-5">
                    <p className="font-medium pl-5">Nội dung khóa học</p>
                    <nav className="mt-4 flex flex-col gap-1">
                        {MENU_ITEMS.map((item, index) => {
                            const isActive =
                                location.pathname.split("/").filter(Boolean).pop() === item.to;
                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className={`flex gap-3 items-center h-12 px-4 hover:bg-primary/5 ${
                                        isActive ? "bg-primary/5 border-l-3 border-primary" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            <FaRegCheckCircle />
                                        </div>
                                        <span className="font-light">{item.title}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                    <button className="mt-2 w-full py-2 font-semibold cursor-pointer text-center rounded bg-primary text-white">
                        Phát hành khóa học
                    </button>
                </div>
                <div className="flex-1 shadow-common min-h-[500px] rounded-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CourseManageLayout;
