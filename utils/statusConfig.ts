export const getStatusConfig = (status: string) => {
  const statusConfig = {
    preparing: {
      text: "Preparing",
      bgColor: "bg-warning-500",
      textColor: "text-white",
      dotColor: "bg-white"
    },
    ready: {
      text: "Ready",
      bgColor: "bg-info-500",
      textColor: "text-white",
      dotColor: "bg-white"
    },
    completed: {
      text: "Completed",
      bgColor: "bg-primary-500",
      textColor: "text-white",
      dotColor: "bg-white"
    },
    cancelled: {
      text: "Cancelled",
      bgColor: "bg-danger-500",
      textColor: "text-white",
      dotColor: "bg-white"
    }
  };
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.preparing;
};