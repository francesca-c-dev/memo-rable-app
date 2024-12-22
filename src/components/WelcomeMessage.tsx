
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function WelcomeMessage() {
  const { user } = useAuthenticator();
  const { t } = useTranslation();

  
  
  const username =  user?.signInDetails?.loginId?.split('@')[0] || user?.username ||'';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <motion.h1 
        className="font-fancy text-[30pt] text-primary-600 dark:text-primary-300 my-6 ml-6 flex justify-start flex-col items-start"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t('common.welcome')},{' '}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-primary-500 dark:text-primary-400 text-[20pt] font-logo"
        >
          {username}
        </motion.span>
        
      </motion.h1>
    </motion.div>
  );
}

export default WelcomeMessage;