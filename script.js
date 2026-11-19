const links = Array.from(document.querySelectorAll('.nav-links a'));
const sections = links.map(link => document.querySelector(link.hash));

function updateNavigation() {
  const readingLine = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2;
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  let current = -1;

  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= readingLine) current = index;
  });
  if (atBottom) current = sections.length - 1;

  links.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('pageshow', updateNavigation);
updateNavigation();
