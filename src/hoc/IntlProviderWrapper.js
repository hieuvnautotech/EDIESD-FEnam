import React from // , { Component }
'react';
import { IntlProvider } from 'react-intl';

import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';
import '@formatjs/intl-pluralrules/polyfill';

import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';
import '@formatjs/intl-relativetimeformat/polyfill';

// import { useLanguageStore } from '@stores';

import { MultiLanguages } from '@utils';
// import * as adminlte from '@static/js/adminlte.js';
const messages = MultiLanguages.getFlattenedMessages();

// class IntlProviderWrapper extends Component {
//   render() {
//     const { children, language } = this.props;

//     return (
//       <IntlProvider locale={language} messages={messages[language]} defaultLocale="VI">
//         {children}
//       </IntlProvider>
//     );
//   }
// }

const IntlProviderWrapper = (props) => {
  // const language = useLanguageStore((state) => state.language);
  const { children, language } = props;
  return (
    <IntlProvider locale={language} messages={messages[language]} defaultLocale="VI">
      {children}
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
