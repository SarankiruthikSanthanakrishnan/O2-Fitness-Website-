import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";

const db = getFirestore(app);

const YouTube = () => {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);

  // ✅ Fetch videos in real-time
  useEffect(() => {
    const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setVideos(data);
    });

    return () => unsub();
  }, []);

  // ✅ Extract Video ID from any YouTube URL
  const getVideoId = (url) => {
    try {
      if (!url) return null;
      const shortRegex = /youtu\.be\/([^?]+)/;
      const normalRegex = /v=([^&]+)/;
      const shortsRegex = /shorts\/([^?]+)/;
      const embedRegex = /embed\/([^?]+)/;

      if (shortRegex.test(url)) return url.match(shortRegex)[1];
      if (normalRegex.test(url)) return url.match(normalRegex)[1];
      if (shortsRegex.test(url)) return url.match(shortsRegex)[1];
      if (embedRegex.test(url)) return url.match(embedRegex)[1];
      return null;
    } catch {
      return null;
    }
  };

  // ✅ Convert to Embed Format
  const convertToEmbed = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // ✅ Add or Update Video
  const handleSaveVideo = async () => {
    const embedLink = convertToEmbed(newLink);
    if (!embedLink) {
      alert("❌ Please enter a valid YouTube link.");
      return;
    }

    try {
      if (editingVideo) {
        const ref = doc(db, "youtubeVideos", editingVideo.id);
        await updateDoc(ref, {
          link: embedLink,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, "youtubeVideos"), {
          link: embedLink,
          createdAt: Timestamp.now(),
        });
      }

      setNewLink("");
      setEditingVideo(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving video:", err);
    }
  };

  // ✅ Delete Video
  const handleDeleteVideo = async (id) => {
    try {
      await deleteDoc(doc(db, "youtubeVideos", id));
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  return (
    <section className="p-6 overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Manage YouTube Videos</h2>

      <button
        onClick={() => {
          setEditingVideo(null);
          setNewLink("");
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        + Add Video
      </button>

      {/* Video Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow rounded-lg overflow-hidden border p-3"
          >
            <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={video.link}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  setEditingVideo(video);
                  setNewLink(video.link);
                  setShowModal(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingVideo ? "Edit Video Link" : "Add YouTube Video"}
            </h3>
            <input
              type="text"
              placeholder="Paste YouTube or Shorts link here"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVideo}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingVideo ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default YouTube;
