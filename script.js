// Preloader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".preloader").classList.add("hide");
  }, 2000);
});

// Custom Cursor
const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";

  setTimeout(() => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  }, 50);
});

// Cursor hover effects
document.querySelectorAll("a, button, .gallery-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "scale(2)";
    cursor.style.borderColor = "var(--gold)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "scale(1)";
  });
});

// Generate Particles
const particlesContainer = document.getElementById("particles");
for (let i = 0; i < 50; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDelay = Math.random() * 15 + "s";
  particle.style.animationDuration = Math.random() * 10 + 10 + "s";
  particlesContainer.appendChild(particle);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Parallax effect on scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroText = document.querySelector(".hero-text");
  const heroFrame = document.querySelector(".hero-frame");

  if (heroText) {
    heroText.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroText.style.opacity = 1 - scrolled / 600;
  }

  if (heroFrame) {
    heroFrame.style.transform = `rotateY(${scrolled * 0.1}deg)`;
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".service-card, .gallery-card, .about-content, .about-image"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });

// Gallery horizontal drag scroll
const galleryContainer = document.querySelector(".gallery-container");
let isDown = false;
let startX;
let scrollLeft;

galleryContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - galleryContainer.offsetLeft;
  scrollLeft = galleryContainer.scrollLeft;
  galleryContainer.style.cursor = "grabbing";
});

galleryContainer.addEventListener("mouseleave", () => {
  isDown = false;
  galleryContainer.style.cursor = "grab";
});

galleryContainer.addEventListener("mouseup", () => {
  isDown = false;
  galleryContainer.style.cursor = "grab";
});

galleryContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - galleryContainer.offsetLeft;
  const walk = (x - startX) * 2;
  galleryContainer.scrollLeft = scrollLeft - walk;
});

// Gallery Navigation Arrows
const galleryNavLeft = document.querySelector(".gallery-nav-left");
const galleryNavRight = document.querySelector(".gallery-nav-right");

galleryNavLeft.addEventListener("click", () => {
  galleryContainer.scrollBy({
    left: -300,
    behavior: "smooth",
  });
});

galleryNavRight.addEventListener("click", () => {
  galleryContainer.scrollBy({
    left: 300,
    behavior: "smooth",
  });
});

// Lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const galleryCards = document.querySelectorAll(".gallery-card");

let currentImageIndex = 0;
let allGalleryImages = []; // Store all images for lightbox navigation

// Initialize gallery images array
function initializeGalleryImages() {
  allGalleryImages = Array.from(galleryCards).map((card, index) => ({
    img: card.querySelector("img"),
    overlay: card.querySelector(".gallery-card-overlay"),
    index: index,
  }));
}

initializeGalleryImages();

galleryCards.forEach((card, index) => {
  const img = card.querySelector("img");
  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    currentImageIndex = index;
    openLightbox(index);
  });
});

function openLightbox(index) {
  const imageData = allGalleryImages[index];
  const overlay = imageData.overlay;
  const title = overlay.querySelector("h3").textContent;

  lightboxImage.src = imageData.img.src;
  lightboxImage.alt = imageData.img.alt;
  lightboxCaption.textContent = title;

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

lightboxPrev.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
  openLightbox(currentImageIndex);
});

lightboxNext.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % allGalleryImages.length;
  openLightbox(currentImageIndex);
});

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    lightboxPrev.click();
  } else if (e.key === "ArrowRight") {
    lightboxNext.click();
  }
});

// Full Gallery Modal
const fullGalleryModal = document.getElementById("fullGalleryModal");
const modalClose = document.querySelector(".modal-close");
const fullGalleryGrid = document.getElementById("fullGalleryGrid");
const viewMoreBtn = document.getElementById("viewMoreBtn");

// Populate full gallery
function populateFullGallery() {
  fullGalleryGrid.innerHTML = "";
  allGalleryImages.forEach((imageData, index) => {
    const overlay = imageData.overlay;
    const title = overlay.querySelector("h3").textContent;
    const category = overlay.querySelector("span").textContent;

    const galleryItem = document.createElement("div");
    galleryItem.className = "full-gallery-item";
    galleryItem.innerHTML = `
      <img src="${imageData.img.src}" alt="${imageData.img.alt}" />
      <div class="full-gallery-overlay">
        <span>${category}</span>
        <h4>${title}</h4>
      </div>
    `;

    galleryItem.addEventListener("click", () => {
      currentImageIndex = index;
      closeFullGallery();
      openLightbox(index);
    });

    fullGalleryGrid.appendChild(galleryItem);
  });
}

function openFullGallery() {
  populateFullGallery();
  fullGalleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeFullGallery() {
  fullGalleryModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Update button label with count
function updateViewMoreCount() {
  const count = allGalleryImages.length;
  viewMoreBtn.innerHTML = `View All ${count} Photos <i class="fas fa-arrow-right"></i>`;
}
updateViewMoreCount();

viewMoreBtn.addEventListener("click", openFullGallery);
modalClose.addEventListener("click", closeFullGallery);

fullGalleryModal.addEventListener("click", (e) => {
  if (e.target === fullGalleryModal) {
    closeFullGallery();
  }
});

// Contact Form Submission with mailto
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  // Build mailto link
  const mailtoLink =
    "mailto:msaaraha@gmail.com" +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    );

  // Open email app
  window.location.href = mailtoLink;

  // Optional: Show success message in the form
  const successHTML = `
    <div class="success-message show">
      <i class="fas fa-check-circle"></i>
      <h3>Message Ready!</h3>
      <p>Your email app has opened. Please click 'Send' to finish.</p>
    </div>
  `;

  contactForm.innerHTML = successHTML;
});

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "";
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Menu toggle animation
const style = document.createElement("style");
style.textContent = `
  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }
`;
document.head.appendChild(style);
// Touch swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // swipe left = next
      currentImageIndex = (currentImageIndex + 1) % allGalleryImages.length;
      openLightbox(currentImageIndex);
    } else {
      // swipe right = prev
      currentImageIndex = (currentImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
      openLightbox(currentImageIndex);
    }
  }
}, { passive: true });
