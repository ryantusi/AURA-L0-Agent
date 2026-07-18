export const formatCurrentTimestamp = () => {
  const now = new Date();
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const monthName = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();
  
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${monthName} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
};
