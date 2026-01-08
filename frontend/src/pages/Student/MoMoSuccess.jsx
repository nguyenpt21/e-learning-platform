import Button from "@/components/Button";
import { Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function MomoSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courseAlias } = useParams();

  const resultCode = searchParams.get("resultCode");
  const messageParam = searchParams.get("message");

  const hasRun = useRef(false);
  const [message, setMessage] = useState("Vui lòng chờ...");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (resultCode === "0") {
      setMessage("Thanh toán MoMo thành công!");
      setLink(`/course/${courseAlias}`);
    } else {
      setMessage(
        messageParam
          ? decodeURIComponent(messageParam)
          : "Thanh toán MoMo thất bại hoặc đã bị hủy."
      );
      setLink(`/course/${courseAlias}/payment`);
    }
  }, [resultCode, messageParam, courseAlias]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {message.startsWith("Vui lòng chờ") ? (
        <img src="/loadingGIF.gif" alt="loading" className="w-[256px]" />
      ) : resultCode === "0" ? (
        <img src="/successGIF.gif" alt="success" className="w-[720px]" />
      ) : (
        <img src="/errorGIF.gif" alt="error" className="w-[720px]" />
      )}

      <h2 className="text-2xl font-semibold mb-3">{message}</h2>

      <Button
        variant="reverse"
        className={`flex gap-2 px-4 py-2 ${
          message.startsWith("Vui lòng chờ") ? "hidden" : ""
        }`}
        onClick={() => navigate(link)}
      >
        <Undo2 />
        {resultCode === "0"
          ? "Quay lại trang khóa học"
          : "Quay lại trang thanh toán"}
      </Button>
    </div>
  );
}

export default MomoSuccess;
