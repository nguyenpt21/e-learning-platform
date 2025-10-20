"use client";

import { useState, useRef } from "react";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: {
      url: "",
      public_id: "",
    },
    major: "",
    biography: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Tách riêng thông báo từng tab
  const [profileMessage, setProfileMessage] = useState(null);
  const [securityMessage, setSecurityMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const fileInputRef = useRef(null);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setIsPreviewing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    setProfile((prev) => ({
      ...prev,
      profilePicture: {
        ...prev.profilePicture,
        url: previewImage,
      },
    }));
    setIsPreviewing(false);
    setProfileMessage({
      type: "success",
      text: "Ảnh đại diện đã được cập nhật!",
    });
  };

  const handleCancelImage = () => {
    setPreviewImage("");
    setIsPreviewing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (profile.password !== profile.confirmPassword) {
      setSecurityMessage({ type: "error", text: "Mật khẩu không khớp" });
      return;
    }
    setSecurityMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
    setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này vĩnh viễn? Hành động này không thể hoàn tác."
    );
    if (!confirmDelete) return;
    setDeleteMessage({
      type: "success",
      text: "Tài khoản đã được xóa thành công.",
    });
  };

  // --- JSX ---
  return (
    <div className="py-10 container mx-auto bg-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-58 border border-gray-200 bg-white">
          <div className="py-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl font-bold mb-4 overflow-hidden">
                {profile.profilePicture.url ? (
                  <img
                    src={profile.profilePicture.url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : profile.firstName ? (
                  profile.firstName[0].toUpperCase()
                ) : (
                  "W"
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.firstName || "Wyn"}
              </h2>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#f0f4ff] text-[#098be4] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Hồ sơ
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                  activeTab === "security"
                    ? "bg-[#f0f4ff] text-[#098be4] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Bảo mật tài khoản
              </button>

              <button
                onClick={() => setActiveTab("delete")}
                className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                  activeTab === "delete"
                    ? "bg-[#f0f4ff] text-[#098be4] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Xóa tài khoản
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="border-y border-r border-gray-200 min-h-screen">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div>
                <div className="border-b border-gray-200 py-6 text-center">
                  <h1 className="text-3xl font-semibold text-gray-900  ">
                    Hồ sơ cá nhân
                  </h1>
                  <p className="text-gray-600">
                    Thêm thông tin về bản thân bạn
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 px-14 py-6">
                  {/* Profile Picture */}
                  <div className="">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ảnh đại diện
                    </h3>
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                          {isPreviewing && previewImage ? (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : profile.profilePicture.url ? (
                            <img
                              src={profile.profilePicture.url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>

                      <div className="flex-1">
                        {isPreviewing ? (
                          <div>
                            <h4 className="text-base font-medium text-gray-900 mb-2">
                              Xem trước ảnh
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Nhấn "Lưu" để cập nhật ảnh đại diện hoặc "Hủy" để
                              chọn lại ảnh khác.
                            </p>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={handleSaveImage}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                              >
                                Lưu
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelImage}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-base font-medium text-gray-900 mb-2">
                              Tải lên ảnh mới
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Chọn một bức ảnh rõ nét của bạn. Kích thước đề
                              xuất: 400x400px hoặc lớn hơn.
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-[#098be4] hover:bg-[#007bbd] text-white font-medium rounded-lg"
                            >
                              Chọn ảnh
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          placeholder="Họ"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          placeholder="Tên"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <input
                        type="text"
                        name="major"
                        value={profile.major}
                        onChange={handleInputChange}
                        placeholder="Chuyên ngành"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Biography */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tiểu sử
                    </h3>
                    <textarea
                      name="biography"
                      value={profile.biography}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Tiểu sử của bạn..."
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  {/* Profile Message */}
                  {profileMessage && (
                    <div
                      className={`p-4 rounded-lg ${
                        profileMessage.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {profileMessage.text}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-[#098be4] hover:bg-[#007bbd] text-white font-medium rounded-lg disabled:opacity-50"
                    >
                      {isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div>
                <div className="border-b border-gray-200 py-6 text-center">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Bảo mật
                  </h1>
                  <p className="text-gray-600">Thay đổi mật khẩu tại đây.</p>
                </div>

                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-8 px-14 py-6"
                >
                  <div>
                    <label className="block font-semibold text-gray-900 mb-3">
                      Email:
                    </label>

                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg  text-gray-700">
                      Địa chỉ email hiện tại:{" "}
                      <span className="font-medium text-gray-900">
                        {"user123@gmail.com"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block  font-semibold text-gray-900 mb-3">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={profile.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block  font-semibold text-gray-900 mb-3">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Security Message */}
                  {securityMessage && (
                    <div
                      className={`p-4 rounded-lg ${
                        securityMessage.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {securityMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#098be4] hover:bg-[#007bbd] text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? "Đang đổi..." : "Thay đổi mật khẩu"}
                  </button>
                </form>
              </div>
            )}

            {/* DELETE TAB */}
            {activeTab === "delete" && (
              <div>
                <div className="border-b border-gray-200 py-6 text-center">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Xóa tài khoản
                  </h1>
                  <p className="text-gray-600">
                    Hành động này sẽ xóa toàn bộ dữ liệu tài khoản của bạn vĩnh
                    viễn. Không thể hoàn tác.
                  </p>
                </div>

                <div className="px-14 py-6">
                  <p className="mb-6 text-red-700 font-medium">
                    Cảnh báo: Sau khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị
                    mất vĩnh viễn.
                  </p>

                  {/* {deleteMessage && (
                    <div
                      className={`p-4 rounded-lg ${
                        deleteMessage.type === "success"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}
                    >
                      {deleteMessage.text}
                    </div>
                  )} */}

                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="px-6 py-3  bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? "Đang xóa..." : "Xóa tài khoản"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
