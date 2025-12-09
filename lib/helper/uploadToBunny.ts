
//final upload to bunny
export const uploadFileToBunny = async (file: File, uploadUrl: string, accessKey: string): Promise<void> => {
  return await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      'Content-Type': file.type,
      AccessKey: accessKey
    },
    body: file
  }).then(response => {if(!response.ok) throw new Error('Upload failed')})
}
