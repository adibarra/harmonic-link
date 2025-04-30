import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";

export default function UnknownCard() {
  const blinkLoop = {
    animate: { opacity: [.8, 0.5, .8] },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
    style: { willChange: "opacity" },
  };

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div {...fadeInOut}>
      <Card className="w-[192px] h-[218px] p-4 pb-6">
        <CardContent className="flex flex-col items-center text-center text-sm p-0">
          <div className="flex items-center justify-center w-[128px] h-[128px] bg-white/5">
            <motion.div
              className="text-6xl text-gray-500"
              {...blinkLoop}
            >
              ?
            </motion.div>
          </div>
          <div className="mt-2 text-base text-gray-500 w-full">Select an album or artist below</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
