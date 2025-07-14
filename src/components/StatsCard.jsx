import React from 'react';

function StatsCard({ title, value, description, icon, color }) {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-full ${getColorClasses()}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-bold text-gray-900">{value}</div>
                <p className="text-sm text-gray-500">{description}</p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;