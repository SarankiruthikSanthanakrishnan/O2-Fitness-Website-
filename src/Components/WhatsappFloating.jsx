import React from "react";

const WhatsappFloat = () => {
  return (
    <a
      href="https://wa.me/916380907315"
      className="fixed bottom-5 right-5 bg-green-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-10 h-10"
      />
    </a>
  );
};

export default WhatsappFloat;
