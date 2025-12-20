import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor";

const ArticleEditor = ({ content, setContent }) => {
   
    const quillRef = useRef(null);

    const modules = {
        toolbar: {
            container: [
                [{ header: [4, 5, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: function () {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.click();

                    input.onchange = async () => {
                        const file = input.files[0];
                        if (file) {
                            const base64 = await fileToBase64(file);
                            const range = this.quill.getSelection();
                            this.quill.insertEmbed(range.index, "image", base64);
                        }
                    };
                },
            },
        },
    };

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    return (
        <div className="">
            <SimpleEditor value={content} onChange={setContent} placeholder={"Nhập bài giảng"} mention={null}></SimpleEditor>
        </div>
    );
};

export default ArticleEditor;
