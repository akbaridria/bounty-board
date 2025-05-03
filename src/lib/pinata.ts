import { config } from "@/config";

export async function uploadFileToIPFS(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${config.API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getFileFromIPFS(cid: string) {
  try {
    const response = await fetch(`${config.API_URL}/files/${cid}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw error;
  }
}
