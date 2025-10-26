import React from "react";

function QuestionDetail({ detail }) {
  return (
    <div className="flex w-full flex-col px-4 space-y-2">
      <div className="w-full flex items-center gap-2 p-2">
        <p className="text-lg font-semibold">{detail.title}</p>
        <div className="text-sm text-white py-1 px-2 rounded bg-[#098be4]">
          {detail.type}
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;
