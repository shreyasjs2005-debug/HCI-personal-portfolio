const links = Array.from(document.querySelectorAll('.nav-links a'));
const sections = links.map(link => document.querySelector(link.hash));
const shortcuts = document.querySelector('.scroll-shortcuts');
const shortcutToggle = shortcuts.querySelector('summary');
const shortcutLinks = Array.from(shortcuts.querySelectorAll('a'));
const headline = document.querySelector('#hero-title');

function updateNavigation() {
  const readingLine = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
  document.querySelector('.scroll-progress').style.setProperty('--reading-progress', progress);
  const atBottom = scrollableHeight > 0 && window.scrollY >= scrollableHeight - 2;
  let current = -1;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) current = index;
  });
  if (atBottom) current = sections.length - 1;

  shortcuts.hidden = window.scrollY < 300;
  if (shortcuts.hidden) shortcuts.open = false;
  shortcutLinks[1].hidden = current < 1;
  shortcutLinks[2].hidden = current < 2;

  links.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('pageshow', updateNavigation);
updateNavigation();

const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
let selectedTheme;

try {
  selectedTheme = localStorage.getItem('portfolio-theme');
} catch {
  // A blocked storage API still allows the theme to change for this visit.
}

function applyTheme() {
  const theme = selectedTheme || (systemTheme.matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
}

themeToggle.addEventListener('click', () => {
  selectedTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme();

  try {
    localStorage.setItem('portfolio-theme', selectedTheme);
  } catch {
    // The current theme is already applied.
  }
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();
themeToggle.hidden = false;

const navigation = document.querySelector('.navigation');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const mobileLayout = window.matchMedia('(max-width: 680px)');

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  navLinks.hidden = mobileLayout.matches && !open;
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(navLinks.hidden);
});
navigation.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
links.forEach(link => {
  link.addEventListener('click', () => {
    if (!mobileLayout.matches) return;
    setMenuOpen(false);

    const section = document.querySelector(link.hash);
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  });
});
mobileLayout.addEventListener('change', () => setMenuOpen(false));
navigation.dataset.enhanced = '';
menuToggle.hidden = false;
setMenuOpen(false);

shortcutLinks.forEach(link => {
  link.addEventListener('click', () => {
    const heading = document.querySelector(link.hash).querySelector('h1, h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    shortcuts.open = false;
  });
});

function openMenuOnHover(trigger, region, setOpen) {
  trigger.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setOpen(true);
  });
  region.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') setOpen(false);
  });
}

openMenuOnHover(menuToggle, navigation, setMenuOpen);
openMenuOnHover(shortcutToggle, shortcuts, open => {
  shortcuts.open = open;
});

shortcuts.addEventListener('keydown', event => {
  if (event.key === 'Escape' && shortcuts.open) {
    shortcuts.open = false;
    shortcutToggle.focus();
  }
});

function animateHeadline() {
  // Keep the full headline available to screen readers and reserve its layout.
  const visualHeadline = document.createElement('span');
  visualHeadline.setAttribute('aria-hidden', 'true');
  const accessibleText = Array.from(headline.childNodes, node => node.textContent).join(' ');
  headline.setAttribute('aria-label', accessibleText.replace(/\s+/g, ' ').trim());
  visualHeadline.append(...headline.childNodes);

  const walker = document.createTreeWalker(visualHeadline, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let characterIndex = 0;
  textNodes.forEach(node => {
    const characters = document.createDocumentFragment();
    for (const character of node.textContent) {
      if (character === ' ') {
        characters.append(character);
        continue;
      }
      const letter = document.createElement('span');
      letter.className = 'headline-char';
      letter.style.setProperty('--type-delay', `${characterIndex * 33}ms`);
      letter.textContent = character;
      characters.append(letter);
      characterIndex += 1;
    }
    node.replaceWith(characters);
  });
  headline.append(visualHeadline);
  return characterIndex * 33 + 40;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const roleLine = document.querySelector('.hero-role');
const roleText = roleLine.querySelector('.role-text');
const roles = ['Computer Science Student', 'Web Developer', 'Problem Solver'];

let roleTimer;
let roleIndex = 0;
let typedLength = 0;
let deletingRole = false;

function cycleRoles() {
  roleLine.classList.add('is-typing');
  const role = roles[roleIndex];
  typedLength += deletingRole ? -1 : 1;
  roleText.textContent = role.slice(0, typedLength);

  let delay = deletingRole ? 40 : 65;
  if (!deletingRole && typedLength === role.length) {
    deletingRole = true;
    delay = 1400;
  } else if (deletingRole && typedLength === 0) {
    deletingRole = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 250;
  }
  roleTimer = window.setTimeout(cycleRoles, delay);
}

function updateRoleMotion(delay = 0) {
  window.clearTimeout(roleTimer);
  if (reducedMotion.matches) {
    roleLine.classList.remove('is-typing');
    return;
  }
  roleTimer = window.setTimeout(cycleRoles, delay);
}

if (!reducedMotion.matches) updateRoleMotion(animateHeadline());
reducedMotion.addEventListener('change', () => updateRoleMotion());

const cursorRing = document.querySelector('.cursor-ring');
const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');

function hideCursorRing() {
  cursorRing.hidden = true;
}

window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) {
    hideCursorRing();
    return;
  }
  cursorRing.style.setProperty('--cursor-x', `${event.clientX}px`);
  cursorRing.style.setProperty('--cursor-y', `${event.clientY}px`);
  cursorRing.classList.toggle('is-over-control', Boolean(event.target.closest('a, button, summary')));
  cursorRing.hidden = false;
}, { passive: true });

document.documentElement.addEventListener('pointerleave', hideCursorRing);
window.addEventListener('blur', hideCursorRing);
finePointer.addEventListener('change', hideCursorRing);
reducedMotion.addEventListener('change', hideCursorRing);
