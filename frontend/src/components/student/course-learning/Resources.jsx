import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaRegFolderOpen } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { TbFileTypePdf, TbFileTypeDoc, TbFileTypePng } from "react-icons/tb";
import { LuFile } from "react-icons/lu";

const getFileIcon = (type) => {
    switch (type) {
        case 'pdf':
            return <TbFileTypePdf className="w-5 h-5 shrink-0" />;
        case 'doc':
        case 'docx':
            return <TbFileTypeDoc className="w-5 h-5 shrink-0" />;
        case 'image':
        case 'png':
        case 'jpg':
            return <TbFileTypePng className="w-5 h-5 shrink-0" />;
        default:
            return <LuFile className="w-5 h-5 shrink-0" />;
    }
};

function getFileTypeFromName(filename) {
    const parts = filename.split('.');
    if (parts.length > 1) {
        return parts[parts.length - 1].toLowerCase();
    }
    return ''; 
}

const Resources = ({ resources }) => {
    console.log(resources)

    const handleDownload = async (publicURL, fileName) => {
        try {
            const response = await fetch(publicURL);
            if (!response.ok) {
                throw new Error('Không thể tải file');
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Lỗi download:", error);
            window.open(publicURL, '_blank');
        }
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <p className='py-1 px-2 border border-blue-600 hover:bg-blue-100 rounded-sm text-sm flex items-center gap-1 text-blue-600'>
                        <FaRegFolderOpen className='text-base text-blue-600' /> Tài nguyên <IoIosArrowDown className='text-blue-600' />
                    </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="" side="bottom" align="start">
                    {resources?.map((item, id) => (
                        <DropdownMenuItem key={id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleDownload(item.publicURL, item.fileName)}
                                        key={id}
                                        className='flex items-center gap-1 cursor-pointer'
                                    >
                                        {getFileIcon(getFileTypeFromName(item.fileName))}
                                        <span className="text-xs font-medium text-gray-800 truncate">
                                            {item.fileName}
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="center">
                                    <p>Nhấn để tải xuống</p>
                                </TooltipContent>
                            </Tooltip>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Resources