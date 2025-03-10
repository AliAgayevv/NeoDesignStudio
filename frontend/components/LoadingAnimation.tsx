import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="mt-4 text-center">
      <motion.div
        className="spinner-border inline-block w-16 h-16 border-4 border-t-4 border-white rounded-full"
        role="status"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4">Loading...</p>
    </div>
  );
};

export default LoadingAnimation;
