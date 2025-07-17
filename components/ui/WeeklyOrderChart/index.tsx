import React, { useState } from "react";

const WeeklyOrdersChart = ({ weekData, dailyTarget }: { weekData: any; dailyTarget: number }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const chartHeight = 180;

  const getBarHeightPercentage = (value: number) => {
    return (value / dailyTarget) * 100;
  };

  const getTotalOrders = (day: any) => {
    return day.drink + day.food + day.other;
  };

  const handleMouseEnter = (index: number, event: React.MouseEvent) => {
    setHoveredBar(index);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
  };

  const Tooltip = ({ day, index }: { day: any; index: number }) => {
    if (hoveredBar !== index) return null;

    const total = getTotalOrders(day);
    const drinkPercent = getBarHeightPercentage(day.drink);
    const foodPercent = getBarHeightPercentage(day.food);
    const otherPercent = getBarHeightPercentage(day.other);
    const targetProgress = ((total / dailyTarget) * 100).toFixed(1);

    return (
      <div
        className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
        style={{
          left: mousePosition.x,
          top: mousePosition.y - 10,
        }}
      >
        <div className="text-sm font-semibold mb-2">Day {day.day}</div>

        {/* Progress info at the top */}
        <div className="space-y-1 text-xs mb-3 bg-gray-600 p-2 rounded">
          <div className="flex items-center justify-between gap-4">
            <span>Remaining:</span>
            <span className={Math.max(0, dailyTarget - total) > 0 ? "text-red-300" : "text-green-300"}>
              {Math.max(0, dailyTarget - total) > 0 ? Math.max(0, dailyTarget - total) : "Achieved!"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Target:</span>
            <span>{dailyTarget}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Target Progress:</span>
            <span className={`font-medium ${total >= dailyTarget ? "text-green-300" : "text-yellow-300"}`}>
              {targetProgress}%
            </span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Drink:</span>
            </div>
            <div className="text-right">
              <span className="font-medium">{day.drink}</span>
              <span className="text-gray-300 ml-1">({drinkPercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-700 rounded-full"></div>
              <span>Food:</span>
            </div>
            <div className="text-right">
              <span className="font-medium">{day.food}</span>
              <span className="text-gray-300 ml-1">({foodPercent.toFixed(1)}%)</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Other:</span>
            </div>
            <div className="text-right">
              <span className="font-medium">{day.other}</span>
              <span className="text-gray-300 ml-1">({otherPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayData = weekData;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 h-full flex flex-col justify-between">
      <div className="flex items-end justify-between gap-4">
        {displayData.map((day: any, index: number) => {
          const total = getTotalOrders(day);
          const drinkPercent = getBarHeightPercentage(day.drink);
          const foodPercent = getBarHeightPercentage(day.food);
          const otherPercent = getBarHeightPercentage(day.other);

          return (
            <div key={day.day} className="flex flex-col items-center">
              {/* Bar stack */}
              <div
                className="relative flex flex-col rounded-lg overflow-hidden w-16 shadow-sm bg-gray-300 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 h-full"
                style={{ height: `${chartHeight}px` }}
                onMouseEnter={(e) => handleMouseEnter(index, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Remaining space (Gray) - Top */}
                <div
                  className="bg-gray-300 flex-1"
                  style={{
                    height: `${Math.max(0, 100 - (total / dailyTarget) * 100)}%`,
                  }}
                ></div>

                {/* Other (Blue) - Top of filled section */}
                {day.other > 0 && (
                  <div
                    className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium relative hover:bg-blue-600 transition-colors"
                    style={{ height: `${otherPercent}%` }}
                  >
                    {otherPercent > 15 && (
                      <span className="absolute inset-0 flex items-center justify-center">{day.other}</span>
                    )}
                  </div>
                )}

                {/* Food (Dark Green) - Middle of filled section */}
                {day.food > 0 && (
                  <div
                    className="bg-green-700 flex items-center justify-center text-white text-sm font-medium relative hover:bg-green-800 transition-colors"
                    style={{ height: `${foodPercent}%` }}
                  >
                    {foodPercent > 15 && (
                      <span className="absolute inset-0 flex items-center justify-center">{day.food}</span>
                    )}
                  </div>
                )}

                {/* Drink (Orange) - Bottom of filled section */}
                {day.drink > 0 && (
                  <div
                    className="bg-orange-400 flex items-center justify-center text-white text-sm font-medium relative hover:bg-orange-500 transition-colors"
                    style={{ height: `${drinkPercent}%` }}
                  >
                    {drinkPercent > 15 && (
                      <span className="absolute inset-0 flex items-center justify-center">{day.drink}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Day label */}
              <div className="mt-2 text-xs text-gray-500 font-medium truncate w-full text-center">Day {day.day}</div>

              {/* Progress indicator */}
              <div className="mt-1 text-xs text-gray-400 truncate">
                {total}/{dailyTarget}
              </div>

              {/* Tooltip */}
              <Tooltip day={day} index={index} />
            </div>
          );
        })}
      </div>

      {/* Legend and info - Fixed at bottom */}
      <div className="flex-shrink-0 px-4">
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-gray-700 font-medium">Drink</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-gray-700 font-medium">Food</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs text-gray-700 font-medium">Other</span>
          </div>
        </div>

        {/* Target info */}
        <div className="text-center">
          <div className="text-xs text-gray-600 font-medium">
            Daily Target: <span className="text-blue-600 font-semibold">{dailyTarget}</span> products
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Weekly Total: {displayData.reduce((sum: number, day: any) => sum + day.drink + day.food + day.other, 0)} /{" "}
            {dailyTarget * 7}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOrdersChart;
