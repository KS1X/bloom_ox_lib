import { AnimatePresence, motion } from 'framer-motion';

const ScaleFade: React.FC<{
  visible: boolean;
  children: React.ReactNode;
  onExitComplete?: () => void;
}> = ({ visible, children, onExitComplete }) => {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1], // "ease" — smooth, not springy
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
            transition: {
              duration: 0.12,
              ease: [0.4, 0, 1, 1], // Ease-in for exit
            },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScaleFade;
