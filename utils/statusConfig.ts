export const getStatusConfig = (status: string) => {
  const statusConfig = {
    preparation: {
      text: "preparation",
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
      bgColor: "bg-success-500",
      textColor: "text-white",
      dotColor: "bg-white"
    },
    failed: {
      text: "Failed",
      bgColor: "bg-danger-500",
      textColor: "text-white",
      dotColor: "bg-white"
    }
  };
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.preparation;
};