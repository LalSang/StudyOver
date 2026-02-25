const SCHOOL_CONFIGS = {
  appstate: {
    name: 'Appalachian State University',
    logoPath: 'images/AppStateLogo.png',
    emailDomain: '@appstate.edu',
    facts: [
      'Boone sits high in the Blue Ridge Mountains at about 3,300 feet.',
      'App State began in 1899 and is known for strong teaching programs.',
      'The campus is close to outdoor trails, skiing, and mountain parks.',
      'Boone weather can shift quickly, especially in late fall and spring.',
      'The university motto is "Esse Quam Videri" or "To Be Rather Than To Seem".'
    ]
  },
  unc: {
    name: 'University of North Carolina at Chapel Hill',
    logoPath: 'images/ChapelHillLogo.png',
    emailDomain: '@unc.edu',
    facts: [
      'UNC-Chapel Hill is one of the oldest public universities in the U.S.',
      'Chapel Hill is part of the Triangle with Raleigh and Durham.',
      'The Research Triangle area is a major tech and biotech hub.',
      'UNC has a long history in medicine, journalism, and public service.',
      'The school is recognized for strong research and graduate programs.'
    ]
  },
  ncsu: {
    name: 'North Carolina State University',
    logoPath: 'images/NCStateLogo.png',
    emailDomain: '@ncsu.edu',
    facts: [
      'NC State is based in Raleigh, North Carolina\'s capital city.',
      'The university is known for engineering, textiles, and design.',
      'Centennial Campus connects academics with industry partners.',
      'Raleigh offers a strong startup and technology job market.',
      'NC State is one of the key schools in the Research Triangle.'
    ]
  },
  duke: {
    name: 'Duke University',
    logoPath: 'images/DukeUniversityLogo.png',
    emailDomain: '@duke.edu',
    facts: [
      'Duke is located in Durham, North Carolina.',
      'The campus is known for Gothic architecture and Duke Chapel.',
      'Durham has grown into a major city for health and startups.',
      'Duke is widely known for medicine, law, and policy programs.',
      'The university is part of the broader Triangle research ecosystem.'
    ]
  },
  ecu: {
    name: 'East Carolina University',
    logoPath: 'images/EastCarolinaUniversityLogo.png',
    emailDomain: '@ecu.edu',
    facts: [
      'East Carolina University is based in Greenville, North Carolina.',
      'ECU has a strong regional role in health and teacher education.',
      'Greenville is one of the larger economic centers in eastern NC.',
      'The university serves a broad student population across the state.',
      'ECU health programs support many communities in eastern North Carolina.'
    ]
  }
};

const SCHOOL_NAME_TO_KEY = {
  'appalachian state university': 'appstate',
  'university of north carolina at chapel hill': 'unc',
  'north carolina state university': 'ncsu',
  'duke university': 'duke',
  'east carolina university': 'ecu'
};
const SCHOOL_CHOICES = Object.entries(SCHOOL_CONFIGS).map(([key, config]) => ({
  key,
  name: config.name
}));

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function getSchoolFromQuery() {
  const school = getQueryParams().get('school');
  if (!school) {
    return null;
  }

  return SCHOOL_CONFIGS[school] ? school : null;
}

function getSelectedSchoolKey() {
  const schoolFromQuery = getSchoolFromQuery();
  if (schoolFromQuery) {
    window.localStorage.setItem('selectedSchool', schoolFromQuery);
    return schoolFromQuery;
  }

  const storedSchool = window.localStorage.getItem('selectedSchool');
  if (storedSchool && SCHOOL_CONFIGS[storedSchool]) {
    return storedSchool;
  }

  return 'appstate';
}

function getSchoolConfig(schoolKey) {
  return SCHOOL_CONFIGS[schoolKey] || SCHOOL_CONFIGS.appstate;
}

class SchoolFooter {
  constructor(facts) {
    this.facts = facts;
    this.currentIndex = 0;
    this.displayDuration = 10000;
    this.fadeTime = 500;
  }

  initialize(footerElement) {
    if (!footerElement) {
      return;
    }

    const contentContainer = document.createElement('div');
    contentContainer.id = 'school-content';
    contentContainer.style.cssText = `
      transition: opacity ${this.fadeTime}ms ease-in-out;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
      font-style: italic;
      color: #666;
    `;

    footerElement.innerHTML = '';
    footerElement.appendChild(contentContainer);
    this.showContent(contentContainer);
    this.startRotation(contentContainer);
  }

  showContent(container) {
    container.textContent = this.facts[this.currentIndex];
    container.style.opacity = '1';
  }

  startRotation(container) {
    if (!this.facts.length) {
      return;
    }

    setInterval(() => {
      container.style.opacity = '0';
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.facts.length;
        this.showContent(container);
      }, this.fadeTime);
    }, this.displayDuration);
  }
}

function initializeSchoolFooter() {
  const onSchoolSelectorPage = document.querySelector('#school-select-form');
  if (onSchoolSelectorPage) {
    const selectorFooter = document.querySelector('footer');
    if (selectorFooter) {
      selectorFooter.innerHTML = '';
    }
    return;
  }

  const footer = document.querySelector('footer');
  if (!footer) {
    return;
  }

  const schoolKey = getSelectedSchoolKey();
  const schoolConfig = getSchoolConfig(schoolKey);
  const schoolFooter = new SchoolFooter(schoolConfig.facts);
  schoolFooter.initialize(footer);
}

function initializeSchoolSelectorPage() {
  const schoolSelectForm = document.querySelector('#school-select-form');
  if (!schoolSelectForm) {
    return;
  }

  const schoolInput = document.querySelector('#school-search');
  const resultsContainer = document.querySelector('#school-search-results');
  const errorLabel = document.querySelector('#school-select-error');
  const wrapper = document.querySelector('.school-search-wrapper');
  const queryError = getQueryParams().get('error');
  let selectedSchoolKey = null;

  if (queryError === 'auth' && errorLabel) {
    errorLabel.textContent = 'Please choose your university and sign in first.';
  }

  const hideResults = () => {
    if (resultsContainer) {
      resultsContainer.classList.remove('visible');
    }
  };

  const findMatches = (value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return SCHOOL_CHOICES.filter((school) => school.name.toLowerCase().startsWith(normalized));
  };

  const findExactSchoolKey = (value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    return SCHOOL_NAME_TO_KEY[normalized] || null;
  };

  const renderResults = (value, showAll) => {
    if (!resultsContainer) {
      return;
    }

    const normalized = value.trim().toLowerCase();
    if (!showAll && !normalized) {
      hideResults();
      return;
    }

    const matches = showAll ? SCHOOL_CHOICES : findMatches(value);
    resultsContainer.innerHTML = '';

    if (!matches.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'school-search-empty';
      emptyState.textContent = 'No matching school found';
      resultsContainer.appendChild(emptyState);
      resultsContainer.classList.add('visible');
      return;
    }

    matches.forEach((school) => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'school-search-option';
      optionButton.textContent = school.name;
      optionButton.dataset.schoolKey = school.key;
      optionButton.addEventListener('click', function() {
        schoolInput.value = school.name;
        selectedSchoolKey = school.key;
        if (errorLabel) {
          errorLabel.textContent = '';
        }
        hideResults();
      });
      resultsContainer.appendChild(optionButton);
    });

    resultsContainer.classList.add('visible');
  };

  schoolInput.addEventListener('focus', function() {
    renderResults(schoolInput.value, !schoolInput.value.trim());
  });

  schoolInput.addEventListener('input', function() {
    selectedSchoolKey = findExactSchoolKey(schoolInput.value);
    renderResults(schoolInput.value, false);
    if (errorLabel) {
      errorLabel.textContent = '';
    }
  });

  document.addEventListener('click', function(event) {
    if (wrapper && wrapper.contains(event.target)) {
      return;
    }
    hideResults();
  });

  schoolSelectForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const enteredValue = schoolInput.value.trim().toLowerCase();
    const exactSchoolKey = selectedSchoolKey || SCHOOL_NAME_TO_KEY[enteredValue];
    const matches = findMatches(schoolInput.value);
    const schoolKey = exactSchoolKey || (matches.length === 1 ? matches[0].key : null);

    if (!schoolKey) {
      if (errorLabel) {
        errorLabel.textContent = 'Select one of the listed universities.';
      }
      renderResults(schoolInput.value, !schoolInput.value.trim());
      return;
    }

    window.localStorage.setItem('selectedSchool', schoolKey);
    window.location.href = `/SO_SignOnPage.html?school=${schoolKey}`;
  });
}

function applySchoolBranding() {
  const schoolKey = getSelectedSchoolKey();
  const schoolConfig = getSchoolConfig(schoolKey);

  const loginTitle = document.querySelector('#school-login-title');
  if (loginTitle) {
    loginTitle.textContent = `Welcome to ${schoolConfig.name} StudyOver`;
  }

  const signupTitle = document.querySelector('#school-signup-title');
  if (signupTitle) {
    signupTitle.textContent = `Create Your ${schoolConfig.name} StudyOver Account`;
  }

  const loginLogo = document.querySelector('#school-login-logo');
  if (loginLogo) {
    loginLogo.src = schoolConfig.logoPath;
    loginLogo.alt = `${schoolConfig.name} logo`;
  }

  const signupLogo = document.querySelector('#school-signup-logo');
  if (signupLogo) {
    signupLogo.src = schoolConfig.logoPath;
    signupLogo.alt = `${schoolConfig.name} logo`;
  }

  const loginSchool = document.querySelector('#login-school');
  if (loginSchool) {
    loginSchool.value = schoolKey;
  }

  const signupSchool = document.querySelector('#signup-school');
  if (signupSchool) {
    signupSchool.value = schoolKey;
  }
}

// H1 Navigation functionality
function initializeH1Navigation() {
  const h1Element = document.querySelector('header h1');
  const onSignInPage = document.querySelector('.login-form');
  if (h1Element && !onSignInPage) {
    // Add cursor pointer style and hover effect
    h1Element.style.cursor = 'pointer';
    h1Element.classList.add('universal-hover');

    // Add click event listener to redirect to dashboard
    h1Element.addEventListener('click', function() {
      window.location.href = 'SO_DashBoard.html';
    });
  }
}

// Header sections navigation functionality
function initializeHeaderNavigation() {
  const headerSections = document.querySelectorAll('.header-section');
  
  headerSections.forEach((section, index) => {
    const headerText = section.querySelector('h3');
    if (headerText) {
      const text = headerText.textContent.trim();
      
      // Add click event listener based on section content
      section.addEventListener('click', function() {
        switch(text) {
          case 'My Sessions':
            window.location.href = 'SO_YourSessions.html';
            break;
          case 'Browse Sessions':
            window.location.href = '/browse-sessions';
            break;
          case 'Create Post':
            window.location.href = '/create-post';
            break;
          default:
            console.log('Unknown header section clicked:', text);
        }
      });
    }
  });
}

// Login form functionality
function initializeLoginForm() {
  const loginForm = document.querySelector('form.login-form[action="/login"]');
  const errorLabel = document.querySelector('#login-error');
  const schoolKey = getSelectedSchoolKey();
  const schoolConfig = getSchoolConfig(schoolKey);

  const showError = (message, color) => {
    if (errorLabel) {
      errorLabel.textContent = message;
      errorLabel.style.color = color || '#b00020';
    }
  };

  const queryError = new URLSearchParams(window.location.search).get('error');
  if (queryError === 'domain') {
    showError(`Please use your ${schoolConfig.emailDomain} school email.`);
  } else if (queryError === 'missing') {
    showError('Please enter both username and password');
  } else if (queryError === 'auth') {
    showError('Please log in with your school email to access this page.');
  } else if (new URLSearchParams(window.location.search).get('signup') === 'success') {
    showError('Sign up complete. Please log in.', '#1b5e20');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      // Get the input values
      const username = loginForm.querySelector('#username').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      // Validate username and password
      if (!username.trim() || !password.trim()) {
        e.preventDefault();
        showError('Please enter both username and password');
        return;
      }

      if (!username.toLowerCase().endsWith(schoolConfig.emailDomain)) {
        e.preventDefault();
        showError(`Email must end with ${schoolConfig.emailDomain}`);
        return;
      }
    });
  }
}

function initializeSignupActions() {
  const schoolKey = getSelectedSchoolKey();
  const schoolConfig = getSchoolConfig(schoolKey);
  const goToSchoolSelector = () => {
    window.localStorage.removeItem('selectedSchool');
    window.location.href = '/SO_SelectSchoolPage.html';
  };

  const signUpButton = document.querySelector('#sign-up-button');
  if (signUpButton) {
    signUpButton.addEventListener('click', function() {
      window.location.href = `/signup?school=${schoolKey}`;
    });
  }

  const backToLoginButton = document.querySelector('#back-to-login-button');
  if (backToLoginButton) {
    backToLoginButton.addEventListener('click', function() {
      window.location.href = `/SO_SignOnPage.html?school=${schoolKey}`;
    });
  }

  const changeSchoolButton = document.querySelector('#change-school-button');
  if (changeSchoolButton) {
    changeSchoolButton.addEventListener('click', goToSchoolSelector);
  }

  const changeSchoolButtonSignup = document.querySelector('#change-school-button-signup');
  if (changeSchoolButtonSignup) {
    changeSchoolButtonSignup.addEventListener('click', goToSchoolSelector);
  }

  const signupForm = document.querySelector('#signup-form');
  const signupError = document.querySelector('#signup-error');
  if (!signupForm || !signupError) {
    return;
  }

  const showSignupError = (message) => {
    signupError.textContent = message;
    signupError.style.color = '#b00020';
  };

  const signupStatus = new URLSearchParams(window.location.search).get('error');
  if (signupStatus === 'domain') {
    showSignupError(`Use a valid ${schoolConfig.emailDomain} email.`);
  } else if (signupStatus === 'mismatch') {
    showSignupError('Passwords do not match.');
  } else if (signupStatus === 'missing') {
    showSignupError('Please complete all required fields.');
  }

  signupForm.addEventListener('submit', function(event) {
    const school = document.querySelector('#signup-school').value;
    const firstName = document.querySelector('#signup-first-name').value.trim();
    const lastName = document.querySelector('#signup-last-name').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value;
    const confirmPassword = document.querySelector('#signup-confirm-password').value;
    const status = document.querySelector('#signup-status').value;
    const gradYear = document.querySelector('#signup-grad-year').value.trim();
    const birthday = document.querySelector('#signup-birthday').value;
    const gender = document.querySelector('#signup-gender').value;

    if (!school || !firstName || !lastName || !status || !gradYear || !birthday || !gender) {
      event.preventDefault();
      showSignupError('Please complete all required fields.');
      return;
    }

    if (!email.toLowerCase().endsWith(getSchoolConfig(school).emailDomain)) {
      event.preventDefault();
      showSignupError(`Use a valid ${getSchoolConfig(school).emailDomain} email.`);
      return;
    }

    if (!password || !confirmPassword) {
      event.preventDefault();
      showSignupError('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      event.preventDefault();
      showSignupError('Passwords do not match.');
    }
  });
}

function initializeJoinSessionButtons() {
  const joinButtons = document.querySelectorAll('.join-btn');
  if (!joinButtons.length) {
    return;
  }

  joinButtons.forEach((button) => {
    if (button.dataset.joinBound === 'true') {
      return;
    }

    button.dataset.joinBound = 'true';
    button.addEventListener('click', function() {
      window.location.href = '/join-session';
    });
  });
}

function humanizeValue(value) {
  if (!value) {
    return '';
  }

  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSessionCard(session) {
  const card = document.createElement('div');
  card.className = 'session-card';
  card.dataset.sessionId = String(session.id);
  card.innerHTML = `
    <div class="session-header">
      <h4>${escapeHtml(session.sessionTitle)}</h4>
      <span class="course-tag">${escapeHtml(humanizeValue(session.topic))} | ${escapeHtml(session.courseCode)}</span>
    </div>
    <div class="session-details">
      <div class="detail-item">
        <span class="icon">🕐</span>
        <span>${escapeHtml(session.sessionDate)} ${escapeHtml(session.sessionTime)}</span>
      </div>
      <div class="detail-item">
        <span class="icon">📍</span>
        <span>${escapeHtml(humanizeValue(session.sessionLocation))}</span>
      </div>
      <div class="detail-item">
        <span class="icon">👥</span>
        <span>1/${escapeHtml(humanizeValue(session.maxParticipants))}</span>
      </div>
      <div class="detail-item">
        <span class="icon">🎯</span>
        <span>${escapeHtml(humanizeValue(session.difficultyLevel))} | Host: ${escapeHtml(session.userName)}</span>
      </div>
      <div class="detail-item">
        <span class="icon">📝</span>
        <span>${escapeHtml(session.sessionDescription)}</span>
      </div>
    </div>
    <div class="session-footer">
      <button class="delete-session-btn">Delete Session</button>
      <button class="join-btn">Join Session</button>
    </div>
  `;

  return card;
}

function initializeDeleteSessionButtons() {
  const deleteButtons = document.querySelectorAll('.delete-session-btn');
  if (!deleteButtons.length) {
    return;
  }

  deleteButtons.forEach((button) => {
    if (button.dataset.deleteBound === 'true') {
      return;
    }

    button.dataset.deleteBound = 'true';
    button.addEventListener('click', async function() {
      const sessionCard = button.closest('.session-card');
      if (!sessionCard || !sessionCard.dataset.sessionId) {
        return;
      }

      const sessionId = sessionCard.dataset.sessionId;

      try {
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          alert('Unable to delete session.');
          return;
        }

        sessionCard.remove();
      } catch (error) {
        console.error('Unable to delete session:', error);
        alert('Unable to delete session right now. Try again.');
      }
    });
  });
}

async function loadCreatedSessions() {
  const sessionsGrid = document.querySelector('.sessions-grid');
  if (!sessionsGrid) {
    return;
  }

  try {
    const response = await fetch('/api/sessions');
    if (!response.ok) {
      return;
    }

    const sessions = await response.json();
    if (!Array.isArray(sessions) || !sessions.length) {
      return;
    }

    sessions.forEach((session) => {
      const sessionCard = buildSessionCard(session);
      sessionsGrid.prepend(sessionCard);
    });

    initializeJoinSessionButtons();
    initializeDeleteSessionButtons();
  } catch (error) {
    console.error('Unable to load created sessions:', error);
  }
}

function initializeCreatePostForm() {
  const createPostForm = document.querySelector('#create-post-form');
  if (!createPostForm) {
    return;
  }

  createPostForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const sessionDescription = document.querySelector('#session-description').value.trim();
    if (sessionDescription.length < 50) {
      alert('Additional information must be at least 50 characters.');
      return;
    }

    const payload = {
      userName: document.querySelector('#user-name').value.trim(),
      topic: document.querySelector('#topic-select').value,
      courseCode: document.querySelector('#course-code').value.trim(),
      sessionTitle: document.querySelector('#session-title').value.trim(),
      sessionDate: document.querySelector('#session-date').value,
      sessionTime: document.querySelector('#session-time').value,
      sessionLocation: document.querySelector('#session-location').value,
      maxParticipants: document.querySelector('#max-participants').value,
      difficultyLevel: document.querySelector('#difficulty-level').value,
      sessionDescription: sessionDescription
    };

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody && errorBody.error ? errorBody.error : 'Unable to create session.';
        alert(message);
        return;
      }

      window.location.href = '/browse-sessions';
    } catch (error) {
      console.error('Unable to create session:', error);
      alert('Unable to create session right now. Try again.');
    }
  });
}

function initializeDashboardButtons() {
  const createPostCard = document.querySelector('.small-boxes.left');
  const browseSessionsCard = document.querySelector('.small-boxes.right');

  if (createPostCard) {
    createPostCard.addEventListener('click', function() {
      window.location.href = '/create-post';
    });
  }

  if (browseSessionsCard) {
    browseSessionsCard.addEventListener('click', function() {
      window.location.href = '/browse-sessions';
    });
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSchoolSelectorPage();
  applySchoolBranding();
  initializeSchoolFooter();
  initializeH1Navigation();
  initializeHeaderNavigation();
  initializeLoginForm();
  initializeSignupActions();
  initializeJoinSessionButtons();
  initializeDashboardButtons();
  initializeCreatePostForm();
  loadCreatedSessions();
});
