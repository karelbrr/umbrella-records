const generateChartConfig = (data: any[]) => {
  if (!data || data.length === 0) return {};

  const keys = Object.keys(data[0]).filter(
    (key) => key !== "date" && key !== "name",
  );

  const config: any = {};
  const colors = [
    "hsl(270 70% 60%)",
    "hsl(180 70% 50%)",
    "hsl(150 70% 50%)",
    "hsl(30 80% 60%)",
  ];

  keys.forEach((key, index) => {
    config[key] = {
      label: key.replace(/([A-Z])/g, " $1").trim(),
      color: colors[index % colors.length],
    };
  });

  return config;
};
