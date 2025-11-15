// ===== MOBILE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      const navUl = mainNav.querySelector('ul');
      navUl.classList.toggle('active');
      
      
      navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        const navUl = mainNav.querySelector('ul');
        navUl.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
});

// ===== NEWSLETTER SUBSCRIPTION =====
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();

    // Basic email validation
    if (validateEmail(email)) {
      // Show success message
      showNotification('Thank you for subscribing to Namma Kudla! Check your email for confirmation.', 'success');
      emailInput.value = '';
    } else {
      showNotification('Please enter a valid email address.', 'error');
    }
  });
}

// ===== COMMENT FORM =====
const commentForm = document.getElementById('commentForm');
if (commentForm) {
  // Initialize comments array from session storage
  let comments = JSON.parse(sessionStorage.getItem('comments')) || [];
  
  // Display existing comments
  displayComments();

  commentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('commentName')?.value || document.querySelector('#commentForm input[type="text"]').value;
    const email = document.getElementById('commentEmail')?.value || '';
    const text = document.getElementById('commentText')?.value || document.querySelector('#commentForm textarea').value;

    // Validate inputs
    if (name.trim() === '' || text.trim() === '') {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (email && !validateEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Create comment object
    const comment = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      text: text.trim(),
      date: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Add to comments array
    comments.push(comment);
    
    // Save to session storage
    sessionStorage.setItem('comments', JSON.stringify(comments));

    // Display comments
    displayComments();

    // Clear form
    commentForm.reset();
    
    // Show success message
    showNotification('Your comment has been posted successfully!', 'success');
  });

  function displayComments() {
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    
    if (!commentList) return;

    // Update comment count
    if (commentCount) {
      commentCount.textContent = comments.length;
    }

    // Clear existing comments
    commentList.innerHTML = '';

    // Display comments in reverse order (newest first)
    const reversedComments = [...comments].reverse();
    
    reversedComments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(comment.name)}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
      `;
      commentList.appendChild(commentElement);
    });

    // If no comments
    if (comments.length === 0) {
      commentList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    }
  }
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate form submission
    showNotification(`Thank you, ${firstName}! Your message has been sent. We'll get back to you soon.`, 'success');
    contactForm.reset();
  });
}

// ===== SEARCH AND FILTER (BLOG PAGE) =====
function searchPosts() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (!searchTerm) {
    showNotification('Please enter a search term.', 'info');
    return;
  }

  const posts = document.querySelectorAll('.post-card');
  let foundCount = 0;

  posts.forEach(post => {
    const title = post.querySelector('h3').textContent.toLowerCase();
    const content = post.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      post.style.display = '';
      foundCount++;
    } else {
      post.style.display = 'none';
    }
  });

  if (foundCount === 0) {
    showNotification('No posts found matching your search.', 'info');
  } else {
    showNotification(`Found ${foundCount} post(s) matching "${searchTerm}"`, 'success');
  }
}

function filterPosts() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value.toLowerCase();
  
  const posts = document.querySelectorAll('.post-card');

  posts.forEach(post => {
    const category = post.querySelector('.category').textContent.toLowerCase();
    
    if (selectedCategory === 'all' || category === selectedCategory) {
      post.style.display = '';
    } else {
      post.style.display = 'none';
    }
  });

  if (selectedCategory !== 'all') {
    showNotification(`Showing ${selectedCategory} posts`, 'info');
  }
}

// ===== SOCIAL SHARING =====
function shareOnSocial(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  
  let shareUrl;
  
  switch(platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${title}%20${url}`;
      break;
    default:
      showNotification('Invalid social platform', 'error');
      return;
  }
  
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

// ===== CONTACT GUIDE =====
function contactGuide(guideName) {
  showNotification(`Opening contact form for ${guideName}...`, 'info');
  
  // Simulate navigation delay
  setTimeout(() => {
    window.location.href = `contact.html?guide=${encodeURIComponent(guideName)}`;
  }, 500);
}

// ===== UTILITY FUNCTIONS =====

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('notification-fade-out');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===== SCROLL TO TOP BUTTON =====
window.addEventListener('scroll', function() {
  // Show/hide scroll-to-top button
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  }
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  // Observe all images with loading="lazy" attribute
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function() {
    const faqItem = this.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    
    // Toggle active class
    faqItem.classList.toggle('active');
    
    // Toggle answer visibility
    if (faqItem.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      answer.style.maxHeight = '0';
    }
  });
});

// ===== FORM VALIDATION HELPERS =====
document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
  field.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      this.classList.add('error');
      this.classList.remove('success');
    } else {
      this.classList.add('success');
      this.classList.remove('error');
    }
  });

  field.addEventListener('input', function() {
    if (this.classList.contains('error') && this.value.trim() !== '') {
      this.classList.remove('error');
      this.classList.add('success');
    }
  });
});

// ===== INITIALIZE PAGE-SPECIFIC FUNCTIONALITY =====
window.addEventListener('load', function() {
  // Check URL parameters for guide contact
  const urlParams = new URLSearchParams(window.location.search);
  const guideName = urlParams.get('guide');
  
  if (guideName && document.getElementById('subject')) {
    document.getElementById('subject').value = 'guide';
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.value = `Hi, I'm interested in learning more about tour services from ${guideName}.`;
    }
  }

  console.log('Namma Kudla Travel Blog - JavaScript Loaded Successfully');
  console.log('Version: 1.0.0');
  console.log('Built with ❤️ for Mangaluru');
});