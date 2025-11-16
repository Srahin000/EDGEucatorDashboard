import type { Metadata } from 'next';
import { Poppins, Kalam } from 'next/font/google';
import './globals.css';
import { ChildProvider } from '@/contexts/ChildContext';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-handwriting',
});

export const metadata: Metadata = {
  title: 'Child Insights Dashboard',
  description: 'AI-powered insights dashboard for child conversations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${kalam.variable}`}>
        <ChildProvider>
          <OnboardingWrapper />
          {children}
        </ChildProvider>
      </body>
    </html>
  );
}

