// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export const getStatusBadge = (status: string, endedReason?: string) => {
//   const statusMap: Record<string, { color: string; text: string }> = {
//     ended: {
//       color:
//         endedReason === "customer-did-not-answer"
//           ? "bg-orange-100 text-orange-800"
//           : "bg-green-100 text-green-800",
//       text:
//         endedReason === "customer-did-not-answer" ? "No Answer" : "Completed",
//     },
//     failed: { color: "bg-red-100 text-red-800", text: "Failed" },
//     "in-progress": { color: "bg-blue-100 text-blue-800", text: "In Progress" },
//     queued: { color: "bg-yellow-100 text-yellow-800", text: "Queued" },
//     initiated: { color: "bg-purple-100 text-purple-800", text: "Initiated" },
//   };

//   return (
//     statusMap[status] || { color: "bg-gray-100 text-gray-800", text: status }
//   );
// };

// export const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// export const formatDuration = (startDate: string, endDate: string) => {
//   if (!startDate || !endDate) return "N/A";

//   const start = new Date(startDate).getTime();
//   const end = new Date(endDate).getTime();
//   const durationMs = end - start;

//   const seconds = Math.floor(durationMs / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;

//   return `${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
// };

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined) {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}
export function formatDuration(startDateString?: string, endDateString?: string) {
  if (!startDateString || !endDateString) return "N/A";

  const start = new Date(startDateString).getTime();
  const end = new Date(endDateString).getTime();
  
  // Calculate duration in seconds
  const durationInSeconds = Math.floor((end - start) / 1000);
  
  if (isNaN(durationInSeconds) || durationInSeconds < 0) {
    return "N/A";
  }
  
  // Format duration into mm:ss
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Get status badge configuration
export function getStatusBadge(status: string, endedReason?: string) {
  // Handle missed calls
  if (endedReason === "customer-did-not-answer") {
    return {
      text: "Missed",
      color: "text-destructive border-destructive",
    };
  }

  // Handle other statuses
  switch (status) {
    case "completed":
      return {
        text: "Completed",
        color: "text-green-600 border-green-600",
      };
    case "in-progress":
      return {
        text: "In Progress",
        color: "text-blue-600 border-blue-600",
      };
    case "queued":
      return {
        text: "Queued",
        color: "text-yellow-600 border-yellow-600",
      };
    case "failed":
      return {
        text: "Failed",
        color: "text-destructive border-destructive",
      };
    default:
      return {
        text: status || "Unknown",
        color: "text-muted-foreground border-muted-foreground",
      };
  }
}