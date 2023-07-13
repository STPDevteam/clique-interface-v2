import { Dispatch, SetStateAction } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import { serverUploadImage } from '../../../../constants'
import { Axios } from 'utils/axios'

Quill.register('modules/imageUploader', ImageUploader)

const modules = {
  toolbar: [
    [{ size: [] }, 'bold', 'italic', 'underline', 'strike', { align: [] }],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }]
  ],
  imageUploader: {
    upload: (file: string | Blob) => {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
          const res = (await Axios.post(serverUploadImage, formData)) as any
          console.log(res)
          resolve(res.data.data)
        } catch (err) {
          reject('Upload failed')
          console.error('Error:', err)
        }
      })
    }
  }
}

export default function Editor({
  content,
  setContent
}: {
  content: string
  setContent: Dispatch<SetStateAction<string>>
}) {
  return <ReactQuill style={{ height: 320 }} modules={modules} theme="snow" value={content} onChange={setContent} />
}
