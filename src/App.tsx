import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextUIProvider } from '@nextui-org/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import Login from './pages/Login';
import Notes from './pages/Notes';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/Error';
import AuthLayout from './layouts/AuthLayout';


const queryClient = new QueryClient();


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <Authenticator.Provider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/error" element={<ErrorPage />} />
                
                {/* Protected routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/notes" element={<Notes />} />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/notes" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
          </Authenticator.Provider>
        </NextUIProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;