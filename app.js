// Initialize UI elements
const results = {
    profitLoss: document.getElementById('profitLoss'),
    roi: document.getElementById('roi'),
    xReturn: document.getElementById('xReturn'),
    breakEven: document.getElementById('breakEven'),
    projectedProfit: document.getElementById('projectedProfit'),
    totalInvested: document.getElementById('totalInvested'),
    totalValue: document.getElementById('totalValue'),
    adjustedValue: document.getElementById('adjustedValue'),
    totalFees: document.getElementById('totalFees')
};

// Format large numbers
function formatNumber(num) {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
}

// Calculate profit and update UI
function calculateProfit() {
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const buyMarketCap = parseFloat(document.getElementById('buyMarketCap').value) || 1;
    const sellMarketCap = parseFloat(document.getElementById('sellMarketCap').value) || buyMarketCap;

    // Get fee parameters
    const slippage = parseFloat(document.getElementById('slippage').value) || 0;
    const networkFee = parseFloat(document.getElementById('networkFee').value) || 0;
    const solPrice = parseFloat(document.getElementById('solPrice').value) || 100;

    // Calculate values
    const totalSupply = 1e9; // Example: 1 billion tokens
    const buyPrice = buyMarketCap / totalSupply;
    const sellPrice = sellMarketCap / totalSupply;

    const tokensOwned = investment / buyPrice;
    const currentValue = tokensOwned * sellPrice;

    // Calculate fees
    const slippageAmount = currentValue * (slippage / 100);
    const networkFeeUSD = networkFee * solPrice;
    const totalFees = slippageAmount + networkFeeUSD;

    // Calculate final values
    const adjustedValue = currentValue - totalFees;
    const profitLoss = adjustedValue - investment;
    const roi = ((profitLoss / investment) * 100) || 0;
    const returnMultiplier = (adjustedValue / investment) || 0;

    // Update display with animations
    updateMetric(results.profitLoss, `${profitLoss >= 0 ? '+' : '-'}$${Math.abs(profitLoss).toFixed(2)}`, profitLoss >= 0);
    updateMetric(results.roi, `${roi.toFixed(2)}%`, roi >= 0);
    updateMetric(results.xReturn, `${returnMultiplier.toFixed(2)}x`, returnMultiplier >= 1);
    updateMetric(results.breakEven, formatNumber(buyMarketCap));
    updateMetric(results.projectedProfit, `${formatNumber(buyMarketCap)} → ${formatNumber(sellMarketCap)}`);
    updateMetric(results.totalInvested, `$${investment.toFixed(2)}`);
    updateMetric(results.totalValue, `$${currentValue.toFixed(2)}`, currentValue > investment);
    updateMetric(results.adjustedValue, `$${adjustedValue.toFixed(2)}`, adjustedValue > investment);
    updateMetric(results.totalFees, `$${totalFees.toFixed(2)}`);
}

// Update metric with animation
function updateMetric(element, value, isPositive = true) {
    element.textContent = value;
    element.classList.remove('positive', 'negative');
    if (typeof isPositive === 'boolean') {
        element.classList.add(isPositive ? 'positive' : 'negative');
    }
}

// Theme handling
const themes = [
    'default',
    'cyberpunk',
    'forest',
    'sunset',
    'ocean',
    'royal',
    'retro',
    'neon',
    'desert',
    'nordic'
];

let currentThemeIndex = 0;

function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    // Remove all existing theme attributes
    themes.forEach(theme => {
        document.body.removeAttribute('data-theme');
    });
    
    // Set new theme
    if (newTheme !== 'default') {
        document.body.setAttribute('data-theme', newTheme);
    }

    // Update button text
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.textContent = `Theme: ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`;
}

// Add input listeners
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        calculateProfit();
        input.parentElement.classList.add('active');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('active');
    });
});

// Theme toggle with animation
document.querySelector('.theme-toggle').addEventListener('click', () => {
    toggleTheme();
    const button = document.querySelector('.theme-toggle');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = '', 150);
});

// Initialize calculations
calculateProfit();
