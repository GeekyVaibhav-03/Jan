const Timeline = ({ log }) => {
  return (
    <div className="relative border-l-4 border-indigo-200 ml-3">
      {log.map((item, index) => (
        <div key={index} className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3.5 ring-8 ring-white">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          </span>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <time className="text-xs font-normal text-gray-400">
                {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
              </time>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
                {item.action}
              </span>
            </div>
            <p className="text-base font-normal text-gray-600">{item.remarks}</p>
            {item.updatedBy && (
              <p className="text-xs text-gray-400 mt-2 italic">Updated by: {item.updatedBy}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;