import React from "react";
import { CircleCheck, CircleQuestionMark } from "lucide-react";

function QuestionList({ list, handleQuestionClick }) {
  return (
    <div className="flex w-full flex-col gap-2 overflow-y-auto max-h-[500px]">
      {list?.map((ques) => {
        return (
          <div
            key={ques._id}
            className="w-full flex items-center gap-2 hover:text-[#098be4] hover:bg-[#cee8fb] p-2 rounded-md cursor-pointer"
            onClick={() => {
              handleQuestionClick(ques);
            }}
          >
            {!ques.isSolved ? (
              <CircleQuestionMark className="text-gray-500" />
            ) : (
              <CircleCheck className="text-green-500" />
            )}
            <p className="max-w-1/2 truncate">{ques.title}</p>
            <div className="text-sm text-white py-1 px-2 rounded bg-[#098be4]">
              {ques.type}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionList;
