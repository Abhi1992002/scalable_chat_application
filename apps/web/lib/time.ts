export function formatTime(seconds: number) {
  if (seconds < 60) {
    return seconds + " sec ago";
  } else if (seconds < 3600) {
    return Math.floor(seconds / 60) + " min ago";
  } else if (seconds < 86400) {
    return Math.floor(seconds / 3600) + " hr ago";
  } else if (seconds < 604800) {
    return Math.floor(seconds / 86400) + " day ago";
  } else if (seconds < 2592000) {
    return Math.floor(seconds / 604800) + " week ago";
  } else if (seconds < 31536000) {
    return Math.floor(seconds / 2592000) + " month ago";
  } else {
    return Math.floor(seconds / 31536000) + " year ago";
  }
}
