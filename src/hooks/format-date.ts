export const formatDate = (
  isoString?: string | number | Date,
  variant: "basic" | "with_time" = "basic",
): string | undefined => {
  if (!isoString) return "";
  const date = new Date(isoString);

  if (variant === "basic") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month} ${year}`;
  } else if (variant === "with_time") {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}.${month} ${year} ${hours}:${minutes}`;
  }
};
