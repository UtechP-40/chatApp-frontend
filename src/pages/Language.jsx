import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { setSelectedLanguage } from '../redux/features/userAuthSlice'; // Adjust path as needed

const Language = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state) => state.userAuth.selectedLanguage);
  const { i18n } = useTranslation(); // Get i18n instance from the hook

  const languages = [
    { language: 'English', languageCode: 'en' },
    { language: 'Spanish', languageCode: 'es' },
    { language: 'French', languageCode: 'fr' },
    { language: 'German', languageCode: 'de' },
    { language: 'Italian', languageCode: 'it' },
    { language: 'Portuguese', languageCode: 'pt' },
    { language: 'Dutch', languageCode: 'nl' },
    // { language: 'Russian', languageCode: 'ru' },
    // { language: 'Chinese', languageCode: 'zh' },
    // { language: 'Japanese', languageCode: 'ja' },
    // { language: 'Korean', languageCode: 'ko' },
    // { language: 'Arabic', languageCode: 'ar' },
    { language: 'Hindi', languageCode: 'hi' },
    // { language: 'Bengali', languageCode: 'bn' },
    // { language: 'Turkish', languageCode: 'tr' },
    // { language: 'Vietnamese', languageCode: 'vi' },
    // { language: 'Polish', languageCode: 'pl' },
    // { language: 'Ukrainian', languageCode: 'uk' },
    // { language: 'Romanian', languageCode: 'ro' },
    // { language: 'Greek', languageCode: 'el' },
    // { language: 'Czech', languageCode: 'cs' },
    // { language: 'Swedish', languageCode: 'sv' },
    // { language: 'Finnish', languageCode: 'fi' },
    // { language: 'Norwegian', languageCode: 'no' },
    // { language: 'Danish', languageCode: 'da' },
    // { language: 'Hungarian', languageCode: 'hu' },
    // { language: 'Hebrew', languageCode: 'he' },
    // { language: 'Thai', languageCode: 'th' },
    // { language: 'Indonesian', languageCode: 'id' },
    // { language: 'Malay', languageCode: 'ms' },
    // { language: 'Filipino', languageCode: 'tl' },
    // { language: 'Persian', languageCode: 'fa' }
  ];
  ;

  const handleLanguageChange = (language) => {
    dispatch(setSelectedLanguage(language.toLowerCase())); // Dispatch action to set language
    i18n.changeLanguage(language.toLowerCase()); // Change language in i18next
  };

  useEffect(() => {
    // Ensure the language is selected in i18next when the page is loaded
    i18n.changeLanguage(selectedLanguage);
  }, [i18n, selectedLanguage]);
  console.clear()
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">{i18n.t('selectLanguage')}</h1>

      <div className="w-full max-w-3xl space-y-4">
        {languages.map((language, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={language.language}
              checked={selectedLanguage === language.languageCode.toLowerCase()}
              onChange={() => handleLanguageChange(language.languageCode)}
              className="checkbox checkbox-sm"
            />
            <label htmlFor={language.language} className="text-sm text-zinc-700">
              {language.language}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Language;
