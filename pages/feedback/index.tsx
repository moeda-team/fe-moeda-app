import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoArrowBack, IoCart } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import { BiCoffee } from "react-icons/bi";
import { useRouter } from "next/router";
import axios from "axios";
import { OUTLET_ID } from "@/services";
import { toast } from "react-toastify";

interface FeedbackScreenProps {}

const FeedbackScreen: React.FC<FeedbackScreenProps> = () => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedbackTags: string[] = [
    "I'm enjoy on this caffe",
    "I'm enjoy on this drinks",
    "I'm enjoy on this foods",
  ];

  const disableButton: boolean = (() => {
    if (rating === 0) return true;
    if (feedback === "" && selectedTags.length === 0) return true;
    return false;
  })();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStarClick = (starIndex: number): void => {
    setRating(starIndex);
  };

  const handleTagClick = (tag: string): void => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = async () => {
    // Handle form submission here
    try {
      const url = process.env.NEXT_PUBLIC_API + "/messages";
      const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
      const authPassword = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";

      const basicAuth = `Basic ${btoa(`${username}:${authPassword}`)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
        body: JSON.stringify({
          outletId: OUTLET_ID,
          message:
            feedback ||
            selectedTags.toString().replace("[", "").replace("]", ""),
          rating: rating,
        }),
      });

      const data = await response.json();

      if (data.data) {
        toast.success("Terkirim");
        router.push("/order");
      } else {
        toast.error("Gagal Terkirim");
        router.push("/order");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan" + error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50  overflow-hidden">
      {/* Background decoration */}
      <div className="bg-gradient-to-br from-gray-100/50 to-gray-200/50"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-primary-500 flex justify-between items-center p-6"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-2xl font-semibold mx-auto"
        >
          Feedback
        </motion.h1>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="z-10 bg-white mx-4 mt-8 rounded-t-3xl p-8"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Share your experience
          </h2>
          <p className="text-gray-600 text-lg">How is your experience?</p>
        </motion.div>

        {/* Star Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mb-12"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-4xl transition-colors duration-200"
            >
              {star <= (hoverRating || rating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-gray-300" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Feedback Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {feedbackTags.map((tag, index) => (
            <motion.label
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-primary-500 border-primary-500 text-white"
                  : "bg-neutral-50 border-gray-200 text-gray-600"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagClick(tag)}
                className="hidden"
              />
              <BiCoffee className="text-lg" />
              <span className="font-medium">{tag}</span>
            </motion.label>
          ))}
        </motion.div>

        {/* Text Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <textarea
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFeedback(e.target.value)
            }
            placeholder="Write feedback here"
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-teal-500 focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400"
          />
        </motion.div>

        {/* Bottom Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg">
            Back to home in{" "}
            <span className="font-semibold text-gray-600">{countdown}</span> sec
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.button
          className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:bg-neutral-400"
          whileHover={{ scale: 1.02, backgroundColor: "#225049" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400 }}
          type="button"
          disabled={disableButton}
          onClick={handleSubmitFeedback}
        >
          <span>Submit</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FeedbackScreen;
