import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { MessageIcon } from './icons';

export const Overview = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <MessageIcon size={32} />
        </p>
        <p>
          {t('welcome')}
        </p>
      </div>
    </motion.div>
  );
};
