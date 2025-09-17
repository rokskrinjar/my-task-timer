import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const CountdownOverlay = ({ isVisible, onComplete }: CountdownOverlayProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isVisible) return;
    
    setCount(3);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay after showing 1
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-8xl font-bold text-white"
          >
            {count}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};