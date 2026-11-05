export const getGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const formatPrice = (price: number | string): string =>
  `Rs ${Number(price).toLocaleString()}`;

export const formatNumber = (value: number | string): string =>
  Number(value).toLocaleString();
