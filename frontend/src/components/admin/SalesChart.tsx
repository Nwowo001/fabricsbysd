'use client';

export default function SalesChart() {
  // Placeholder for chart - you can integrate with Chart.js or Recharts later
  const mockData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 19000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 25000 },
    { month: 'May', sales: 22000 },
    { month: 'Jun', sales: 30000 },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
        
        <div className="space-y-3">
          {mockData.map((item, index) => (
            <div key={item.month} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.month}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(item.sales / 30000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ₦{item.sales.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Sales</span>
            <span className="font-medium text-gray-900">
              ₦{mockData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}