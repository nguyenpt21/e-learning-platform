import Button from "@/components/Button";
import { useSolveTheQnAMutation } from "@/redux/api/qnaSlice";
import { CircleCheck } from "lucide-react";
import React from "react";

function SolveQnAButton({quesId, commentId}) {
    const [solveTheQnA] = useSolveTheQnAMutation()
    const handleSolve = async() =>{
        try {
            await solveTheQnA({qnaId: quesId, body: {commentId}})
        } catch (error) {
            console.log("Lỗi khi đánh dấu câu trả lời: ", error)
        }
    }
  return (
    <Button variant="reverse" className="flex items-center space-x-2" onClick={handleSolve}>
      <CircleCheck className="w-4 h-4"/>
      <p>Đánh dấu là câu trả lời</p>
    </Button>
  );
}

export default SolveQnAButton;
