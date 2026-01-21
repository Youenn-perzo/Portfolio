// Header scroll effect & Menu Mobile (INCHANGÉ)
const header = document.getElementById("header")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) header.classList.add("scrolled")
  else header.classList.remove("scrolled")
})

const burgerBtn = document.getElementById("burgerBtn")
const navMobile = document.getElementById("navMobile")

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active")
  navMobile.classList.toggle("active")
})

document.querySelectorAll(".nav-link-mobile").forEach((link) => {
  link.addEventListener("click", () => {
    burgerBtn.classList.remove("active")
    navMobile.classList.remove("active")
  })
})

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) target.scrollIntoView({ behavior: "smooth" })
  })
})

// --- DONNÉES PHOTOS ---

// Fonction simplifiée : tout est maintenant en .webp
function getImages(folder, count) {
  let images = [];
  for (let i = 1; i <= count; i++) {
    images.push(`./images/${folder}/${i}.webp`);
  }
  return images;
}

const photoStacks = [
  // === LES NOUVELLES COLLECTIONS (Ordre identique au HTML) ===
  
  // Stack 0
  { 
    title: "Stretching Paris", 
    images: getImages("Stretching_paris", 11) 
  },
  
  // Stack 1
  { 
    title: "Bloom in Rennes", 
    images: getImages("Bloom_in_rennes", 13) 
  },

  // Stack 2
  { 
    title: "Supra", 
    images: getImages("Supra", 6) 
  },

  // Stack 3
  { 
    title: "Peugeot 103", 
    images: getImages("103", 9) 
  },

  // ... (les précédents sont ok) ...

  // Stack 4: MX5_nb (Majuscules importantes)
  { 
    title: "MX5 NB", 
    images: getImages("mx5nb", 4) 
  },

  // Stack 5: Opel_Corsa (Majuscules importantes)
  { 
    title: "Opel Corsa", 
    images: getImages("opelcorsa", 7) 
  },

  // ... (la suite est ok) ...

  // Stack 6
  { 
    title: "Enora", 
    images: getImages("Enora", 5) 
  },

  // === LES ANCIENNES COLLECTIONS (Déjà en webp) ===

  {
    title: "Drift spec miata",
    images: getImages("miata", 7) // J'ai utilisé la fonction ici aussi pour simplifier
  },
  {
    title: "Dream car",
    images: getImages("Dream_car", 5)
  },
  {
    title: "Ford mustang",
    images: getImages("Ford_mustang", 5)
  },
  {
    title: "HCS R34",
    images: getImages("r34", 5)
  },
  
  // === DOUBLONS (Si tu les as gardés en bas du HTML) ===
  {
    title: "Drift spec miata",
    images: getImages("miata", 7)
  },
  {
    title: "Dream car",
    images: getImages("Dream_car", 5)
  },
  {
    title: "Ford mustang",
    images: getImages("Ford_mustang", 5)
  },
  {
    title: "HCS R34",
    images: getImages("r34", 5)
  },
]

// --- VARIABLES LIGHTBOX ---
const lightbox = document.getElementById("photoLightbox")
const lightboxContent = document.getElementById("lightboxContent") // Attention, on va réécrire dedans
let currentStackIndex = 0
let currentImageIndex = 0

// --- FONCTION D'OUVERTURE ---
// --- FONCTION D'OUVERTURE AVEC DÉTECTION DE FORMAT ---
function openLightbox(stackIndex) {
  currentStackIndex = stackIndex % photoStacks.length
  currentImageIndex = 0
  
  const stack = photoStacks[currentStackIndex]
  const firstImageSrc = stack.images[0] // On regarde la 1ère image

  // On crée une image invisible pour lire ses vraies dimensions
  const tempImg = new Image()
  tempImg.src = firstImageSrc
  
  tempImg.onload = () => {
    // Une fois l'image chargée, on a ses dimensions
    const imgWidth = tempImg.naturalWidth
    const imgHeight = tempImg.naturalHeight
    
    // On calcule le ratio (ex: 1.5 pour du paysage, 0.8 pour du portrait)
    const ratio = imgWidth / imgHeight
    
    // On construit la modal
    buildModal()
    
    // --- C'EST ICI QUE LA MAGIE OPÈRE ---
    const modal = document.querySelector('.lightbox-modal')
    if(modal) {
      // On applique le ratio exact de l'image à la boîte
      modal.style.aspectRatio = `${ratio}`
    }
    
    // Affichage
    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
    
    // Mise à jour position initiale
    updateSlider()
  }
}

// --- CONSTRUCTION DU POPUP (MODAL) ---
function buildModal() {
  const stack = photoStacks[currentStackIndex]
  
  // On vide la lightbox pour mettre notre structure propre
  lightbox.innerHTML = ''
  
  // 1. Création de la BOÎTE (Modal)
  const modal = document.createElement('div')
  modal.className = 'lightbox-modal'
  
  // 2. Header (Titre + Close)
  const headerUi = document.createElement('div')
  headerUi.className = 'lightbox-header-ui'
  
  const title = document.createElement('h3')
  title.className = 'lightbox-title'
  title.textContent = stack.title
  
  const closeBtn = document.createElement('button')
  closeBtn.className = 'lightbox-close'
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
  closeBtn.onclick = closeLightboxModal
  
  headerUi.appendChild(title)
  headerUi.appendChild(closeBtn)
  
  // 3. Zone Contenu (Track + Slides)
  const contentArea = document.createElement('div')
  contentArea.className = 'lightbox-content'
  
  const track = document.createElement('div')
  track.className = 'lightbox-track'
  track.id = 'sliderTrack'
  
  stack.images.forEach(imgSrc => {
    const slide = document.createElement('div')
    slide.className = 'lightbox-slide'
    const img = document.createElement('img')
    img.src = imgSrc
    img.className = 'lightbox-image'
    slide.appendChild(img)
    track.appendChild(slide)
  })
  
  contentArea.appendChild(track)
  
  // 4. Boutons Navigation (Flèches)
  const prevBtn = document.createElement('button')
  prevBtn.className = 'lightbox-arrow lightbox-prev'
  prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>'
  prevBtn.onclick = prevImage
  
  const nextBtn = document.createElement('button')
  nextBtn.className = 'lightbox-arrow lightbox-next'
  nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>'
  nextBtn.onclick = nextImage
  
  // 5. Compteur
  const counter = document.createElement('div')
  counter.className = 'lightbox-counter'
  counter.id = 'lightboxCounter'
  counter.textContent = `1 / ${stack.images.length}`
  
  // Assemblage final
  modal.appendChild(headerUi)
  modal.appendChild(contentArea)
  modal.appendChild(prevBtn)
  modal.appendChild(nextBtn)
  modal.appendChild(counter)
  
  lightbox.appendChild(modal)
}

// --- LOGIQUE DU MOUVEMENT ---
function updateSlider() {
  const track = document.getElementById('sliderTrack')
  const counter = document.getElementById('lightboxCounter')
  const stack = photoStacks[currentStackIndex]
  
  if(track) {
    track.style.transform = `translateX(-${currentImageIndex * 100}%)`
  }
  
  if(counter) {
    counter.textContent = `${currentImageIndex + 1} / ${stack.images.length}`
  }
}

function nextImage(e) {
  if(e) e.stopPropagation()
  const stack = photoStacks[currentStackIndex]
  currentImageIndex = (currentImageIndex + 1) % stack.images.length
  updateSlider()
}

function prevImage(e) {
  if(e) e.stopPropagation()
  const stack = photoStacks[currentStackIndex]
  currentImageIndex = (currentImageIndex - 1 + stack.images.length) % stack.images.length
  updateSlider()
}

function closeLightboxModal() {
  lightbox.classList.remove("active")
  document.body.style.overflow = ""
}

// Event Listeners globaux
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightboxModal() // Ferme si on clique en dehors de la boîte
})

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("active")) {
    if (e.key === "Escape") closeLightboxModal()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }
})

document.querySelectorAll(".photo-stack").forEach((stack) => {
  stack.addEventListener("click", () => {
    const stackIndex = Number.parseInt(stack.dataset.stack)
    openLightbox(stackIndex)
  })
})

// --- CAROUSEL VIDEO (Inchangé) ---
const videoCarousel = document.getElementById("videoCarousel")
const videoTrack = document.getElementById("videoTrack")
let videoScrollPosition = 0
let videoIsPaused = false

function animateVideoCarousel() {
  if (!videoIsPaused && videoTrack && videoCarousel) {
    videoScrollPosition += 0.8
    if (videoScrollPosition >= videoTrack.scrollWidth / 2) {
      videoScrollPosition = 0
    }
    videoCarousel.scrollLeft = videoScrollPosition
  }
  requestAnimationFrame(animateVideoCarousel)
}

if (videoCarousel) {
    videoCarousel.addEventListener("mouseenter", () => { videoIsPaused = true })
    videoCarousel.addEventListener("mouseleave", () => { videoIsPaused = false })
    requestAnimationFrame(animateVideoCarousel)
}

// --- ANIMATIONS SKILLS & SPEEDO (Inchangé) ---
// (J'ai condensé pour gagner de la place, ça marche pareil)
const skillBars = document.querySelectorAll(".skill-progress")
const speedometerCards = document.querySelectorAll(".speedometer-card")
let skillsAnimated = false, speedometersAnimated = false

window.addEventListener("scroll", () => {
  const skillsSection = document.getElementById("skills")
  if (!skillsSection) return
  const sectionTop = skillsSection.getBoundingClientRect().top
  const windowHeight = window.innerHeight

  if (sectionTop < windowHeight * 0.8) {
    if(!skillsAnimated) {
       skillBars.forEach(bar => {
         const w = bar.style.width; bar.style.width = "0%";
         setTimeout(() => bar.style.width = w, 100)
       }); skillsAnimated = true;
    }
    if(!speedometersAnimated) {
       speedometerCards.forEach((card, i) => {
         const val = parseInt(card.dataset.skill)
         setTimeout(() => {
           card.querySelector(".speedometer-fill").style.strokeDashoffset = 251 - (251 * val) / 100
           card.querySelector(".speedometer-needle").style.transform = `rotate(${-90 + (180 * val) / 100}deg)`
         }, i * 150)
       }); speedometersAnimated = true;
    }
  }
})
