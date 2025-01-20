import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import lang from "../constants/language/en.json"
// Add translations for all the languages here
const resources = {
  en: {
    translation: lang.en
    
  },
  es: {
    translation: lang.es
  },
  fr: {
    translation: lang.fr
  },
  de: {
    translation: lang.de
  },
  it: {
    translation: {
      "hello": "Ciao",
      "welcome": "Benvenuto",
      "selectLanguage": "Seleziona la lingua",
      "goodbye": "Arrivederci",
      "thankYou": "Grazie",
      // Add more translation keys as needed
    }
  },
  pt: {
    translation: {
      "hello": "Olá",
      "welcome": "Bem-vindo",
      "selectLanguage": "Selecione o idioma",
      "goodbye": "Adeus",
      "thankYou": "Obrigado",
      // Add more translation keys as needed
    }
  },
  nl: {
    translation: {
      "hello": "Hallo",
      "welcome": "Welkom",
      "selectLanguage": "Selecteer taal",
      "goodbye": "Tot ziens",
      "thankYou": "Dank je",
      // Add more translation keys as needed
    }
  },
  ru: {
    translation: {
      "hello": "Здравствуйте",
      "welcome": "Добро пожаловать",
      "selectLanguage": "Выберите язык",
      "goodbye": "До свидания",
      "thankYou": "Спасибо",
      // Add more translation keys as needed
    }
  },
  zh: {
    translation: {
      "hello": "你好",
      "welcome": "欢迎",
      "selectLanguage": "选择语言",
      "goodbye": "再见",
      "thankYou": "谢谢",
      // Add more translation keys as needed
    }
  },
  ja: {
    translation: {
      "hello": "こんにちは",
      "welcome": "ようこそ",
      "selectLanguage": "言語を選択",
      "goodbye": "さようなら",
      "thankYou": "ありがとう",
      // Add more translation keys as needed
    }
  },
  ko: {
    translation: {
      "hello": "안녕하세요",
      "welcome": "환영합니다",
      "selectLanguage": "언어 선택",
      "goodbye": "안녕히 가세요",
      "thankYou": "감사합니다",
      // Add more translation keys as needed
    }
  },
  ar: {
    translation: {
      "hello": "مرحبًا",
      "welcome": "أهلاً وسهلاً",
      "selectLanguage": "اختار اللغة",
      "goodbye": "وداعًا",
      "thankYou": "شكرًا",
      // Add more translation keys as needed
    }
  },
  hi: {
    translation: lang.hi
  },
  bn: {
    translation: {
      "hello": "হ্যালো",
      "welcome": "স্বাগতম",
      "selectLanguage": "ভাষা নির্বাচন করুন",
      "goodbye": "বিদায়",
      "thankYou": "ধন্যবাদ",
      // Add more translation keys as needed
    }
  },
  tr: {
    translation: {
      "hello": "Merhaba",
      "welcome": "Hoş geldiniz",
      "selectLanguage": "Dil seçin",
      "goodbye": "Hoşça kal",
      "thankYou": "Teşekkür ederim",
      // Add more translation keys as needed
    }
  },
  vi: {
    translation: {
      "hello": "Xin chào",
      "welcome": "Chào mừng",
      "selectLanguage": "Chọn ngôn ngữ",
      "goodbye": "Tạm biệt",
      "thankYou": "Cảm ơn",
      // Add more translation keys as needed
    }
  },
  pl: {
    translation: {
      "hello": "Cześć",
      "welcome": "Witaj",
      "selectLanguage": "Wybierz język",
      "goodbye": "Do widzenia",
      "thankYou": "Dziękuję",
      // Add more translation keys as needed
    }
  },
  uk: {
    translation: {
      "hello": "Привіт",
      "welcome": "Ласкаво просимо",
      "selectLanguage": "Виберіть мову",
      "goodbye": "До побачення",
      "thankYou": "Дякую",
      // Add more translation keys as needed
    }
  },
  ro: {
    translation: {
      "hello": "Bună",
      "welcome": "Bine ați venit",
      "selectLanguage": "Selectați limba",
      "goodbye": "La revedere",
      "thankYou": "Mulțumesc",
      // Add more translation keys as needed
    }
  },
  el: {
    translation: {
      "hello": "Γειά σας",
      "welcome": "Καλώς ήρθατε",
      "selectLanguage": "Επιλέξτε γλώσσα",
      "goodbye": "Αντίο",
      "thankYou": "Ευχαριστώ",
      // Add more translation keys as needed
    }
  },
  cs: {
    translation: {
      "hello": "Ahoj",
      "welcome": "Vítejte",
      "selectLanguage": "Vyberte jazyk",
      "goodbye": "Sbohem",
      "thankYou": "Děkuji",
      // Add more translation keys as needed
    }
  },
  sv: {
    translation: {
      "hello": "Hej",
      "welcome": "Välkommen",
      "selectLanguage": "Välj språk",
      "goodbye": "Adjö",
      "thankYou": "Tack",
      // Add more translation keys as needed
    }
  },
  fi: {
    translation: {
      "hello": "Hei",
      "welcome": "Tervetuloa",
      "selectLanguage": "Valitse kieli",
      "goodbye": "Näkemiin",
      "thankYou": "Kiitos",
      // Add more translation keys as needed
    }
  },
  no: {
    translation: {
      "hello": "Hei",
      "welcome": "Velkommen",
      "selectLanguage": "Velg språk",
      "goodbye": "Ha det",
      "thankYou": "Takk",
      // Add more translation keys as needed
    }
  },
  da: {
    translation: {
      "hello": "Hej",
      "welcome": "Velkommen",
      "selectLanguage": "Vælg sprog",
      "goodbye": "Farvel",
      "thankYou": "Tak",
      // Add more translation keys as needed
    }
  },
  hu: {
    translation: {
      "hello": "Helló",
      "welcome": "Üdvözöljük",
      "selectLanguage": "Válassza ki a nyelvet",
      "goodbye": "Viszlát",
      "thankYou": "Köszönöm",
      // Add more translation keys as needed
    }
  },
  he: {
    translation: {
      "hello": "שלום",
      "welcome": "ברוך הבא",
      "selectLanguage": "בחר שפה",
      "goodbye": "להתראות",
      "thankYou": "תודה",
      // Add more translation keys as needed
    }
  },
  th: {
    translation: {
      "hello": "สวัสดี",
      "welcome": "ยินดีต้อนรับ",
      "selectLanguage": "เลือกภาษา",
      "goodbye": "ลาก่อน",
      "thankYou": "ขอบคุณ",
      // Add more translation keys as needed
    }
  },
  id: {
    translation: {
      "hello": "Halo",
      "welcome": "Selamat datang",
      "selectLanguage": "Pilih bahasa",
      "goodbye": "Selamat tinggal",
      "thankYou": "Terima kasih",
      // Add more translation keys as needed
    }
  },
  ms: {
    translation: {
      "hello": "Halo",
      "welcome": "Selamat datang",
      "selectLanguage": "Pilih bahasa",
      "goodbye": "Selamat tinggal",
      "thankYou": "Terima kasih",
      // Add more translation keys as needed
    }
  },
  tl: {
    translation: {
      "hello": "Kamusta",
      "welcome": "Maligayang pagdating",
      "selectLanguage": "Piliin ang wika",
      "goodbye": "Paalam",
      "thankYou": "Salamat",
      // Add more translation keys as needed
    }
  },
  fa: {
    translation: {
      "hello": "سلام",
      "welcome": "خوش آمدید",
      "selectLanguage": "زبان را انتخاب کنید",
      "goodbye": "خداحافظ",
      "thankYou": "ممنون",
      // Add more translation keys as needed
    }
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(HttpBackend) // Load translation files (optional)
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng')||'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    debug: true,
  });

export default i18n;
