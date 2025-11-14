let currentWalletBalance = 0;

// Function to update wallet balance display
function updateWalletDisplay(balance) {
    const walletDisplays = document.querySelectorAll('.wallet-balance');
    walletDisplays.forEach(display => {
        display.textContent = `₹${parseFloat(balance).toFixed(2)}`;
    });
    currentWalletBalance = balance;
}

// Function to check if wallet has sufficient balance
function checkWalletBalance(amount) {
    return currentWalletBalance >= amount;
}

// Function to process payment using wallet
async function processWalletPayment(amount, userId) {
    try {
        const response = await fetch(`/api/wallet/withdraw/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();
        
        if (data.success) {
            updateWalletDisplay(data.balance);
            return { success: true, message: 'Payment successful' };
        } else {
            return { success: false, message: data.message || 'Payment failed' };
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        return { success: false, message: 'Payment processing error' };
    }
}

// Initialize wallet balance on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        fetch(`/api/wallet/${user.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateWalletDisplay(data.balance);
                }
            })
            .catch(error => console.error('Error loading wallet balance:', error));
    }
});