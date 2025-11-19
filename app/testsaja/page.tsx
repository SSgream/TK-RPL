  "use client";

  import { useState } from "react";
  import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";

  export default function TestCloudinaryPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);
      setUploadedUrl(null);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
      if (!selectedFile) {
        setError("Pilih gambar terlebih dahulu");
        return;
      }

      try {
        setUploading(true);
        setError(null);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

        if (!cloudName || !preset) {
          setError("Env Cloudinary belum diisi dengan benar!");
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", preset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("Cloudinary error:", err);
          throw new Error("Upload gagal");
        }

        const data = await response.json();
        setUploadedUrl(data.secure_url);
        console.log("Upload success:", data.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Gagal upload ke Cloudinary. Cek console untuk detail.");
      } finally {
        setUploading(false);
      }
    };

    const handleReset = () => {
      setSelectedFile(null);
      setPreview(null);
      setUploadedUrl(null);
      setError(null);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Test Upload Cloudinary
          </h1>

          <div className="space-y-4">
            {!preview ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Pilih Gambar</p>
                <p className="text-gray-400 text-sm">atau drag & drop</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>
            )}

            {preview && !uploadedUrl && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload ke Cloudinary
                  </>
                )}
              </Button>
            )}

            {uploadedUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-800">Upload Berhasil!</p>
                </div>

                <div className="bg-white p-2 rounded border border-green-300 break-all text-sm">
                  <p className="text-gray-600 mb-1 font-medium">URL:</p>
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {uploadedUrl}
                  </a>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full mt-3">
                  Upload Lagi
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
