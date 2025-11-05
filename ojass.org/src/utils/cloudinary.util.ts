import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import { v4 as uuid } from "uuid";

// Configure Cloudinary
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ---------- Interfaces ----------

export interface FileObject {
  buffer: Buffer;
  mimetype: string;
  originalname?: string;
  name?: string;
}

// ✅ fixed: match Cloudinary's expected resource_type type
export interface UploadOptions extends UploadApiOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
}

export interface UploadedFile {
  public_id: string;
  url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

// ---------- Helpers ----------

const getBase64 = (file: FileObject): string =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

/**
 * Upload files to Cloudinary
 * @param {Array} files - Array of file objects with buffer, mimetype, originalname
 * @param {Object} options - Upload options (folder, resource_type, etc.)
 * @returns {Promise<Array>} Array of upload results with public_id, url, and metadata
 */
export const uploadFilesToCloudinary = async (
  files: FileObject[] = [],
  options: UploadOptions = {}
): Promise<UploadedFile[]> => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables."
    );
  }

  const uploadPromises = files.map((file) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        resource_type: options.resource_type || "auto",
        public_id: uuid(),
        folder: options.folder || "ojass2026",
        ...options,
      };

      cloudinary.uploader.upload(
        getBase64(file),
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults: UploadedFile[] = results.map((result, index) => ({
      public_id: result.public_id,
      url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      original_filename:
        files[index]?.originalname || files[index]?.name || "unknown",
    }));

    return formattedResults;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    throw new Error("Error while uploading files to cloudinary: " + errorMessage);
  }
};

/**
 * Get file details from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} File details
 */
export const getFileDetailsFromCloudinary = async (
  publicId: string,
  options: Record<string, any> = {}
): Promise<UploadedFile> => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary is not configured");
    }

    const result = await cloudinary.api.resource(publicId, options);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      original_filename: result.public_id,
    };
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    throw new Error("Error fetching file details from cloudinary: " + errorMessage);
  }
};

export interface DeleteResult {
  public_id: string;
  result: string | null;
}

/**
 * Delete files from Cloudinary
 * @param {string|string[]|{public_id?:string}[]} public_ids - Single ID, array, or array of objects
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteFilesFromCloudinary = async (
  public_ids: string | string[] | { public_id?: string }[]
): Promise<DeleteResult[]> => {
  try {
    if (!public_ids) return [];

    const idsArray = Array.isArray(public_ids) ? public_ids : [public_ids];
    const normalized = idsArray
      .map((item) =>
        typeof item === "string" ? item : item?.public_id ? item.public_id : null
      )
      .filter(Boolean) as string[];

    if (normalized.length === 0) return [];

    const response = await cloudinary.api.delete_resources(normalized);

    const results = normalized.map((id) => ({
      public_id: id,
      result:
        response.deleted && Object.prototype.hasOwnProperty.call(response.deleted, id)
          ? response.deleted[id]
          : (response as any)[id] || null,
    }));

    return results;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    throw new Error("Error while deleting files from cloudinary: " + errorMessage);
  }
};
