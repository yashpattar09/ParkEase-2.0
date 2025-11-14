// Common wallet functionality
class WalletManager {
    constructor() {
        this.init();
    }

    init() {
        // Add wallet link to navigation if not exists
        this.addWalletToNav();
        
        // Initialize wallet if user is logged in
        if (this.isLoggedIn()) {
            this.loadWalletBalance();
        }
    }

    isLoggedIn() {
        return localStorage.getItem('token') && localStorage.getItem('user');
    }

    addWalletToNav() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Create wallet link if it doesn't exist
        if (!document.getElementById('walletLink')) {
            const walletLink = document.createElement('a');
            walletLink.href = 'wallet.html';
            walletLink.id = 'walletLink';
            walletLink.className = 'wallet-link';
            walletLink.style.display = this.isLoggedIn() ? 'inline-block' : 'none';
            walletLink.innerHTML = '<span class="wallet-balance" id="walletBalance">₹0.00</span>';
            
            // Insert before login/logout buttons
            const loginBtn = document.querySelector('.login-btn, .logout-btn');
            if (loginBtn) {
                loginBtn.parentNode.insertBefore(walletLink, loginBtn);
            } else {
                nav.appendChild(walletLink);
            }
        }
    }

    loadWalletBalance() {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) return;

        fetch(`/api/wallet/${userData.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const walletBalance = document.getElementById('walletBalance');
                    if (walletBalance) {
                        walletBalance.textContent = `₹${data.balance.toFixed(2)}`;
                    }
                }
            })
            .catch(error => console.error('Error loading wallet balance:', error));
    }
}

// Initialize wallet functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WalletManager();
});