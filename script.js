// Header scroll effect
const header = document.getElementById("header")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Mobile menu toggle
const burgerBtn = document.getElementById("burgerBtn")
const navMobile = document.getElementById("navMobile")

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active")
  navMobile.classList.toggle("active")
})

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-link-mobile").forEach((link) => {
  link.addEventListener("click", () => {
    burgerBtn.classList.remove("active")
    navMobile.classList.remove("active")
  })
})

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      })
    }
  })
})

const photoStacks = [
  {
    title: "Miata",
    images: [
      "./images/miata/7.webp",
      "./images/miata/2.webp",
      "./images/miata/3.webp",
      "./images/miata/4.webp",
      "./images/miata/5.webp",
      "./images/miata/6.webp",
      "./images/miata/1.webp",
    ],
  },
  {
    title: "Dream car",
    images: [
      "./images/Dream_car/1.webp",
      "./images/Dream_car/2.webp",
      "./images/Dream_car/3.webp",
      "./images/Dream_car/4.webp",
      "./images/Dream_car/5.webp",
    ],
  },
  {
    title: "Ford mustang",
    images: [
      "./images/Ford_mustang/1.webp",
      "./images/Ford_mustang/2.webp",
      "./images/Ford_mustang/3.webp",
      "./images/Ford_mustang/4.webp",
      "./images/Ford_mustang/5.webp",
    ],
  },
  {
    title: "R34",
    images: [
      "./images/r34/1.webp",
      "./images/r34/2.webp",
      "./images/r34/3.webp",
      "./images/r34/4.webp",
      "./images/r34/5.webp",
    ],
  },
]

const lightbox = document.getElementById("photoLightbox")
const lightboxContent = document.getElementById("lightboxContent")
const lightboxTitle = document.querySelector(".lightbox-title")
const lightboxCounter = document.getElementById("lightboxCounter")
const closeLightbox = document.getElementById("closeLightbox")
const lightboxPrev = document.getElementById("lightboxPrev")
const lightboxNext = document.getElementById("lightboxNext")

let currentStackIndex = 0
let currentImageIndex = 0

function openLightbox(stackIndex) {
  currentStackIndex = stackIndex % photoStacks.length
  currentImageIndex = 0

  const clickedStack = document.querySelector(`.photo-stack[data-stack="${stackIndex}"]`)

  if (!clickedStack) {
    updateLightbox()
    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
    return
  }

  // Récupérer les cartes de la pile
  const cards = clickedStack.querySelectorAll(".stack-card")
  const stackRect = clickedStack.getBoundingClientRect()
  const stack = photoStacks[currentStackIndex]

  // Créer l'overlay
  const overlay = document.createElement("div")
  overlay.className = "fly-overlay"
  document.body.appendChild(overlay)

  // Créer le titre
  const title = document.createElement("div")
  title.className = "fly-title"
  title.textContent = stack.title
  title.style.bottom = "15%"
  document.body.appendChild(title)

  // Calculer la position centrale et taille finale
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const finalWidth = Math.min(300, viewportWidth * 0.7)
  const finalHeight = finalWidth * (1350 / 1080) // Format Instagram
  const centerX = (viewportWidth - finalWidth) / 2
  const centerY = (viewportHeight - finalHeight) / 2 - 30

  // Créer les cartes volantes
  const flyingCards = []

  cards.forEach((card, index) => {
    const img = card.querySelector("img")
    const cardRect = card.getBoundingClientRect()

    const flyingCard = document.createElement("div")
    flyingCard.className = "flying-card"
    flyingCard.style.width = `${cardRect.width}px`
    flyingCard.style.height = `${cardRect.height}px`
    flyingCard.style.left = `${cardRect.left}px`
    flyingCard.style.top = `${cardRect.top}px`
    flyingCard.style.zIndex = 1000 + (cards.length - index)

    const imgClone = document.createElement("img")
    imgClone.src = img.src
    imgClone.alt = img.alt
    flyingCard.appendChild(imgClone)

    document.body.appendChild(flyingCard)
    flyingCards.push(flyingCard)
  })

  // Cacher la pile originale
  clickedStack.style.opacity = "0"

  // Activer l'overlay
  requestAnimationFrame(() => {
    overlay.classList.add("active")

    // Animer les cartes vers le centre en pile
    flyingCards.forEach((card, index) => {
      const offset = index * 4
      const scale = 1 - index * 0.02

      card.style.width = `${finalWidth}px`
      card.style.height = `${finalHeight}px`
      card.style.left = `${centerX + offset}px`
      card.style.top = `${centerY - offset}px`
      card.style.transform = `rotate(0deg) scale(${scale})`
      card.style.transitionDelay = `${index * 0.05}s`
    })

    // Afficher le titre
    setTimeout(() => {
      title.classList.add("visible")
    }, 400)

    // Ouvrir la lightbox après l'animation
    setTimeout(() => {
      // Nettoyer les éléments d'animation
      flyingCards.forEach((card) => card.remove())
      overlay.remove()
      title.remove()
      clickedStack.style.opacity = "1"

      // Ouvrir la vraie lightbox
      updateLightbox()
      lightbox.classList.add("active")
      document.body.style.overflow = "hidden"
    }, 1400)
  })
}

function updateLightbox() {
  const stack = photoStacks[currentStackIndex]
  lightboxTitle.textContent = stack.title
  lightboxContent.innerHTML = `<img src="${stack.images[currentImageIndex]}" alt="${stack.title}" class="lightbox-image">`
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${stack.images.length}`
}

function closeLightboxModal() {
  lightbox.classList.remove("active")
  document.body.style.overflow = ""
}

function nextImage() {
  const stack = photoStacks[currentStackIndex]
  currentImageIndex = (currentImageIndex + 1) % stack.images.length
  updateLightbox()
}

function prevImage() {
  const stack = photoStacks[currentStackIndex]
  currentImageIndex = (currentImageIndex - 1 + stack.images.length) % stack.images.length
  updateLightbox()
}

// Event listeners for lightbox
closeLightbox.addEventListener("click", closeLightboxModal)
lightboxNext.addEventListener("click", nextImage)
lightboxPrev.addEventListener("click", prevImage)

// Close on escape key
document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("active")) {
    if (e.key === "Escape") closeLightboxModal()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }
})

// Close on backdrop click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxContent) {
    closeLightboxModal()
  }
})

// Add click listeners to photo stacks
document.querySelectorAll(".photo-stack").forEach((stack) => {
  stack.addEventListener("click", () => {
    const stackIndex = Number.parseInt(stack.dataset.stack)
    openLightbox(stackIndex)
  })
})

// Infinite carousel for videos
const videoCarousel = document.getElementById("videoCarousel")
const videoTrack = document.getElementById("videoTrack")
let videoScrollPosition = 0
let videoAnimationId
const videoSpeed = 0.8
let videoIsPaused = false

function animateVideoCarousel() {
  if (!videoIsPaused) {
    videoScrollPosition += videoSpeed

    // Reset when we've scrolled through half (the original items)
    if (videoScrollPosition >= videoTrack.scrollWidth / 2) {
      videoScrollPosition = 0
    }

    videoCarousel.scrollLeft = videoScrollPosition
  }
  videoAnimationId = requestAnimationFrame(animateVideoCarousel)
}

videoCarousel.addEventListener("mouseenter", () => {
  videoIsPaused = true
})

videoCarousel.addEventListener("mouseleave", () => {
  videoIsPaused = false
})

// Start video carousel animation
videoAnimationId = requestAnimationFrame(animateVideoCarousel)

// Skill bars animation on scroll
const skillBars = document.querySelectorAll(".skill-progress")
let skillsAnimated = false

function animateSkillBars() {
  const skillsSection = document.getElementById("skills")
  const sectionTop = skillsSection.getBoundingClientRect().top
  const windowHeight = window.innerHeight

  if (sectionTop < windowHeight * 0.8 && !skillsAnimated) {
    skillBars.forEach((bar) => {
      const width = bar.style.width
      bar.style.width = "0%"
      setTimeout(() => {
        bar.style.width = width
      }, 100)
    })
    skillsAnimated = true
  }
}

window.addEventListener("scroll", animateSkillBars)
// Initial check
animateSkillBars()

const speedometerCards = document.querySelectorAll(".speedometer-card")
let speedometersAnimated = false

function animateSpeedometers() {
  const skillsSection = document.getElementById("skills")
  if (!skillsSection) return

  const sectionTop = skillsSection.getBoundingClientRect().top
  const windowHeight = window.innerHeight

  if (sectionTop < windowHeight * 0.8 && !speedometersAnimated) {
    speedometerCards.forEach((card, index) => {
      const skillValue = Number.parseInt(card.dataset.skill)
      const fill = card.querySelector(".speedometer-fill")
      const needle = card.querySelector(".speedometer-needle")

      // Calculer le stroke-dashoffset (251 est la longueur totale de l'arc)
      const dashOffset = 251 - (251 * skillValue) / 100

      // Calculer l'angle de l'aiguille (-90deg = 0%, 90deg = 100%)
      const needleAngle = -90 + (180 * skillValue) / 100

      // Appliquer avec un délai pour chaque carte
      setTimeout(() => {
        fill.style.strokeDashoffset = dashOffset
        needle.style.transform = `rotate(${needleAngle}deg)`
      }, index * 150)
    })
    speedometersAnimated = true
  }
}

window.addEventListener("scroll", animateSpeedometers)
// Initial check
animateSpeedometers()
