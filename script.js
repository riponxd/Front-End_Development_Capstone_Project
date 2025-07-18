
// Helper: Pop-up message
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2200);
}

// State
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Elements
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');
const homeSection = document.getElementById('home-section');
const findDoctorSection = document.getElementById('find-doctor-section');
const reviewsSection = document.getElementById('reviews-section');
const profileSection = document.getElementById('profile-section');
const logoutBtn = document.getElementById('logout-btn');

// Show/Hide Sections
function showSection(section) {
    [signupSection, loginSection, homeSection, findDoctorSection, reviewsSection, profileSection].forEach(sec => sec.style.display = 'none');
    section.style.display = 'block';
    logoutBtn.style.display = (section === homeSection) ? 'block' : 'none';
}

// Email Validation
function isValidEmail(email) {
    return /^[\w.-]+@gmail\.com$/.test(email);
}

// Signup
document.getElementById('signup-form').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    if (!isValidEmail(email)) {
        showPopup('Invalid Gmail!');
        return;
    }
    if (users.find(u => u.email === email)) {
        showPopup('This Gmail is already registered!');
        return;
    }
    users.push({ email, password, name: 'User', rating: 0 });
    localStorage.setItem('users', JSON.stringify(users));
    showPopup('Sign Up successful! Please login.');
    document.getElementById('signup-form').reset();
    showSection(loginSection);
};

// Login
document.getElementById('login-form').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!isValidEmail(email)) {
        showPopup('Invalid Gmail!');
        return;
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showPopup('Gmail or Password is incorrect!');
        return;
    }
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showPopup('Login successful!');
    showSection(homeSection);
    renderHome();
};

// Show Login/Signup
document.getElementById('show-login').onclick = function(e) {
    e.preventDefault();
    showSection(loginSection);
};
document.getElementById('show-signup').onclick = function(e) {
    e.preventDefault();
    showSection(signupSection);
};

// Logout
logoutBtn.onclick = function() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSection(loginSection);
};

// Navbar Navigation
document.getElementById('home-link').onclick = function(e) {
    e.preventDefault();
    if (currentUser) {
        showSection(homeSection);
        renderHome();
    } else showSection(loginSection);
};
document.getElementById('find-doctor-link').onclick = function(e) {
    e.preventDefault();
    if (currentUser) {
        showSection(findDoctorSection);
        renderFindDoctor();
    } else showSection(loginSection);
};
document.getElementById('reviews-link').onclick = function(e) {
    e.preventDefault();
    if (currentUser) {
        showSection(reviewsSection);
        renderReviews();
    } else showSection(loginSection);
};
document.getElementById('profile-link').onclick = function(e) {
    e.preventDefault();
    if (currentUser) {
        showSection(profileSection);
        renderProfile();
    } else showSection(loginSection);
};

// Render Home
function renderHome() {
    document.getElementById('notification').innerHTML = '<b>Notification:</b> No new notifications for today.';
    document.getElementById('appointment-section').innerHTML = `
        <h3>Appointment Booking</h3>
        <form id="appointment-form">
            <input type="text" id="doctor-name" placeholder="Doctor Name" required><br>
            <input type="text" id="appointment-date" placeholder="Date (DD/MM/YYYY)" required><br>
            <button type="submit">Book Now</button>
        </form>
        <div id="appointment-result"></div>
    `;
    document.getElementById('appointment-form').onsubmit = function(e) {
        e.preventDefault();
        const doc = document.getElementById('doctor-name').value.trim();
        const date = document.getElementById('appointment-date').value.trim();
        if (!doc || !date) {
            showPopup('Please fill all fields!');
            return;
        }
        document.getElementById('appointment-result').innerHTML = `<span style='color:green;'>Appointment booked with ${doc} on ${date}!`;
        document.getElementById('appointment-form').reset();
    };
}

// Render Find Doctor
function renderFindDoctor() {
    findDoctorSection.innerHTML = `
        <h3>Find Doctor</h3>
        <input type="text" id="search-doctor" placeholder="Enter Doctor Name">
        <button onclick="window.searchDoctor()">Search</button>
        <div id="doctor-list"></div>
    `;
    window.searchDoctor = function() {
        const name = document.getElementById('search-doctor').value.trim();
        if (!name) {
            showPopup('Enter doctor name!');
            return;
        }
        document.getElementById('doctor-list').innerHTML = `<div>Doctor ${name} found! (Demo)</div>`;
    };
}

// Render Reviews
function renderReviews() {
    reviewsSection.innerHTML = `
        <h3>Reviews</h3>
        <form id="review-form">
            <input type="text" id="review-input" placeholder="Write your review" required><br>
            <label>Rating: <select id="rating-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select></label><br>
            <button type="submit">Submit</button>
        </form>
        <div id="review-list"></div>
    `;
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    function showReviews() {
        document.getElementById('review-list').innerHTML = reviews.map(r => `<div><b>${r.name}:</b> ${r.text} <span style='color:orange;'>★${r.rating}</span></div>`).join('');
    }
    showReviews();
    document.getElementById('review-form').onsubmit = function(e) {
        e.preventDefault();
        const text = document.getElementById('review-input').value.trim();
        const rating = document.getElementById('rating-select').value;
        if (!text) {
            showPopup('Please write a review!');
            return;
        }
        reviews.push({ name: currentUser?.email || 'User', text, rating });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        showReviews();
        document.getElementById('review-form').reset();
    };
}

// Render Profile
function renderProfile() {
    profileSection.innerHTML = `
        <h3>Profile</h3>
        <div>Gmail: <b>${currentUser?.email}</b></div>
        <div>Name: <span id="profile-name">${currentUser?.name || ''}</span></div>
        <form id="change-name-form">
            <input type="text" id="new-name" placeholder="Enter new name" required>
            <button type="submit">Change Name</button>
        </form>
    `;
    document.getElementById('change-name-form').onsubmit = function(e) {
        e.preventDefault();
        const newName = document.getElementById('new-name').value.trim();
        if (!newName) {
            showPopup('Enter new name!');
            return;
        }
        currentUser.name = newName;
        users = users.map(u => u.email === currentUser.email ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('profile-name').innerText = newName;
        showPopup('Name changed!');
        document.getElementById('change-name-form').reset();
    };
}

// Initial Load
if (currentUser) {
    showSection(homeSection);
    renderHome();
} else {
    showSection(signupSection);
}
