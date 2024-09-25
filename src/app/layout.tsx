import './globals.css'
export const metadata = {
  title: 'Your Expense Tracker',
  description: 'Track your expenses effortlessly',
}

// If you want to use AuthCheck, uncomment the following line:
// import AuthCheck from '@/components/AuthCheck'
// and wrap the {children} in the <AuthCheck> component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        {children}
        
        </body>
    </html>
  )
}