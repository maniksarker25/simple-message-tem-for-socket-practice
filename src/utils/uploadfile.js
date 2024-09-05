export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("start upload");
  formData.append("upload_preset", "chat-app-file");

  try {
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_CLOUD_URL}`, {
      method: "POST",
      body: formData,
    });

    console.log("end upload");

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
