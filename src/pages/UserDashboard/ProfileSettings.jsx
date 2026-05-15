

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile({ name: "", email: user.email });
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { ...profile });
    setSaving(false);
    alert("Profile updated successfully!");
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile?.name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile?.email || ""}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile?.phone || ""}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            rows="3"
            value={profile?.address || ""}
            onChange={handleChange}
            placeholder="Your full address"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition ${
          saving ? "opacity-50 cursor-wait" : ""
        }`}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default ProfileSettings;
