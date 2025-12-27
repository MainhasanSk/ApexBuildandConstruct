// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit, serverTimestamp } 
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsaM1XDG9gcYg79S8CSl83OCuqqloIzB0",
  authDomain: "apex-building-67412.firebaseapp.com",
  projectId: "apex-building-67412",
  storageBucket: "apex-building-67412.firebasestorage.app",
  messagingSenderId: "387820864534",
  appId: "1:387820864534:web:f82c133862f69c1aee6137",
  measurementId: "G-81B31CF4XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== WHATSAPP CONFIGURATION =====
const WHATSAPP_NUMBER = "919957852523"; // Your WhatsApp number

// ===== WHATSAPP SEND FUNCTIONS =====

// Send Estimate to WhatsApp
window.sendToWhatsApp = function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim() || 'Not specified';
    const plotSize = document.getElementById('plotSize').value.trim() || 'Not specified';
    const serviceType = document.getElementById('serviceType').value;

    // Validation
    if (!name || !phone || !serviceType) {
        alert('⚠️ Please fill all required fields!');
        return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('⚠️ Please enter a valid 10-digit phone number!');
        return;
    }

    // Format WhatsApp message
    const message = `
🏗️ *Free Estimate Request - APEX Build and Construct*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Location:* ${location}
📐 *Plot Size:* ${plotSize} Sq.Ft

🔧 *Service Type:* ${serviceType}

📅 *Date:* ${new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
})}

_I'm interested in getting a free estimate for my construction project. Please contact me with more details!_
    `.trim();

    // Encode and create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    setTimeout(() => {
        alert('✅ Opening WhatsApp... Please send the pre-filled message!');
        
        // Reset form and close modal
        document.getElementById('estimateForm').reset();
        closeEstimateModal();
    }, 500);
};

// Send Quote Request to WhatsApp (for Services page)
window.sendQuoteToWhatsApp = function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('quoteName').value.trim();
    const phone = document.getElementById('quotePhone').value.trim();
    const location = document.getElementById('quoteLocation').value.trim();
    const service = document.getElementById('quoteService').value;
    const budget = document.getElementById('quoteBudget').value || 'Not specified';

    // Validation
    if (!name || !phone || !location) {
        alert('⚠️ Please fill all required fields!');
        return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('⚠️ Please enter a valid 10-digit phone number!');
        return;
    }

    // Format WhatsApp message
    const message = `
🏗️ *Service Quote Request - APEX Build and Construct*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Location:* ${location}

🔧 *Service Required:* ${service}
💰 *Budget:* ${budget}

📅 *Inquiry Date:* ${new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
})}

_Please provide me with a detailed quotation for the above service. Looking forward to working with APEX Build and Construct!_
    `.trim();

    // Encode and create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Show success message
    setTimeout(() => {
        alert('✅ Opening WhatsApp... Please send the pre-filled message!');
        
        // Reset form and close modal
        document.getElementById('quoteForm').reset();
        closeQuoteModal();
    }, 500);
};

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====

// Navigate to Service Page
window.navigateToService = function(serviceId) {
    const serviceMap = {
        'residential': '#service-residential',
        'commercial': '#service-commercial',
        'interior': '#service-interior',
        'renovation': '#service-renovation',
        'design': '#service-design',
        'loan': '#service-loan'
    };
    window.location.href = `services.html${serviceMap[serviceId] || ''}`;
};

// Open Quote Modal
window.openQuoteModal = function(serviceName) {
    const quoteModal = document.getElementById('quoteModal');
    const estimateModal = document.getElementById('estimateModal');
    
    if (quoteModal) {
        quoteModal.classList.add('active');
        quoteModal.style.display = 'flex';
        const quoteServiceField = document.getElementById('quoteService');
        if (quoteServiceField) {
            quoteServiceField.value = serviceName;
        }
        document.body.style.overflow = 'hidden';
    } else if (estimateModal) {
        estimateModal.classList.add('active');
        estimateModal.style.display = 'flex';
        const serviceTypeField = document.getElementById('serviceType');
        if (serviceTypeField) {
            const serviceOptions = {
                'Complete House Construction': 'Complete House Construction',
                'Commercial Construction': 'Commercial Construction',
                'Interior Design & Finishing': 'Interior Design',
                'Renovation & Remodeling': 'Renovation',
                'Architectural Design & AutoCAD Planning': 'Consultation',
                'Home Loan Assistance': 'Consultation'
            };
            serviceTypeField.value = serviceOptions[serviceName] || '';
        }
        document.body.style.overflow = 'hidden';
    }
};

// Close Quote Modal
window.closeQuoteModal = function() {
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) {
        quoteModal.classList.remove('active');
        setTimeout(() => {
            quoteModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
};

// Close Estimate Modal
window.closeEstimateModal = function() {
    const estimateModal = document.getElementById('estimateModal');
    if (estimateModal) {
        estimateModal.classList.remove('active');
        setTimeout(() => {
            estimateModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
};

// Open Estimate Modal
window.openEstimateModal = function() {
    const estimateModal = document.getElementById('estimateModal');
    if (estimateModal) {
        estimateModal.classList.add('active');
        estimateModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
    }
});

// ===== FIREBASE FUNCTIONS =====

// Load Ongoing Projects
async function loadOngoingProjects() {
    try {
        const projectsQuery = query(collection(db, 'ongoingProjects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(projectsQuery);
        const grid = document.getElementById('ongoingProjectsGrid');
        
        if (!grid) return;
        
        if (querySnapshot.empty) {
            grid.innerHTML = '<div class="loading">No ongoing projects at the moment.</div>';
            return;
        }

        grid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const projectCard = createProjectCard(project, 'ongoing');
            grid.innerHTML += projectCard;
        });
    } catch (error) {
        console.error('Error loading ongoing projects:', error);
        const grid = document.getElementById('ongoingProjectsGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading">Unable to load projects. Please try again later.</div>';
        }
    }
}

// Load Completed Projects
async function loadCompletedProjects() {
    try {
        const projectsQuery = query(collection(db, 'completedProjects'), orderBy('completedAt', 'desc'));
        const querySnapshot = await getDocs(projectsQuery);
        const grid = document.getElementById('completedProjectsGrid');
        
        if (!grid) return;
        
        if (querySnapshot.empty) {
            grid.innerHTML = '<div class="loading">Completed projects coming soon.</div>';
            return;
        }

        grid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const projectCard = createProjectCard(project, 'completed');
            grid.innerHTML += projectCard;
        });
    } catch (error) {
        console.error('Error loading completed projects:', error);
        const grid = document.getElementById('completedProjectsGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading">Unable to load projects. Please try again later.</div>';
        }
    }
}

// Create Project Card HTML
function createProjectCard(project, status) {
    return `
        <div class="project-card">
            <img src="${project.imageUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500'}" 
                 alt="${project.title}"
                 onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500'">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p><strong>Location:</strong> ${project.location}</p>
                ${project.area ? `<p><strong>Area:</strong> ${project.area}</p>` : ''}
                <span class="project-status status-${status}">
                    ${status === 'ongoing' ? 'In Progress' : 'Completed'}
                </span>
            </div>
        </div>
    `;
}

// Load Blog Posts
async function loadBlogPosts() {
    try {
        const blogsQuery = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'), limit(3));
        const querySnapshot = await getDocs(blogsQuery);
        const grid = document.getElementById('blogGrid');
        
        if (!grid) return;
        
        if (querySnapshot.empty) {
            grid.innerHTML = '<div class="loading">Blog posts coming soon.</div>';
            return;
        }

        grid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const blog = doc.data();
            const blogCard = createBlogCard(blog, doc.id);
            grid.innerHTML += blogCard;
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const grid = document.getElementById('blogGrid');
        if (grid) {
            grid.innerHTML = '<div class="loading">Unable to load blog posts. Please try again later.</div>';
        }
    }
}

// Create Blog Card HTML
function createBlogCard(blog, id) {
    const date = blog.publishedAt ? new Date(blog.publishedAt.seconds * 1000).toLocaleDateString() : 'Recent';
    return `
        <div class="blog-card" onclick="window.location.href='blog-post.html?id=${id}'">
            <img src="${blog.imageUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500'}" 
                 alt="${blog.title}"
                 onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500'">
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${date}</span>
                    <span><i class="far fa-user"></i> ${blog.author || 'APEX Team'}</span>
                </div>
                <h3>${blog.title}</h3>
                <p>${blog.excerpt || blog.content.substring(0, 120) + '...'}</p>
            </div>
        </div>
    `;
}

// ===== FORM SUBMISSIONS =====

// Customer Query Form - Updated to send to WhatsApp
const queryForm = document.getElementById('queryForm');
if (queryForm) {
    queryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('qName').value.trim();
        const phone = document.getElementById('qPhone').value.trim();
        const location = document.getElementById('qLocation').value.trim();
        const service = document.getElementById('qService').value;
        const description = document.getElementById('qDescription').value.trim();
        
        // Validation
        if (!name || !phone || !location || !service || !description) {
            alert('⚠️ Please fill all required fields!');
            return;
        }
        
        // Format WhatsApp message
        const message = `
🏗️ *Project Inquiry - APEX Build and Construct*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Location:* ${location}
🔧 *Service Type:* ${service}

📝 *Project Description:*
${description}

📅 *Date:* ${new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
})}

_I would like to discuss my project requirements with your team._
        `.trim();
        
        // Encode and create WhatsApp URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Also save to Firebase
        const queryData = {
            customerName: name,
            phone: phone,
            location: location,
            serviceType: service,
            description: description,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, 'queries'), queryData);
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success and reset form
            setTimeout(() => {
                alert('✅ Opening WhatsApp... Your query has also been saved. We will contact you soon!');
                queryForm.reset();
            }, 500);
        } catch (error) {
            console.error('Error submitting query:', error);
            // Even if Firebase fails, still open WhatsApp
            window.open(whatsappURL, '_blank');
            alert('✅ Opening WhatsApp... Please send the message!');
            queryForm.reset();
        }
    });
}

// ===== VIDEO CONTROLS =====
const heroVideo = document.getElementById('heroVideo');
const playPauseBtn = document.getElementById('playPauseBtn');

if (heroVideo && playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            heroVideo.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
        const fallbackImg = document.querySelector('.hero-fallback-image');
        if (fallbackImg) {
            fallbackImg.style.display = 'block';
        }
        playPauseBtn.style.display = 'none';
    });
}

// ===== VIDEO PLAY/PAUSE TOGGLE (for project videos) =====
window.toggleVideo = function(button) {
    const videoContainer = button.closest('.project-video-container');
    const video = videoContainer.querySelector('.project-video');
    const icon = button.querySelector('i');
    
    if (video.paused) {
        video.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        video.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
};

// ===== HERO PHONE PRE-FILL =====
const heroPhone = document.getElementById('heroPhone');
const ctaBtn = document.querySelector('.cta-btn');

if (heroPhone && ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const phoneValue = heroPhone.value;
        if (phoneValue) {
            setTimeout(() => {
                const phone = document.getElementById('phone');
                if (phone) {
                    phone.value = phoneValue;
                }
            }, 100);
        }
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

// ===== ABOUT PAGE COUNTER =====
function animateCounterWithEasing(element, target, duration = 2500) {
    const startTime = performance.now();
    
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(easedProgress * target);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

const aboutCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounterWithEasing(counter, target);
            aboutCounterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

// ===== SERVICE PAGE SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Load Firebase data
    loadOngoingProjects();
    loadCompletedProjects();
    loadBlogPosts();
    
    // Observe counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    const aboutCounters = document.querySelectorAll('.about-counter');
    aboutCounters.forEach(counter => {
        aboutCounterObserver.observe(counter);
    });
    
    // Scroll to service section if hash exists
    if (window.location.hash) {
        setTimeout(() => {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                targetSection.style.animation = 'highlightSection 2s ease';
            }
        }, 100);
    }
});

// ===== MODAL CLICK OUTSIDE TO CLOSE =====
document.getElementById('estimateModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeEstimateModal();
    }
});

document.getElementById('quoteModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeQuoteModal();
    }
});

// ===== HIGHLIGHT ANIMATION CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes highlightSection {
        0% { background: rgba(245, 158, 32, 0.1); }
        50% { background: rgba(245, 158, 32, 0.2); }
        100% { background: transparent; }
    }
`;
document.head.appendChild(style);

console.log('🏗️ APEX Build and Construct - Website Loaded Successfully!');
//Hide Floating when open estimate from 
// ===== HIDE FLOATING BUTTON WHEN MODAL IS OPEN =====

// Open Estimate Modal - Updated
window.openEstimateModal = function() {
    const estimateModal = document.getElementById('estimateModal');
    const floatingBtn = document.querySelector('.floating-designer-btn');
    
    if (estimateModal) {
        estimateModal.classList.add('active');
        estimateModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Hide floating button
        if (floatingBtn) {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.pointerEvents = 'none';
        }
    }
};

// Close Estimate Modal - Updated
window.closeEstimateModal = function() {
    const estimateModal = document.getElementById('estimateModal');
    const floatingBtn = document.querySelector('.floating-designer-btn');
    
    if (estimateModal) {
        estimateModal.classList.remove('active');
        setTimeout(() => {
            estimateModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
        
        // Show floating button again
        if (floatingBtn) {
            setTimeout(() => {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.pointerEvents = 'auto';
            }, 300);
        }
    }
};

// Close Quote Modal - Updated
window.closeQuoteModal = function() {
    const quoteModal = document.getElementById('quoteModal');
    const floatingBtn = document.querySelector('.floating-designer-btn');
    
    if (quoteModal) {
        quoteModal.classList.remove('active');
        setTimeout(() => {
            quoteModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
        
        // Show floating button again
        if (floatingBtn) {
            setTimeout(() => {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.pointerEvents = 'auto';
            }, 300);
        }
    }
};

// Open Quote Modal - Updated
window.openQuoteModal = function(serviceName) {
    const quoteModal = document.getElementById('quoteModal');
    const estimateModal = document.getElementById('estimateModal');
    const floatingBtn = document.querySelector('.floating-designer-btn');
    
    // Hide floating button
    if (floatingBtn) {
        floatingBtn.style.opacity = '0';
        floatingBtn.style.pointerEvents = 'none';
    }
    
    if (quoteModal) {
        quoteModal.classList.add('active');
        quoteModal.style.display = 'flex';
        const quoteServiceField = document.getElementById('quoteService');
        if (quoteServiceField) {
            quoteServiceField.value = serviceName;
        }
        document.body.style.overflow = 'hidden';
    } else if (estimateModal) {
        estimateModal.classList.add('active');
        estimateModal.style.display = 'flex';
        const serviceTypeField = document.getElementById('serviceType');
        if (serviceTypeField) {
            const serviceOptions = {
                'Complete House Construction': 'Complete House Construction',
                'Commercial Construction': 'Commercial Construction',
                'Interior Design & Finishing': 'Interior Design',
                'Renovation & Remodeling': 'Renovation',
                'Architectural Design & AutoCAD Planning': 'Consultation',
                'Home Loan Assistance': 'Consultation'
            };
            serviceTypeField.value = serviceOptions[serviceName] || '';
        }
        document.body.style.overflow = 'hidden';
    }
};
