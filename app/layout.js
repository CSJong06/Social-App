import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Social Media Analytics',
  description: 'Track your social media growth and analytics',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          {session && (
            <Sidebar />
          )}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
