import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProviders } from './components/providers/ClientProviders';
import { ReactQueryProvider } from './components/providers/ReactQueryProvider';
import { AuthClientProvider } from './components/providers/AuthClientProvider';
import { BodyAttributes } from './components/providers/BodyAttributes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// Précharge la police Inter avec le sous-ensemble latin
export const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GestionMax Formation Hub',
  description: 'Plateforme de gestion de formations professionnelles',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      {/* Suppression de cz-shortcut-listen qui cause l'erreur d'hydratation */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthClientProvider>
            <ClientProviders>
              <BodyAttributes>
                {children}
                <Toaster position="top-right" toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    style: {
                      background: '#16a34a',
                      color: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#dc2626',
                      color: '#fff',
                    },
                  }
                }} />
              </BodyAttributes>
            </ClientProviders>
          </AuthClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
