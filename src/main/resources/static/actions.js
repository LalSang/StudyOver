const APPSTATE_CONFIG = {
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
};

let currentUserContext = null;

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function normalizeLower(value) {
  return value ? value.toString().trim().toLowerCase() : '';
}

function toAppStateEmail(username) {
  const normalized = username ? username.toString().trim() : '';
  if (!normalized) {
    return '';
  }

  if (/@appstate\.edu$/i.test(normalized)) {
    return normalized.toLowerCase();
  }

  const localPart = normalized.split('@')[0] || normalized;
  return `${localPart}@appstate.edu`.toLowerCase();
}

async function loadCurrentUserContext() {
  try {
    const response = await fetch('/api/me', {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    const user = await response.json();
    currentUserContext = user;
    return user;
  } catch (error) {
    console.error('Unable to load current user context:', error);
    return null;
  }
}

function hasAdminAccess() {
  return normalizeLower(currentUserContext && currentUserContext.role) === 'admin';
}

function initializeReadOnlyUsernameDisplays() {
  const username = currentUserContext && currentUserContext.username
    ? currentUserContext.username.toString().trim()
    : '';

  const createPostUsernameInput = document.querySelector('#user-name');
  if (createPostUsernameInput) {
    if (username) {
      createPostUsernameInput.value = username;
    }
  }

  const createPostDisplayUsername = document.querySelector('#create-post-display-username');
  if (createPostDisplayUsername) {
    createPostDisplayUsername.textContent = username;
  }

  const appStateEmailInput = document.querySelector('#app-state-email');
  if (appStateEmailInput) {
    const appStateEmail = toAppStateEmail(username);
    if (appStateEmail) {
      appStateEmailInput.value = appStateEmail;
    }
  }
}

function canDeleteSession(session) {
  if (hasAdminAccess()) {
    return true;
  }

  const owner = normalizeLower(session && session.ownerUsername);
  const currentUsername = normalizeLower(currentUserContext && currentUserContext.username);
  return owner && currentUsername && owner === currentUsername;
}

class SchoolFooter {
  constructor(facts) {
    this.facts = facts;
    this.currentIndex = 0;
    this.displayDuration = 10000;
    this.fadeTime = 500;
  }

  initialize(footerElement) {
    if (!footerElement || !this.facts.length) {
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
  const footer = document.querySelector('footer');
  if (!footer) {
    return;
  }

  const schoolFooter = new SchoolFooter(APPSTATE_CONFIG.facts);
  schoolFooter.initialize(footer);
}

function applySchoolBranding() {
  const navTitle = 'Appalachian StudyOver';

  const appHeaders = document.querySelectorAll('header h1');
  appHeaders.forEach((header) => {
    header.textContent = navTitle;
  });

  const loginLogo = document.querySelector('#school-login-logo');
  if (loginLogo) {
    loginLogo.src = APPSTATE_CONFIG.logoPath;
    loginLogo.alt = `${APPSTATE_CONFIG.name} logo`;
  }

  const signupLogo = document.querySelector('#school-signup-logo');
  if (signupLogo) {
    signupLogo.src = APPSTATE_CONFIG.logoPath;
    signupLogo.alt = `${APPSTATE_CONFIG.name} logo`;
  }

  const officialSchoolInfoHeading = document.querySelector('.account-info-section h5');
  if (officialSchoolInfoHeading) {
    const badge = officialSchoolInfoHeading.querySelector('.readonly-badge');
    officialSchoolInfoHeading.textContent = `Official ${APPSTATE_CONFIG.name} Information`;
    if (badge) {
      officialSchoolInfoHeading.appendChild(document.createTextNode(' '));
      officialSchoolInfoHeading.appendChild(badge);
    }
  }

  const schoolEmailLabel = document.querySelector('label[for="app-state-email"]');
  if (schoolEmailLabel) {
    schoolEmailLabel.textContent = `${APPSTATE_CONFIG.name} Email`;
  }

  const schoolEmailInput = document.querySelector('#app-state-email');
  if (schoolEmailInput && /@appstate\.edu$/i.test(schoolEmailInput.value)) {
    const username = schoolEmailInput.value.split('@')[0] || 'student';
    schoolEmailInput.value = `${username}${APPSTATE_CONFIG.emailDomain}`;
  }
}

function initializeH1Navigation() {
  const h1Element = document.querySelector('header h1');
  const onSignInPage = document.querySelector('.login-form');
  if (h1Element && !onSignInPage) {
    h1Element.style.cursor = 'pointer';
    h1Element.classList.add('universal-hover');

    h1Element.addEventListener('click', function() {
      window.location.href = 'SO_DashBoard.html';
    });
  }
}

function initializeHeaderNavigation() {
  const headerSections = document.querySelectorAll('.header-section');

  headerSections.forEach((section) => {
    const headerText = section.querySelector('h3');
    if (headerText) {
      const text = headerText.textContent.trim();

      section.addEventListener('click', function() {
        switch (text) {
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

function initializeLoginForm() {
  const loginForm = document.querySelector('form.login-form[action="/login"]');
  const errorLabel = document.querySelector('#login-error');
  const query = getQueryParams();

  const showError = (message, color) => {
    if (errorLabel) {
      errorLabel.textContent = message;
      errorLabel.style.color = color || '#b00020';
    }
  };

  const queryError = query.get('error');
  if (queryError === 'invalid') {
    showError('Invalid username or password.');
  } else if (queryError === 'missing') {
    showError('Please enter both username and password');
  } else if (queryError === 'auth') {
    showError('Please log in to access this page.');
  } else if (query.get('signup') === 'success') {
    showError('Sign up complete. Please log in.', '#1b5e20');
  }

  const goToSignupButton = document.querySelector('#go-to-signup-button');
  if (goToSignupButton) {
    goToSignupButton.addEventListener('click', function() {
      window.location.href = '/signup';
    });
  }

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', function(e) {
    const username = loginForm.querySelector('#username').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (!username.trim() || !password.trim()) {
      e.preventDefault();
      showError('Please enter both username and password');
      return;
    }
  });
}

function initializeSignupActions() {
  const backToLoginButton = document.querySelector('#back-to-login-button');
  if (backToLoginButton) {
    backToLoginButton.addEventListener('click', function() {
      window.location.href = '/SO_SignOnPage.html';
    });
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

  const signupStatus = getQueryParams().get('error');
  if (signupStatus === 'domain') {
    showSignupError(`Use a valid ${APPSTATE_CONFIG.emailDomain} email.`);
  } else if (signupStatus === 'mismatch') {
    showSignupError('Passwords do not match.');
  } else if (signupStatus === 'missing') {
    showSignupError('Please complete all required fields.');
  }

  signupForm.addEventListener('submit', function(event) {
    const firstName = document.querySelector('#signup-first-name').value.trim();
    const lastName = document.querySelector('#signup-last-name').value.trim();
    const email = document.querySelector('#signup-email').value.trim();
    const password = document.querySelector('#signup-password').value;
    const confirmPassword = document.querySelector('#signup-confirm-password').value;
    const status = document.querySelector('#signup-status').value;
    const gradYear = document.querySelector('#signup-grad-year').value.trim();
    const birthday = document.querySelector('#signup-birthday').value;
    const gender = document.querySelector('#signup-gender').value;

    if (!firstName || !lastName || !status || !gradYear || !birthday || !gender) {
      event.preventDefault();
      showSignupError('Please complete all required fields.');
      return;
    }

    if (!email.toLowerCase().endsWith(APPSTATE_CONFIG.emailDomain)) {
      event.preventDefault();
      showSignupError(`Use a valid ${APPSTATE_CONFIG.emailDomain} email.`);
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

function initializeLogoutButtons() {
  const logoutButtons = document.querySelectorAll('.logout-btn');
  if (!logoutButtons.length) {
    return;
  }

  logoutButtons.forEach((button) => {
    button.addEventListener('click', function() {
      window.location.href = '/logout';
    });
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
  const hostUsername = session && session.userName && session.userName.toString().trim()
    ? session.userName.toString().trim()
    : 'Unknown';
  const deleteButtonMarkup = canDeleteSession(session)
    ? '<button class="delete-session-btn">End Session</button>'
    : '';
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
        <span class="detail-label">Time:</span>
        <span>${escapeHtml(session.sessionDate)} ${escapeHtml(session.sessionTime)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Location:</span>
        <span>${escapeHtml(humanizeValue(session.sessionLocation))}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Group:</span>
        <span>1/${escapeHtml(humanizeValue(session.maxParticipants))}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Host:</span>
        <span>${escapeHtml(hostUsername)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Details:</span>
        <span>${escapeHtml(session.sessionDescription)}</span>
      </div>
    </div>
    <div class="session-footer">
      ${deleteButtonMarkup}
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
      if (!sessionCard) {
        return;
      }

      const sessionId = sessionCard.dataset.sessionId;
      if (!sessionId) {
        // Fallback for static cards that are not backed by an API record.
        if (hasAdminAccess()) {
          sessionCard.remove();
        }
        return;
      }

      try {
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: 'DELETE'
        });

        if (response.status === 403) {
          alert('Only admins or the session creator can end this session.');
          return;
        }

        if (!response.ok) {
          alert('Unable to end session.');
          return;
        }

        sessionCard.remove();
      } catch (error) {
        console.error('Unable to end session:', error);
        alert('Unable to end session right now. Try again.');
      }
    });
  });
}

function ensureAdminCanEndAllVisibleSessions() {
  if (!hasAdminAccess()) {
    return;
  }

  const sessionCards = document.querySelectorAll('.sessions-grid .session-card');
  if (!sessionCards.length) {
    return;
  }

  sessionCards.forEach((card) => {
    const footer = card.querySelector('.session-footer');
    if (!footer) {
      return;
    }

    const existingDeleteButton = footer.querySelector('.delete-session-btn');
    if (existingDeleteButton) {
      existingDeleteButton.textContent = 'End Session';
      return;
    }

    const endButton = document.createElement('button');
    endButton.className = 'delete-session-btn';
    endButton.textContent = 'End Session';
    footer.insertBefore(endButton, footer.firstChild);
  });

  initializeDeleteSessionButtons();
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

    ensureAdminCanEndAllVisibleSessions();
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

    const userNameValue = document.querySelector('#user-name').value.trim();
    if (!userNameValue) {
      alert('Unable to find your username. Please log out and log back in.');
      return;
    }

    const sessionDescription = document.querySelector('#session-description').value.trim();
    if (sessionDescription.length < 50) {
      alert('Additional information must be at least 50 characters.');
      return;
    }

    const payload = {
      userName: userNameValue,
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

function initializeAdminControls() {
  const adminControls = document.querySelector('#admin-controls');
  if (!adminControls) {
    return;
  }

  if (!hasAdminAccess()) {
    adminControls.classList.remove('visible');
    return;
  }

  adminControls.classList.add('visible');

  const createUserForm = document.querySelector('#admin-create-user-form');
  const statusLabel = document.querySelector('#admin-create-user-status');
  if (!createUserForm || !statusLabel) {
    return;
  }

  const showStatus = (message, color) => {
    statusLabel.textContent = message;
    statusLabel.style.color = color || '#b00020';
  };

  createUserForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.querySelector('#admin-new-username').value.trim();
    const password = document.querySelector('#admin-new-password').value.trim();
    const role = document.querySelector('#admin-new-role').value;

    if (!username || !password || !role) {
      showStatus('Role, username, and password are required.');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          role
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody && errorBody.error ? errorBody.error : 'Unable to create account.';
        showStatus(message);
        return;
      }

      createUserForm.reset();
      showStatus('User account created.', '#1b5e20');
    } catch (error) {
      console.error('Unable to create user account:', error);
      showStatus('Unable to create account right now. Try again.');
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

document.addEventListener('DOMContentLoaded', async function() {
  const onLoginPage = Boolean(document.querySelector('form.login-form[action="/login"]'));
  const onSignupPage = Boolean(document.querySelector('#signup-form'));
  if (!onLoginPage && !onSignupPage) {
    await loadCurrentUserContext();
  }

  applySchoolBranding();
  initializeReadOnlyUsernameDisplays();
  initializeSchoolFooter();
  initializeH1Navigation();
  initializeHeaderNavigation();
  initializeLoginForm();
  initializeSignupActions();
  initializeAdminControls();
  initializeLogoutButtons();
  ensureAdminCanEndAllVisibleSessions();
  initializeJoinSessionButtons();
  initializeDashboardButtons();
  initializeCreatePostForm();
  await loadCreatedSessions();
});
