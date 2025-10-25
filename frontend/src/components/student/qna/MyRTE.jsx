import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import React from 'react'

function MyRichTextEditor({value, onChange}) {
  // Chỉnh hàm handleImageUpload() trong tiptap-utils.js để hoàn tất xử lý ảnh
  return (
    <div className='w-full'>
        <SimpleEditor value={value} onChange={onChange}/>
    </div>
    
  )
}

export default MyRichTextEditor