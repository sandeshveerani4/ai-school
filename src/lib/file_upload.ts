export const fileUpload = async (image: any) => {
  const form = new FormData();
  form.append("upfile", image);
  const url = "/api/file_uploads/upload.php";
  const request = new Request(url, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  const data = await fetch(request);
  return await data.json();
};
