// Function to load and display wallet balance
function loadWalletBalance() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`/api/wallet/${user.id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const walletDisplay = document.getElementById('walletBalance');
                if (walletDisplay) {
                    walletDisplay.textContent = `₹${data.balance.toFixed(2)}`;
                }
            }
        })
        .catch(error => {
            console.error('Error loading wallet balance:', error);
        });
}

// Function to update navigation based on authentication
function updateAuthNav() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const authNav = document.getElementById('authNav');
    
    if (token && user) {
        const userData = JSON.parse(user);
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="wallet.html">
                    <span class="wallet-balance" id="walletBalance">₹0.00</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="profile.html">${userData.full_name}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Logout</a>
            </li>
        `;
        loadWalletBalance();
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="signup.html">Sign Up</a>
            </li>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateAuthNav();
});