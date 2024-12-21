import { Navigate } from 'react-router-dom';
import { useAuthenticator, View} from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "../App.css"
import i18n from '../i18n/config';


import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';
I18n.putVocabularies(translations);
I18n.setLanguage('it');





export default function Login() {
  const { authStatus } = useAuthenticator();


  if (authStatus === 'authenticated') {
    return <Navigate to="/notes" replace />;
  }

  return (
<div className="min-h-screen flex items-center justify-center bg-orange-200 w-full">
      <Authenticator
        components={{
          Header: () => (
            <View className="flex flex-col items-center mb-4">
              <img
                src="/logo.svg"
                alt="Your Logo"
                className="w-20 h-20 mb-2 rounded-full"
              />
              <h1 className="text-xl font-bold text-[#c44217]">
                {i18n.t('auth.welcome')}
              </h1>
            </View>
          )
       
     
        }
        
     
        }
        className="rounded-lg shadow-lg p-4 bg-orange-50"
      />
    

    
   
    </div>
  );
}