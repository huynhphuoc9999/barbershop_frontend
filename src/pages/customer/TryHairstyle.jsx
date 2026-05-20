import { useState } from "react";
import { tryHairstyle } from "../../services/hairstyleServices";

const hairstyles = [
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style4_cqalvb.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style9_ldcrk4.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style1_tbwacc.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style8_bbhytn.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style2_roxwpo.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style7_ijh3ew.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528406/style11_um6qjq.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528407/style10_ipovfb.png",
  "https://res.cloudinary.com/ddacxaajy/image/upload/v1775528407/style12_qf6ani.png",
];

export default function TryHairstyle() {
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);

  // ===== Upload user image =====
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImageFile(file);
      setUserImagePreview(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
    }
  };

  // ===== Select hairstyle =====
  const selectHair = (src) => {
    setSelectedHairstyle(src);
    setResultImage(null);
    setError(null);
  };

  // ===== Try hairstyle with AI =====
  const handleTryHairstyle = async () => {
    if (!userImageFile || !selectedHairstyle) {
      setError("Please upload your photo and select a hairstyle");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await tryHairstyle(userImageFile, selectedHairstyle);
      
      if (response.data.statusCode === 200) {
        setResultImage(response.data.data.outputUrl);
      } else {
        setError(response.data.message || "Failed to apply hairstyle");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Reset and try again =====
  const handleReset = () => {
    setUserImageFile(null);
    setUserImagePreview(null);
    setSelectedHairstyle(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Result View */}
        {resultImage ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
                ✨ Your New Look!
              </h2>
              <p className="text-zinc-400">AI-generated hairstyle preview</p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-yellow-500/20">
              <img
                src={resultImage}
                alt="Result"
                className="w-full max-w-2xl mx-auto rounded-xl"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-full
                  hover:bg-yellow-300 transition transform hover:scale-105"
              >
                ↺ Try Again
              </button>
              <a
                href={resultImage}
                download="my-hairstyle.jpg"
                className="px-8 py-3 bg-zinc-700 text-white font-bold rounded-full
                  hover:bg-zinc-600 transition transform hover:scale-105"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        ) : (
          /* Main Form */
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT PANEL */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-yellow-500/20">
              <h2 className="text-2xl font-extrabold text-yellow-400 mb-6 tracking-wide">
                💈 TRY HAIRSTYLE AI
              </h2>

              {/* Upload */}
              <div className="mb-6">
                <label className="block mb-2">
                  <span className="text-sm text-zinc-400">
                    Upload your photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="mt-2 block w-full text-sm
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:bg-yellow-400 file:text-black
                      hover:file:bg-yellow-300 cursor-pointer"
                  />
                </label>

                {/* Preview uploaded image */}
                {userImagePreview && (
                  <div className="mt-4 p-3 bg-zinc-800 rounded-xl border border-yellow-500/20">
                    <img
                      src={userImagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Hairstyles */}
              <div>
                <p className="text-sm text-zinc-400 mb-3">Choose hairstyle</p>
                <div className="grid grid-cols-3 gap-3">
                  {hairstyles.map((hair) => (
                    <div
                      key={hair}
                      className={`bg-zinc-800 rounded-xl p-2 border transition cursor-pointer
                        ${
                          selectedHairstyle === hair
                            ? "border-yellow-400 ring-2 ring-yellow-400"
                            : "border-transparent hover:border-yellow-400"
                        }`}
                      onClick={() => selectHair(hair)}
                    >
                      <img
                        src={hair}
                        alt=""
                        className="w-full h-20 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Try It Button */}
              <button
                onClick={handleTryHairstyle}
                disabled={loading || !userImageFile || !selectedHairstyle}
                className="mt-6 w-full py-3 bg-yellow-400 text-black font-bold rounded-full
                  hover:bg-yellow-300 transition transform hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing... (may take 15-30s)
                  </span>
                ) : (
                  "✨ Try This Hairstyle"
                )}
              </button>
            </div>

            {/* RIGHT PANEL - Info */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-yellow-500/20">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">
                    🤖 How it works
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">1.</span>
                      <span>Upload a clear photo of your face</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">2.</span>
                      <span>Select your desired hairstyle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">3.</span>
                      <span>Click "Try This Hairstyle" and wait</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">4.</span>
                      <span>AI will generate a realistic preview</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <h4 className="font-semibold text-yellow-400 mb-2">
                    💡 Tips for best results
                  </h4>
                  <ul className="space-y-1 text-sm text-zinc-300">
                    <li>• Use a front-facing photo</li>
                    <li>• Ensure good lighting</li>
                    <li>• Keep hair visible and unobstructed</li>
                    <li>• Be patient - AI processing takes time</li>
                  </ul>
                </div>

                {selectedHairstyle && (
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">
                      Selected Hairstyle:
                    </h4>
                    <div className="p-3 bg-zinc-800 rounded-xl border border-yellow-500/20">
                      <img
                        src={selectedHairstyle}
                        alt="Selected"
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
