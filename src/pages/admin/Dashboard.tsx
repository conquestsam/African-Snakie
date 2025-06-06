import React from 'react';
import { Users, ShoppingBag, Package, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // These would be fetched from an API in a real application
  const stats = [
    { title: 'Total Orders', value: '158', icon: <Package className="h-8 w-8" />, color: 'bg-blue-100 text-blue-800' },
    { title: 'Total Products', value: '42', icon: <ShoppingBag className="h-8 w-8" />, color: 'bg-green-100 text-green-800' },
    { title: 'Total Customers', value: '254', icon: <Users className="h-8 w-8" />, color: 'bg-purple-100 text-purple-800' },
    { title: 'Total Revenue', value: '$12,845', icon: <CreditCard className="h-8 w-8" />, color: 'bg-orange-100 text-orange-800' },
  ];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`rounded-full p-3 mr-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: '1234', customer: 'John Doe', date: '2023-06-01', status: 'Delivered', total: '$125.00' },
                  { id: '1235', customer: 'Jane Smith', date: '2023-06-02', status: 'Processing', total: '$85.50' },
                  { id: '1236', customer: 'Mike Johnson', date: '2023-06-03', status: 'Pending', total: '$210.25' },
                  { id: '1237', customer: 'Sarah Williams', date: '2023-06-04', status: 'Shipped', total: '$65.00' },
                ].map((order, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Popular Products</h2>
            <Link to="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Nigerian Chin Chin', sales: 245, image: 'https://images.pexels.com/photos/15913452/pexels-photo-15913452/free-photo-of-nigerian-chin-chin.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
              { name: 'Ghanaian Plantain Chips', sales: 189, image: 'https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
              { name: 'Kenyan Mabuyu', sales: 156, image: 'https://images.pexels.com/photos/5718026/pexels-photo-5718026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
              { name: 'South African Biltong', sales: 132, image: 'https://images.pexels.com/photos/8365688/pexels-photo-8365688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            ].map((product, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-md object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-600 h-2.5 rounded-full"
                    style={{ width: `${(product.sales / 245) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;