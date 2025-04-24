import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Social App</h1>
        </div>
        <nav className="mt-6">
          <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700">
            <span className="text-gray-800 dark:text-white font-medium">Dashboard</span>
          </div>
          <div className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Profile</span>
          </div>
          <div className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Messages</span>
          </div>
          <div className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Friends</span>
          </div>
          <div className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Settings</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Welcome Back, User!</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
              <Image 
                src="/next.svg" 
                alt="Profile" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Total Friends</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">248</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Messages</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">15</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Notifications</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">5</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
                  <div>
                    <p className="text-gray-800 dark:text-white font-medium">User {item} posted a new update</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 dark:text-blue-400 font-medium">View All</button>
        </div>

        {/* Friends Suggestions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Friend Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
                <div>
                  <p className="text-gray-800 dark:text-white font-medium">User Name {item}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">12 mutual friends</p>
                </div>
                <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Add</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
