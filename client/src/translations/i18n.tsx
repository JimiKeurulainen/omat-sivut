import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import HttpApi from 'i18next-http-backend';
import { fi } from './fi';
import { en } from './en';

const resources = {
	fi: { translation: fi },
	en: { translation: en }
}

i18n
	// .use(HttpApi)
	// .use(LanguageDetector)
	.use(initReactI18next)
	.init({
		lng: 'fi',
		fallbackLng: 'fi',
		resources: resources,
		interpolation: {
			escapeValue: false, // React already does escaping
		},
	});

export default i18n;