import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db, storage } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PencilIcon } from "@heroicons/react/24/solid"; // ✅ Tailwind Hero Icon

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    photoURL: "",
    email: ""
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fullData = {
            name: data.name || "",
            phone: data.phone || "",
            photoURL: data.photoURL || "",
            email: user.email,
          };
          setFormData(fullData);
          setInitialState(fullData); // store original
          setPhotoPreview(data.photoURL || "");
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    if (initialState) {
      setFormData(initialState);
      setPhotoFile(null);
      setPhotoPreview(initialState.photoURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let photoURL = formData.photoURL;

    try {
      if (photoFile) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        photoURL,
      });

      alert("✅ Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Profile Photo with Pencil Icon */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Photo
              </div>
            )}

            {/* Pencil Icon Overlay */}
            <div
              onClick={handleImageClick}
              className="absolute bottom-1 right-1 bg-white rounded-full p-1 cursor-pointer shadow"
              title="Change Photo"
            >
              <PencilIcon className="w-5 h-5 text-gray-600" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
