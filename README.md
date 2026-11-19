# Shreyas Jingade | Responsive Portfolio

## Project overview

I built this single-page portfolio for my Human–Computer Interaction (HCI) lab at BINUS University International. It introduces me as a Computer Science student and highlights my Java Supermarket Finding List, a final project for Data Structures and Object-Oriented Programming.

[View the live portfolio](https://shreyasjs2005-debug.github.io/HCI-personal-portfolio/)

## Purpose and audience

I wanted to practice responsive web design and present my coursework in a way classmates, lecturers, and prospective recruiters can browse on a phone or computer.

## Design and page layout

I used separate Figma layouts for [desktop](https://www.figma.com/design/HDX137r6z3EeWP8JXfeiDX?node-id=3-2) and [mobile](https://www.figma.com/design/ekrxo9BxkTnwsfmW3kyw4i?node-id=2-2) to plan how the portfolio would adapt to different screen sizes.

| Section | Content |
| --- | --- |
| Home | My portrait, introduction, animated tagline, and areas of interest |
| About | My background and what I’m learning in software development |
| Experience | My Java project and how it applied data structures and OOP |
| Contact | A direct email link |

## How I built it

- **HTML** defines the page sections, navigation, and content.
- **CSS** uses Flexbox, Grid, and media queries to adapt the layout for desktop, tablet, and mobile. CSS variables define the light and dark palettes.
- **JavaScript** handles theme switching, the mobile menu, scroll tracking, and the typing animation.

On narrow screens, the hamburger menu expands the header and moves the portrait down. The bottom-right arrow opens shortcuts to earlier sections. Both menus support mouse hover and touch. The site also follows the device’s reduced-motion preference by showing static hero text and a still gradient.

## Run locally

```bash
git clone https://github.com/shreyasjs2005-debug/HCI-personal-portfolio.git
cd HCI-personal-portfolio
```

Open `index.html` in your browser, or open the folder in VS Code and launch `index.html` with Live Server.

## Repository structure

```text
HCI-personal-portfolio/
├── index.html
├── style.css
├── script.js
├── images/
│   └── shreyas.jpg
└── README.md
```
