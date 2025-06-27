import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const HalfRadialProgress = ({
  current = 0,
  max = 100,
  label,
  color,
}: {
  current: number;
  max: number;
  label: string;
  color: string;
}) => {
  const progress = current;
  const maxValue = max;
  const progressPercentage = (progress / maxValue) * 100;

  const size = 100;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;

  const arcDegrees = 250;
  const arcLength = (arcDegrees / 360) * 2 * Math.PI * radius;

  const dashOffset = useMotionValue(arcLength);
  const animatedValue = useMotionValue(0);

  // Animate values on mount or update
  React.useEffect(() => {
    animate(dashOffset, arcLength - (progressPercentage / 100) * arcLength, {
      duration: 1,
      ease: "easeInOut",
    });

    animate(animatedValue, current, {
      duration: 1,
      ease: "easeInOut",
    });
  }, [current, progressPercentage, arcLength, dashOffset, animatedValue]);

  const animatedNumber = useTransform(animatedValue, Math.round);

  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-gray-50 rounded-md h-full w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="text-gray-900 mb-2 text-left w-full text-xs font-medium">
        {label}
      </h4>

      <div className="relative">
        <div className="relative transform rotate-[145deg]">
          <svg width={size} height={size}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
            />

            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${2 * Math.PI * radius}`}
              strokeDashoffset={dashOffset}
            />
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-xl font-bold text-gray-900">
            {animatedNumber}
          </motion.span>
        </div>

        <div className="flex justify-between items-center px-4 -mt-4">
          <span className="text-sm font-medium text-gray-600">0</span>
          <span className="text-sm font-medium text-gray-600">{max}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HalfRadialProgress;
