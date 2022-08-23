import { Dispatch, SetStateAction } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import { serverUploadImage } from '../../../../constants'

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
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)

        fetch(serverUploadImage, {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(result => {
            console.log(result)
            resolve(result.data.path)
          })
          .catch(error => {
            reject('Upload failed')
            console.error('Error:', error)
          })
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
