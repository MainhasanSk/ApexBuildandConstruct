// ===== SERVICES PAGE SPECIFIC FUNCTIONS =====
// ===== FIX HAMBURGER MENU FOR SERVICES PAGE =====

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        // Remove any existing event listeners by cloning
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Add fresh event listener
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            navLinks.classList.toggle('active');
            newHamburger.classList.toggle('active');
            
            console.log('Hamburger clicked - Nav active:', navLinks.classList.contains('active'));
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                newHamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !newHamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                newHamburger.classList.remove('active');
            }
        });
    }
});

// Open Quote Modal (Make sure this is global)
window.openQuoteModal = function(serviceName) {
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) {
        quoteModal.classList.add('active');
        const quoteServiceField = document.getElementById('quoteService');
        if (quoteServiceField) {
            quoteServiceField.value = serviceName;
        }
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Quote modal not found!');
    }
};

// Close Quote Modal
window.closeQuoteModal = function() {
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Send Quote to WhatsApp
window.sendQuoteToWhatsApp = function(event) {
    event.preventDefault();

    // Your WhatsApp Business Number
    const whatsappNumber = "919957852523"; // REPLACE WITH YOUR NUMBER

    // Get form values
    const name = document.getElementById('quoteName').value;
    const phone = document.getElementById('quotePhone').value;
    const location = document.getElementById('quoteLocation').value;
    const service = document.getElementById('quoteService').value;
    const budget = document.getElementById('quoteBudget').value || 'Not specified';

    // Format message for WhatsApp
    const message = `
🏗️ *Service Quote Request - Apex Build and Construct*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Location:* ${location}

🔧 *Service Required:* ${service}
💰 *Estimated Budget:* ${budget}

📅 *Inquiry Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

_Please provide me with a detailed quotation for the above service. Looking forward to working with Apex Build and Construct!_
    `.trim();

    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');

    // Success feedback
    setTimeout(() => {
        alert('✅ Opening WhatsApp... Please send the pre-filled message!');
        closeQuoteModal();
        document.getElementById('quoteForm').reset();
    }, 500);
};

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const quoteModal = document.getElementById('quoteModal');
    if (event.target === quoteModal) {
        closeQuoteModal();
    }
});

// Smooth scroll for service navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll to services
    document.querySelectorAll('a[href^="#service-"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // If URL has hash, scroll to that section
    if (window.location.hash) {
        setTimeout(() => {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// Hamburger menu toggle (if not already in app.js)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}
