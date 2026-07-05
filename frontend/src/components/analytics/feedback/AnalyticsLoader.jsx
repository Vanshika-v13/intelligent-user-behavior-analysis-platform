const AnalyticsLoader = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[300px]">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#FF6B35] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default AnalyticsLoader;
