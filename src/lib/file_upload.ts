export const fileUpload = async (image: any) => {
  if (image) {
    const form = new FormData();
    form.append("upfile", image);
    const url = "/api/file_uploads/upload.php";
    const request = new Request(url, {
      method: "POST",
      body: form,
    });
    try {
      const data = await fetch(request);
      return { filename: (await data.json()).filename };
    } catch {}
  }
};
