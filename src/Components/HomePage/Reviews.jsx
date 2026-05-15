import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(video.link);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-xl overflow-hidden shadow-lg bg-black relative h-[444px] cursor-pointer group w-full"
      onClick={() => setIsPlaying(true)}
    >
      {isPlaying && videoId ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="Customer Review"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              Invalid Video
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const Reviews = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setVideos(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <motion.div
        className="w-full px-4 md:px-8 text-center relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Some of Our <span className="text-orange-500">Highlights</span>
        </h2>
        
        {videos.length <= 5 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="relative px-2 sm:px-8">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              spaceBetween={20}
              breakpoints={{
                0: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="pb-10"
            >
              {videos.map((video) => (
                <SwiperSlide key={video.id}>
                  <VideoCard video={video} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Reviews;
