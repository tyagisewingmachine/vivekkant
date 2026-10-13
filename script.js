(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Cinematic, muted video intro. The logo video is the supplied asset; text follows the reveal.
  const intro = $('#intro');
  const introVideo = $('#introVideo');
  const presenting = $('#introPresenting');
  const fallbackLogo = $('.intro-fallback-logo');
  const skipIntro = $('#skipIntro');
  let introDismissed = false;
  const hideIntro = () => {
    if (!intro || introDismissed) return;
    introDismissed = true;
    intro.classList.add('hide');
    try { sessionStorage.setItem('vkIntroSeen', '1'); } catch (_) {}
    if (introVideo) { introVideo.pause(); }
  };
  const showPresenting = () => {
    if (!presenting || introDismissed) return;
    presenting.classList.add('show');
    window.setTimeout(hideIntro, 1350);
  };
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('vkIntroSeen') === '1'; } catch (_) {}
  if (introSeen) {
    intro?.classList.add('hide');
  } else if (introVideo) {
    introVideo.addEventListener('ended', showPresenting, { once: true });
    introVideo.addEventListener('error', () => {
      introVideo.hidden = true;
      if (fallbackLogo) fallbackLogo.hidden = false;
      window.setTimeout(showPresenting, 1200);
    }, { once: true });
    // Fallback in case video duration metadata or ended event is unavailable.
    window.setTimeout(() => { if (!presenting?.classList.contains('show')) showPresenting(); }, 3800);
    window.setTimeout(hideIntro, 7200);
    const playAttempt = introVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {
      introVideo.hidden = true;
      if (fallbackLogo) fallbackLogo.hidden = false;
      window.setTimeout(showPresenting, 900);
    });
  } else {
    window.setTimeout(showPresenting, 800);
  }
  skipIntro?.addEventListener('click', hideIntro);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideIntro(); }, { once: true });

  // Mobile navigation.
  const navToggle = $('#menuToggle');
  const nav = $('#nav');
  navToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
    navToggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); navToggle?.setAttribute('aria-expanded', 'false'); if (navToggle) navToggle.textContent = '☰';
  }));

  // Reveal-on-scroll, with a no-IntersectionObserver fallback.
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.09 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  // Project filters.
  const projectCards = $$('.project-card');
  $$('.filter-chip').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    $$('.filter-chip').forEach(chip => { const active = chip === button; chip.classList.toggle('active', active); chip.setAttribute('aria-pressed', String(active)); });
    projectCards.forEach(card => { card.hidden = !(filter === 'all' || card.dataset.category === filter); });
  }));
  $$('.filter-chip').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));

  // Free local light/dark theme preference.
  const themeToggle = $('#themeToggle');
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('vkTheme') || 'light'; } catch (_) {}
  const setTheme = theme => {
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (themeToggle) { themeToggle.textContent = theme === 'dark' ? '☀' : '☾'; themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
    try { localStorage.setItem('vkTheme', theme); } catch (_) {}
  };
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeToggle?.addEventListener('click', () => setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));

  // English/Hindi UI translation. All translations are static and run entirely in the browser.
  const translations = {
    en: {
      navAbout:'About',navProjects:'My Work',navBusiness:'Business',navFeedback:'Feedback',navContact:'Contact',searchTitle:'Search this website',searchHint:'Start typing to find a section.',toClose:'to close',
      presenting:'Presenting',businessExecutive:'BUSINESS EXECUTIVE',skipIntro:'Skip intro',heroKicker:'Business. People. Progress.',heroHeadlineOne:'Building with',heroHeadlineTwo:'purpose.',heroDescription:'I’m Vivek Kant, a Business Executive contributing to the growth and digital presence of Tyagi Sewing Machine Co. through branding, communication and customer engagement.',getToKnow:'Get to know me',visitCompany:'Visit company website',myFocus:'MY FOCUS',aboutLabel:'01 / ABOUT',aboutHeadingOne:'Business-minded.',aboutHeadingTwo:'Always learning.',whatIDoLabel:'02 / WHAT I DO',whereContribute:'Where I contribute.',projectsLabel:'03 / MY WORK & BUSINESS INITIATIVES',projectsHeading:'My work & business initiatives.',projectsSupport:'A practical overview of the areas I support at Tyagi Sewing Machine Co.—from product presentation and marketing to customer communication and digital presence.',filterAll:'All',filterBusiness:'Product & Catalogue',filterDesign:'Brand & Marketing',filterCustomer:'Customer Voice',filterDigital:'Digital Presence',projectNote:'These cards describe my current focus areas, not separate completed client projects. Specific samples will be added only when approved for public sharing.',journeyLabel:'MY JOURNEY',journeyHeading:'Learning, building, growing.',journeySupport:'A short timeline of education and current direction.',profileLabel:'PROFILE & CONTACT CARD',profileHeading:'Take my profile with you.',profileHeadingOne:'Take my profile',profileHeadingTwo:'with you.',profileSupport:'Download a professional profile or save a contact card with phone, WhatsApp, email and both Instagram accounts.',downloadProfile:'Download profile',saveContact:'Save contact card',copyProfileLink:'Copy website link',copyProfileSub:'Share this profile with someone',familyBusinessLabel:'04 / FAMILY BUSINESS',feedbackLabel:'05 / FEEDBACK & CONCERNS',feedbackHeadOne:'Your feedback',feedbackHeadTwo:'matters.',feedbackDescription:'Share feedback, a suggestion or a company complaint. Submissions go to tyagisewingofficial@gmail.com, and you can receive an email confirmation.',contactLabel:'06 / CONTACT',letsConnect:'How can you contact Vivek?',contactSupport:'Call, WhatsApp, email or connect with me and the company on Instagram.',personalInstagram:'Personal Instagram',officialCompanySite:'Official company website',companyInstagram:'Company Instagram',phoneContact:'Call Vivek',whatsappContact:'WhatsApp Vivek',feedbackEmailContact:'Feedback & complaints',companyEmailContact:'Company email',directContact:'Direct contact',contactToBeConfirmed:'Details to be confirmed',updatesLabel:'UPDATES & NOTES',updatesHeading:'Ideas worth exploring.',updatesSupport:'A small space for future articles and website updates.',helpLabel:'HELP & FAQ',helpHeading:'A few useful answers.',backToTop:'BACK TO TOP ↑',quickMenuTitle:'QUICK LINKS'
    },
    hi: {
      navAbout:'परिचय',navProjects:'प्रोजेक्ट्स',navBusiness:'व्यवसाय',navFeedback:'फ़ीडबैक',navContact:'संपर्क',searchTitle:'वेबसाइट में खोजें',searchHint:'किसी सेक्शन को खोजने के लिए लिखें।',toClose:'बंद करने के लिए',
      presenting:'प्रस्तुत है',businessExecutive:'बिज़नेस एग्ज़ीक्यूटिव',skipIntro:'इंट्रो छोड़ें',heroKicker:'व्यवसाय। लोग। प्रगति।',heroHeadlineOne:'इरादे के साथ',heroHeadlineTwo:'आगे बढ़ना।',heroDescription:'मैं विवेक कांत हूँ। Tyagi Sewing Machine Co. की ब्रांडिंग, कम्युनिकेशन और ग्राहक जुड़ाव के ज़रिए बिज़नेस ग्रोथ और डिजिटल उपस्थिति में योगदान देता हूँ।',getToKnow:'मुझे जानें',visitCompany:'कंपनी वेबसाइट देखें',myFocus:'मेरा फोकस',aboutLabel:'01 / परिचय',aboutHeadingOne:'व्यवसाय की सोच।',aboutHeadingTwo:'सीखना जारी है।',whatIDoLabel:'02 / मेरा काम',whereContribute:'मैं जहाँ योगदान देता हूँ।',projectsLabel:'03 / बिज़नेस और डिजिटल काम',projectsHeading:'विचार आकार ले रहे हैं।',projectsSupport:'बिज़नेस कम्युनिकेशन, डिजिटल उपस्थिति और ग्राहक अनुभव पर ध्यान। प्लेसहोल्डर कॉन्सेप्ट स्पष्ट रूप से चिह्नित हैं।',filterAll:'सभी',filterBusiness:'व्यवसाय',filterDesign:'डिज़ाइन',filterCustomer:'ग्राहक की आवाज़',filterDigital:'डिजिटल',projectNote:'ये शुरुआती प्लेसहोल्डर हैं, पूरे किए गए क्लाइंट प्रोजेक्ट्स के दावे नहीं। तैयार होने पर वास्तविक काम जोड़ें।',journeyLabel:'मेरी यात्रा',journeyHeading:'सीखना, बनाना, आगे बढ़ना।',journeySupport:'पढ़ाई और मौजूदा दिशा की संक्षिप्त टाइमलाइन।',profileLabel:'प्रोफ़ाइल और कॉन्टैक्ट कार्ड',profileHeading:'मेरी प्रोफ़ाइल साथ रखें।',profileHeadingOne:'मेरी प्रोफ़ाइल',profileHeadingTwo:'साथ रखें।',profileSupport:'फ़ोन, WhatsApp, दोनों ईमेल और दोनों Instagram खातों वाले प्रोफ़ेशनल प्रोफ़ाइल या कॉन्टैक्ट कार्ड को सेव करें।',downloadProfile:'प्रोफ़ाइल डाउनलोड करें',saveContact:'कॉन्टैक्ट कार्ड सेव करें',copyProfileLink:'वेबसाइट लिंक कॉपी करें',copyProfileSub:'यह प्रोफ़ाइल किसी के साथ साझा करें',familyBusinessLabel:'04 / पारिवारिक व्यवसाय',feedbackLabel:'05 / फ़ीडबैक और शिकायतें',feedbackHeadOne:'आपका फ़ीडबैक',feedbackHeadTwo:'महत्वपूर्ण है।',feedbackDescription:'अपना फ़ीडबैक, सुझाव या कंपनी की शिकायत भेजें। सबमिशन tyagisewingofficial@gmail.com पर जाएगा और आपको ईमेल पुष्टि मिल सकती है।',contactLabel:'06 / संपर्क',letsConnect:'विवेक से कैसे संपर्क करें?',contactSupport:'कॉल, WhatsApp, ईमेल या मेरे और कंपनी के Instagram खातों से जुड़ें।',personalInstagram:'पर्सनल इंस्टाग्राम',officialCompanySite:'कंपनी की आधिकारिक वेबसाइट',companyInstagram:'कंपनी इंस्टाग्राम',phoneContact:'विवेक को कॉल करें',whatsappContact:'WhatsApp पर संपर्क करें',feedbackEmailContact:'फ़ीडबैक और शिकायतें',companyEmailContact:'कंपनी ईमेल',directContact:'सीधा संपर्क',contactToBeConfirmed:'जानकारी की पुष्टि बाकी',updatesLabel:'अपडेट और नोट्स',updatesHeading:'कुछ विचार जिन पर काम होगा।',updatesSupport:'भविष्य के लेखों और वेबसाइट अपडेट के लिए जगह।',helpLabel:'मदद और FAQ',helpHeading:'कुछ उपयोगी जवाब।',backToTop:'ऊपर जाएँ ↑',quickMenuTitle:'त्वरित लिंक'
    }
  };
  Object.assign(translations.en, {
    heroNote:'Working with purpose, learning every day.',focusStatement:'Clear communication · Thoughtful branding · Stronger connections',aboutLead:'I believe good business is built through trust, consistency and the way people experience a brand.',aboutBody:'My work centres on supporting the family business through product presentation, digital communication and customer relationships, while learning from the people who built it. Outside work, films, filmmaking and video editing are personal hobbies.',
    principleOneTitle:'People first',principleOneBody:'Respectful communication and lasting customer relationships.',principleTwoTitle:'Brand with clarity',principleTwoBody:'Presenting products and information in a clear, professional way.',principleThreeTitle:'Learn, improve, repeat',principleThreeBody:'Exploring better ways to work, communicate and grow.',whatIDoSupport:'A practical focus on business communication, digital presence and customer relationships.',workTitleOne:'Brand & Marketing',workDescOne:'Supporting brand presentation, product posters, social media content and a consistent visual identity.',workTitleTwo:'Digital Presence',workDescTwo:'Helping make company information, product communication and online touchpoints easier to explore.',workTitleThree:'Customer Engagement',workDescThree:'Supporting clear communication, customer feedback and business development initiatives.',workTitleFour:'Creative Thinking',workDescFour:'Bringing a thoughtful eye to design and presentation, while keeping the business objective in focus.',
    personalProfileLabel:'PERSONAL PROFILE',portraitHeadingOne:'A little more',portraitHeadingTwo:'about me.',portraitBody:'My focus is business, marketing and customer relationships. Outside work, films, filmmaking and video editing are personal hobbies.',businessNameOne:'Tyagi Sewing',businessNameTwo:'Machine Co.',businessDescription:'I contribute to marketing, branding, digital presence, product presentation and customer engagement, working under the guidance of Mr. Rajni Kant.',visitOfficialWebsite:'Visit official website',viewCatalogue:'View official catalogue',catalogueNote:'For official products, specifications and catalogue information, visit the company website.',
    journeySchoolTitle:'Commerce with Mathematics',journeySchoolBody:'Completed Class XII, building a foundation in commerce and quantitative subjects.',journeyCollegeTitle:'Bachelor of Commerce (B.Com.)',journeyCollegeBody:'University of Delhi — School of Open Learning.',journeyOngoingTitle:'Business & creative practice',journeyOngoingBody:'Contributing to marketing, branding, digital presence and customer engagement at Tyagi Sewing Machine Co., under the guidance of Mr. Rajni Kant. Films, filmmaking and video editing are personal hobbies outside business.',
    quickAbout:'About',quickProjects:'Projects',quickJourney:'My journey',quickProfile:'Profile & contact card',quickFeedback:'Feedback',quickConnect:'Connect',socialFollow:'FOLLOW ALONG'
  });
  Object.assign(translations.hi, {
    heroNote:'इरादे के साथ काम करना, हर दिन सीखना।',focusStatement:'स्पष्ट संवाद · सोच-समझकर ब्रांडिंग · बेहतर जुड़ाव',aboutLead:'मेरा मानना है कि अच्छा व्यवसाय भरोसे, निरंतरता और ब्रांड के अनुभव से बनता है।',aboutBody:'मैं प्रोडक्ट प्रस्तुति, डिजिटल कम्युनिकेशन और ग्राहक संबंधों के ज़रिए पारिवारिक व्यवसाय को सहयोग देता हूँ। काम के बाहर फ़िल्में, फ़िल्ममेकिंग और वीडियो एडिटिंग मेरे निजी शौक हैं।',
    principleOneTitle:'लोग सबसे पहले',principleOneBody:'सम्मानजनक संवाद और लंबे समय के ग्राहक संबंध।',principleTwoTitle:'स्पष्ट ब्रांडिंग',principleTwoBody:'प्रोडक्ट और जानकारी को साफ़, प्रोफ़ेशनल तरीके से प्रस्तुत करना।',principleThreeTitle:'सीखें, सुधारें, दोहराएँ',principleThreeBody:'काम करने, संवाद और विकास के बेहतर तरीके तलाशना।',whatIDoSupport:'बिज़नेस कम्युनिकेशन, डिजिटल उपस्थिति और ग्राहक संबंधों पर व्यावहारिक फोकस।',workTitleOne:'ब्रांड और मार्केटिंग',workDescOne:'ब्रांड प्रस्तुति, प्रोडक्ट पोस्टर, सोशल मीडिया कंटेंट और एक समान विज़ुअल पहचान में सहयोग।',workTitleTwo:'डिजिटल उपस्थिति',workDescTwo:'कंपनी की जानकारी, प्रोडक्ट कम्युनिकेशन और ऑनलाइन टचपॉइंट्स को बेहतर तरीके से प्रस्तुत करना।',workTitleThree:'ग्राहक जुड़ाव',workDescThree:'स्पष्ट संवाद, ग्राहक फ़ीडबैक और बिज़नेस डेवलपमेंट पहलों में सहयोग।',workTitleFour:'रचनात्मक सोच',workDescFour:'बिज़नेस उद्देश्य को ध्यान में रखते हुए डिज़ाइन और प्रस्तुति पर ध्यान देना।',
    personalProfileLabel:'व्यक्तिगत प्रोफ़ाइल',portraitHeadingOne:'मेरे बारे में',portraitHeadingTwo:'कुछ और।',portraitBody:'मेरा फोकस बिज़नेस, मार्केटिंग और ग्राहक संबंध हैं। काम के बाहर फ़िल्में, फ़िल्ममेकिंग और वीडियो एडिटिंग मेरे निजी शौक हैं।',businessNameOne:'त्यागी सिलाई',businessNameTwo:'मशीन कंपनी',businessDescription:'मैं श्री राजनी कांत के मार्गदर्शन में मार्केटिंग, ब्रांडिंग, डिजिटल उपस्थिति, प्रोडक्ट प्रस्तुति और ग्राहक जुड़ाव में योगदान देता हूँ।',visitOfficialWebsite:'आधिकारिक वेबसाइट देखें',viewCatalogue:'आधिकारिक कैटलॉग देखें',catalogueNote:'आधिकारिक प्रोडक्ट, स्पेसिफ़िकेशन और कैटलॉग जानकारी के लिए कंपनी वेबसाइट देखें।',
    journeySchoolTitle:'कॉमर्स विद मैथमैटिक्स',journeySchoolBody:'कक्षा 12 पूरी की; कॉमर्स और गणितीय विषयों में आधार बनाया।',journeyCollegeTitle:'बैचलर ऑफ़ कॉमर्स (B.Com.)',journeyCollegeBody:'दिल्ली विश्वविद्यालय — स्कूल ऑफ़ ओपन लर्निंग।',journeyOngoingTitle:'बिज़नेस और क्रिएटिव अभ्यास',journeyOngoingBody:'श्री राजनी कांत के मार्गदर्शन में Tyagi Sewing Machine Co. की मार्केटिंग, ब्रांडिंग, डिजिटल उपस्थिति और ग्राहक जुड़ाव में योगदान। फ़िल्में, फ़िल्ममेकिंग और वीडियो एडिटिंग निजी शौक हैं।',
    quickAbout:'परिचय',quickProjects:'प्रोजेक्ट्स',quickJourney:'मेरी यात्रा',quickProfile:'प्रोफ़ाइल और कॉन्टैक्ट कार्ड',quickFeedback:'फ़ीडबैक',quickConnect:'संपर्क',socialFollow:'सोशल पर जुड़ें'
  });

  Object.assign(translations.en, {
    projectProductTitle:'Product presentation & catalogue',projectProductBody:'Supporting product details, TSOL machine visuals, posters and catalogue presentation for clear customer communication.',projectDesignTitle:'Brand & marketing',projectDesignBody:'Supporting brand presentation, marketing creatives and company social media communication.',projectCustomerTitle:'Customer feedback & complaints',projectCustomerBody:'Helping customers share feedback, suggestions and company concerns through a clear contact path.',projectDigitalTitle:'Digital presence',projectDigitalBody:'Improving website content, company links and online information customers use to find what they need.',
    feedbackFormTitle:'FEEDBACK & COMPLAINTS',emailRoutingLabel:'EMAIL ROUTING',yourName:'Your name',emailAddress:'Your email address',topicLabel:'What is this about?',personalFeedbackOption:'Personal feedback',companyComplaintOption:'Company complaint',websiteExperienceOption:'Website experience',generalEnquiryOption:'General enquiry',otherOption:'Other',yourMessage:'Your message',attachPhoto:'Attach a photo',attachmentLimits:'(optional · JPG, PNG, WEBP · up to 5 MB)',uploadHelp:'Optional photo attachment (JPG, PNG or WEBP; up to 5 MB). Attach only images relevant to your message.',submitMessage:'Send message',
    updateProductTitle:'What makes product presentation clear?',updateProductBody:'A planned note on useful product information, visual consistency and customer-friendly communication.',updatePresenceTitle:'Building a personal digital presence',updatePresenceBody:'A future reflection on learning, experimenting and improving a digital profile over time.',updateCreativeTitle:'Listening to customers',updateCreativeBody:'A future space for improving feedback, answering common questions and making customer communication clearer.',notPublished:'Placeholder · Not published',
    faqOfficialQ:'Is this the official Tyagi Sewing Machine Co. website?',faqOfficialA:'No. This is Vivek Kant’s personal profile website. The official company website and catalogue are linked separately.',faqFormQ:'Does the feedback form send messages?',faqFormA:'Yes. The form uses a free external form-processing service to route feedback and complaints to tyagisewingofficial@gmail.com. The site owner must activate the email endpoint once before public use; customers see a website confirmation and receive an email autoresponse.',faqProjectsQ:'Are the projects shown here real client projects?',faqProjectsA:'This section describes current business focus areas, not separate completed client projects. Specific samples will be added only when approved for public sharing.',faqFreeQ:'Does this website require paid hosting?',faqFreeA:'The package is designed for free static hosting such as GitHub Pages and uses no paid libraries or backend. Usage limits and platform policies may change.',faqContactQ:'How can I contact Vivek?',faqContactA:'Call or WhatsApp +91 9625013545, email tyagisewingofficial@gmail.com or info@tyagisewingmachine.com, or use either Instagram account.'
  });
  Object.assign(translations.hi, {
    projectProductTitle:'प्रोडक्ट प्रस्तुति का कॉन्सेप्ट',projectProductBody:'स्वीकृत प्रोडक्ट पोस्टर, मशीन विज़ुअल या कैटलॉग प्रस्तुति के लिए प्लेसहोल्डर।',projectDesignTitle:'ब्रांड और विज़ुअल डिज़ाइन',projectDesignBody:'वास्तविक ब्रांडिंग, लेआउट और क्रिएटिव डिज़ाइन सैंपल के लिए प्लेसहोल्डर।',projectCustomerTitle:'ग्राहक फ़ीडबैक अनुभव',projectCustomerBody:'स्पष्ट फ़ीडबैक, मददगार जवाब और ग्राहक-केंद्रित संवाद के लिए प्लेसहोल्डर।',projectDigitalTitle:'वेब और डिजिटल उपस्थिति',projectDigitalBody:'वेबसाइट अपडेट, डिजिटल कम्युनिकेशन और ऑनलाइन अनुभव प्रोजेक्ट्स के लिए प्लेसहोल्डर।',
    feedbackFormTitle:'फ़ीडबैक और शिकायतें',emailRoutingLabel:'ईमेल रूटिंग',yourName:'आपका नाम',emailAddress:'आपका ईमेल पता',topicLabel:'यह किस बारे में है?',personalFeedbackOption:'व्यक्तिगत फ़ीडबैक',companyComplaintOption:'कंपनी की शिकायत',websiteExperienceOption:'वेबसाइट अनुभव',generalEnquiryOption:'सामान्य पूछताछ',otherOption:'अन्य',yourMessage:'आपका संदेश',attachPhoto:'फ़ोटो जोड़ें',attachmentLimits:'(वैकल्पिक · JPG, PNG, WEBP · अधिकतम 5 MB)',uploadHelp:'वैकल्पिक फ़ोटो (JPG, PNG या WEBP; अधिकतम 5 MB)। केवल अपने संदेश से संबंधित फ़ोटो जोड़ें।',submitMessage:'संदेश भेजें',
    updateProductTitle:'प्रोडक्ट प्रस्तुति स्पष्ट कैसे बनती है?',updateProductBody:'उपयोगी प्रोडक्ट जानकारी, एक जैसी विज़ुअल शैली और ग्राहक-अनुकूल संवाद पर भविष्य का नोट।',updatePresenceTitle:'अपनी डिजिटल उपस्थिति बनाना',updatePresenceBody:'सीखने, प्रयोग करने और डिजिटल प्रोफ़ाइल को बेहतर बनाने पर भविष्य का लेख।',updateCreativeTitle:'ग्राहकों की बात सुनना',updateCreativeBody:'फ़ीडबैक बेहतर बनाने, आम सवालों के जवाब देने और ग्राहक संवाद स्पष्ट करने के लिए भविष्य की जगह।',notPublished:'प्लेसहोल्डर · प्रकाशित नहीं',
    faqOfficialQ:'क्या यह Tyagi Sewing Machine Co. की आधिकारिक वेबसाइट है?',faqOfficialA:'नहीं। यह विवेक कांत की व्यक्तिगत प्रोफ़ाइल वेबसाइट है। कंपनी की आधिकारिक वेबसाइट और कैटलॉग अलग से लिंक किए गए हैं।',faqFormQ:'क्या फ़ीडबैक फ़ॉर्म संदेश भेजता है?',faqFormA:'हाँ। फ़ीडबैक और शिकायतें मुफ़्त बाहरी फ़ॉर्म सेवा के ज़रिए tyagisewingofficial@gmail.com पर जाती हैं। सार्वजनिक उपयोग से पहले साइट मालिक को ईमेल endpoint एक बार सक्रिय करना होगा; ग्राहक को वेबसाइट और ईमेल दोनों पर पुष्टि मिलेगी।',faqProjectsQ:'क्या यहाँ दिखाए गए प्रोजेक्ट वास्तविक क्लाइंट प्रोजेक्ट हैं?',faqProjectsA:'वास्तविक, स्वीकृत सैंपल जुड़ने तक प्रोजेक्ट कार्ड प्लेसहोल्डर हैं। इन्हें पूरे किए गए क्लाइंट प्रोजेक्ट्स का दावा न समझें।',faqFreeQ:'क्या इस वेबसाइट के लिए पेड होस्टिंग चाहिए?',faqFreeA:'यह पैकेज GitHub Pages जैसी मुफ़्त स्टैटिक होस्टिंग के लिए बनाया गया है और किसी पेड लाइब्रेरी या बैकएंड का उपयोग नहीं करता। मुफ़्त सेवाओं की सीमाएँ और नीतियाँ बदल सकती हैं।',faqContactQ:'विवेक से संपर्क कैसे करें?',faqContactA:'+91 9625013545 पर कॉल या WhatsApp करें, tyagisewingofficial@gmail.com या info@tyagisewingmachine.com पर ईमेल करें, या किसी भी Instagram खाते से जुड़ें।'
  });

  // Version 2.2: project section is now business focus areas, not a placeholder portfolio.
  Object.assign(translations.en, {
    focusArea:'FOCUS AREA',
    projectsLabel:'03 / MY WORK & BUSINESS INITIATIVES',
    projectsHeading:'My work & business initiatives.',
    projectsSupport:'A practical overview of the areas I support at Tyagi Sewing Machine Co.—from product presentation and marketing to customer communication and digital presence.',
    filterAll:'All', filterBusiness:'Product & Catalogue', filterDesign:'Brand & Marketing', filterCustomer:'Customer Voice', filterDigital:'Digital Presence',
    projectProductTitle:'Product presentation & catalogue',
    projectProductBody:'Supporting product details, TSOL machine visuals, posters and catalogue presentation for clear customer communication.',
    projectDesignTitle:'Brand & marketing',
    projectDesignBody:'Supporting brand presentation, marketing creatives and company social media communication.',
    projectCustomerTitle:'Customer feedback & complaints',
    projectCustomerBody:'Helping customers share feedback, suggestions and company concerns through a clear contact path.',
    projectDigitalTitle:'Digital presence',
    projectDigitalBody:'Improving website content, company links and online information customers use to find what they need.',
    projectNote:'These cards describe my current focus areas, not separate completed client projects. Specific samples will be added only when approved for public sharing.',
    navProjects:'My Work', quickProjects:'My Work',
    faqProjectsA:'This section describes current business focus areas, not separate completed client projects. Specific samples will be added only when approved for public sharing.'
  });
  Object.assign(translations.hi, {
    focusArea:'काम का क्षेत्र',
    projectsLabel:'03 / मेरा काम और बिज़नेस पहल',
    projectsHeading:'मेरा काम और बिज़नेस पहल।',
    projectsSupport:'Tyagi Sewing Machine Co. में मेरे योगदान के मुख्य क्षेत्र—प्रोडक्ट प्रस्तुति, मार्केटिंग, ग्राहक संवाद और डिजिटल उपस्थिति।',
    filterAll:'सभी', filterBusiness:'प्रोडक्ट और कैटलॉग', filterDesign:'ब्रांड और मार्केटिंग', filterCustomer:'ग्राहकों की आवाज़', filterDigital:'डिजिटल उपस्थिति',
    projectProductTitle:'प्रोडक्ट प्रस्तुति और कैटलॉग',
    projectProductBody:'ग्राहकों तक जानकारी स्पष्ट पहुँचाने के लिए प्रोडक्ट विवरण, TSOL मशीन विज़ुअल, पोस्टर और कैटलॉग प्रस्तुति में सहयोग।',
    projectDesignTitle:'ब्रांड और मार्केटिंग',
    projectDesignBody:'ब्रांड प्रस्तुति, मार्केटिंग क्रिएटिव और कंपनी के सोशल मीडिया संवाद में सहयोग।',
    projectCustomerTitle:'ग्राहक फ़ीडबैक और शिकायतें',
    projectCustomerBody:'ग्राहकों को फ़ीडबैक, सुझाव और कंपनी से जुड़ी चिंताएँ स्पष्ट तरीके से साझा करने का रास्ता देना।',
    projectDigitalTitle:'डिजिटल उपस्थिति',
    projectDigitalBody:'वेबसाइट सामग्री, कंपनी लिंक और ऑनलाइन जानकारी को बेहतर बनाना ताकि ग्राहक ज़रूरी जानकारी आसानी से पा सकें।',
    projectNote:'ये कार्ड मेरे मौजूदा काम के क्षेत्रों को दिखाते हैं, अलग-अलग पूरे किए गए क्लाइंट प्रोजेक्ट्स को नहीं। उदाहरण तभी जोड़े जाएँगे जब उन्हें सार्वजनिक रूप से साझा करने की मंज़ूरी होगी।',
    navProjects:'मेरा काम', quickProjects:'मेरा काम',
    faqProjectsA:'यह सेक्शन बिज़नेस में मेरे मौजूदा योगदान के क्षेत्रों को दिखाता है, अलग-अलग पूरे किए गए क्लाइंट प्रोजेक्ट्स को नहीं। उदाहरण तभी जोड़े जाएँगे जब उन्हें सार्वजनिक रूप से साझा करने की मंज़ूरी होगी।'
  });

  const langToggle = $('#langToggle');
  let lang = 'en';
  try { lang = localStorage.getItem('vkLang') || 'en'; } catch (_) {}
  const setLanguage = next => {
    lang = next === 'hi' ? 'hi' : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        // Preserve inline directional glyphs for action links by handling those nodes explicitly.
        if (el.id === 'skipIntro') el.innerHTML = `${translations[lang][key]} <span aria-hidden="true">↗</span>`;
        else el.textContent = translations[lang][key];
      }
    });
    if (langToggle) { langToggle.textContent = lang === 'hi' ? 'EN' : 'HI'; langToggle.setAttribute('aria-label', lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'); }
    try { localStorage.setItem('vkLang', lang); } catch (_) {}
  };
  setLanguage(lang);
  langToggle?.addEventListener('click', () => setLanguage(lang === 'en' ? 'hi' : 'en'));

  // Search overlay and static section index. No external search service required.
  const searchOverlay = $('#searchOverlay'), searchToggle = $('#searchToggle'), searchClose = $('#searchClose'), searchInput = $('#siteSearchInput'), searchResults = $('#searchResults');
  const searchable = [
    ['About me','मेरे बारे में','about','Business-minded and always learning'],['What I do','मैं क्या करता हूँ','work','Brand and marketing, digital presence, customer engagement'],['My work','मेरे काम','projects','Product catalogue, brand marketing, customer feedback, digital presence'],['My journey','मेरी यात्रा','journey','Education, B.Com, commerce, current direction'],['Profile download','प्रोफ़ाइल डाउनलोड','profile-download','PDF resume, contact card, vCard'],['Family business','पारिवारिक व्यवसाय','business','Tyagi Sewing Machine Co., TSOL, official catalogue'],['Feedback and complaints','फ़ीडबैक और शिकायत','feedback','Personal feedback or company complaint sent to company email'],['Contact','संपर्क','contact','Phone, WhatsApp, email, personal and company Instagram'],['Updates and notes','अपडेट और नोट्स','updates','Blog, articles, creative notes'],['Help and FAQ','मदद और FAQ','help','Privacy, site help, no paid services']
  ];
  const openSearch = () => { if (!searchOverlay) return; searchOverlay.hidden = false; document.body.classList.add('search-open'); window.setTimeout(() => searchInput?.focus(), 25); };
  const closeSearch = () => { if (!searchOverlay) return; searchOverlay.hidden = true; document.body.classList.remove('search-open'); searchToggle?.focus(); };
  searchToggle?.addEventListener('click', openSearch); searchClose?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && searchOverlay && !searchOverlay.hidden) closeSearch(); });
  const renderSearch = query => {
    if (!searchResults) return;
    const q = query.trim().toLocaleLowerCase();
    searchResults.replaceChildren();
    if (!q) { const p = document.createElement('p'); p.className = 'search-hint'; p.textContent = lang === 'hi' ? 'किसी सेक्शन को खोजने के लिए लिखें।' : 'Start typing to find a section.'; searchResults.append(p); return; }
    const matches = searchable.filter(item => item.join(' ').toLocaleLowerCase().includes(q));
    if (!matches.length) { const p = document.createElement('p'); p.className = 'search-hint'; p.textContent = lang === 'hi' ? 'कोई मैच नहीं मिला। दूसरा शब्द आज़माएँ।' : 'No matches found. Try another term.'; searchResults.append(p); return; }
    matches.forEach(item => {
      const a = document.createElement('a'); a.className = 'search-result'; a.href = '#'+item[2];
      const strong = document.createElement('strong'); strong.textContent = lang === 'hi' ? item[1] : item[0];
      const small = document.createElement('small'); small.textContent = item[3];
      a.append(strong, small); a.addEventListener('click', closeSearch); searchResults.append(a);
    });
  };
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));

  // Floating quick menu and scroll-to-top control.
  const quickToggle = $('#quickMenuToggle'), quickPanel = $('#quickMenuPanel');
  quickToggle?.addEventListener('click', () => {
    const open = quickPanel?.hidden !== false;
    if (quickPanel) quickPanel.hidden = !open;
    quickToggle.classList.toggle('is-open', open);
    quickToggle.textContent = open ? '×' : '＋'; quickToggle.setAttribute('aria-expanded', String(open));
  });
  $$('#quickMenuPanel a').forEach(a => a.addEventListener('click', () => {
    if (quickPanel) quickPanel.hidden = true;
    if (quickToggle) { quickToggle.classList.remove('is-open'); quickToggle.textContent = '＋'; quickToggle.setAttribute('aria-expanded', 'false'); }
  }));
  const scrollTop = $('#scrollTop');
  const onScroll = () => scrollTop?.classList.toggle('visible', window.scrollY > 420);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

  // Download/share actions.
  $('#copyProfileLink')?.addEventListener('click', async () => {
    const status = $('#copyProfileStatus');
    const url = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(url);
      if (status) status.textContent = lang === 'hi' ? 'वेबसाइट लिंक कॉपी हो गया।' : 'Website link copied.';
    } catch (_) {
      if (status) status.textContent = lang === 'hi' ? 'लिंक कॉपी नहीं हो पाया। ब्राउज़र के एड्रेस बार से कॉपी करें।' : 'Could not copy automatically. Copy the link from your browser address bar.';
    }
  });

  // Customer feedback & complaints are submitted by standard POST to the free form endpoint.
  // Standard POST is intentional: the provider's email autoresponse is not supported by its AJAX mode.
  const feedbackForm = $('#feedbackForm'), photoInput = $('#photoAttachment');
  const previewWrap = $('#attachmentPreview'), previewImage = $('#attachmentPreviewImage'), fileName = $('#attachmentFileName'), removePhoto = $('#removeAttachment');
  let previewUrl = null;
  const resultEl = $('#formResult');
  const clearPhoto = () => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    if (photoInput) photoInput.value = '';
    if (previewImage) previewImage.removeAttribute('src');
    if (fileName) fileName.textContent = '';
    if (previewWrap) previewWrap.hidden = true;
  };
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) { clearPhoto(); return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { clearPhoto(); if (resultEl) resultEl.textContent = lang === 'hi' ? 'कृपया JPG, PNG या WEBP इमेज चुनें।' : 'Please select a JPG, PNG or WEBP image.'; return; }
    if (file.size > 5 * 1024 * 1024) { clearPhoto(); if (resultEl) resultEl.textContent = lang === 'hi' ? 'कृपया 5 MB से छोटी इमेज चुनें।' : 'Please choose an image smaller than 5 MB.'; return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    if (previewImage) previewImage.src = previewUrl;
    if (fileName) fileName.textContent = file.name;
    if (previewWrap) previewWrap.hidden = false;
    if (resultEl) resultEl.textContent = lang === 'hi' ? 'फ़ोटो भेजने के लिए तैयार है।' : 'Photo ready to attach.';
  });
  removePhoto?.addEventListener('click', clearPhoto);
  const topic = $('#topic'), categoryHint = $('#categoryHint');
  const setCategoryHint = () => {
    if (!topic || !categoryHint) return;
    const complaint = topic.value === 'company';
    categoryHint.textContent = lang === 'hi'
      ? (complaint ? 'आपकी शिकायत tyagisewingofficial@gmail.com पर भेजी जाएगी।' : 'आपका फ़ीडबैक tyagisewingofficial@gmail.com पर भेजा जाएगा।')
      : (complaint ? 'Your complaint will be sent to tyagisewingofficial@gmail.com.' : 'Your message will be sent to tyagisewingofficial@gmail.com.');
    categoryHint.classList.toggle('company-hint', complaint);
  };
  topic?.addEventListener('change', setCategoryHint);
  langToggle?.addEventListener('click', () => window.setTimeout(setCategoryHint, 0));
  setCategoryHint();
  feedbackForm?.addEventListener('submit', event => {
    // Keep native browser validation and regular POST; never claim success before the provider responds.
    if (!feedbackForm.checkValidity()) return;
    if (resultEl) resultEl.textContent = lang === 'hi' ? 'भेजा जा रहा है… कृपया पेज को बंद न करें।' : 'Sending… please keep this page open.';
    const submitButton = feedbackForm.querySelector('button[type="submit"]');
    if (submitButton) { submitButton.disabled = true; }
  });
})();
