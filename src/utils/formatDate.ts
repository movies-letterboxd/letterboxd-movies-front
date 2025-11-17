export default function formatDate(iso: string) {
  const date = new Date(Date.parse(iso)); 

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}
