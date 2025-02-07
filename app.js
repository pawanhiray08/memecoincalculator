// Initialize UI elements
const results = {
    profitLoss: document.getElementById('profitLoss'),
    roi: document.getElementById('roi'),
    xReturn: document.getElementById('xReturn'),
    totalInvested: document.getElementById('totalInvested'),
    totalValue: document.getElementById('totalValue'),
    adjustedValue: document.getElementById('adjustedValue'),
    totalFees: document.getElementById('totalFees'),
    breakEven: document.getElementById('breakEven'),
    projectedProfit: document.getElementById('projectedProfit')
};

// Format large numbers
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// Calculate profit and update UI
function calculateProfit() {
    // Get input values
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const buyMarketCap = parseFloat(document.getElementById('buyMarketCap').value) || 0;
    const sellMarketCap = parseFloat(document.getElementById('sellMarketCap').value) || 0;
    const slippage = parseFloat(document.getElementById('slippage').value) || 0;
    const buyFee = parseFloat(document.getElementById('buyFee').value) || 0;
    const sellFee = parseFloat(document.getElementById('sellFee').value) || 0;

    // Calculate fees
    const slippageFee = investment * (slippage / 100);
    const buyFeeAmount = investment * (buyFee / 100);
    const totalBuyFees = slippageFee + buyFeeAmount;

    // Calculate total invested including buy fees
    const totalInvested = investment + totalBuyFees;

    // Calculate value and profit/loss
    let totalValue = 0;
    let adjustedValue = 0;
    let profitLoss = 0;
    let roi = 0;
    let xReturn = 0;

    if (buyMarketCap > 0 && sellMarketCap > 0) {
        const multiplier = sellMarketCap / buyMarketCap;
        totalValue = investment * multiplier;
        const sellFeeAmount = totalValue * (sellFee / 100);
        adjustedValue = totalValue - sellFeeAmount;
        profitLoss = adjustedValue - totalInvested;
        roi = ((adjustedValue - totalInvested) / totalInvested) * 100;
        xReturn = adjustedValue / totalInvested;
    }

    // Update UI
    updateMetric(results.totalInvested, formatNumber(totalInvested));
    updateMetric(results.totalValue, formatNumber(totalValue));
    updateMetric(results.adjustedValue, formatNumber(adjustedValue));
    updateMetric(results.totalFees, formatNumber(totalBuyFees + (totalValue * (sellFee / 100))));
    updateMetric(results.profitLoss, formatNumber(profitLoss), profitLoss >= 0);
    updateMetric(results.roi, roi.toFixed(2) + '%', roi >= 0);
    updateMetric(results.xReturn, xReturn.toFixed(2) + 'x', xReturn >= 1);
    updateMetric(results.breakEven, formatNumber(totalInvested));
    updateMetric(results.projectedProfit, formatNumber(sellMarketCap - buyMarketCap));
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
    // Remove all theme classes
    themes.forEach(theme => {
        document.documentElement.classList.remove(theme);
    });

    // Set new theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    if (newTheme !== 'default') {
        document.documentElement.classList.add(newTheme);
    }

    // Update button text with capitalized theme name
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.textContent = `Theme: ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`;
}

// Add input listeners for real-time validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        // Remove non-numeric characters except decimal point
        input.value = input.value.replace(/[^\d.-]/g, '');
        
        // Ensure only one decimal point
        const parts = input.value.split('.');
        if (parts.length > 2) {
            input.value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Remove leading zeros
        if (input.value.length > 1 && input.value[0] === '0' && input.value[1] !== '.') {
            input.value = parseFloat(input.value).toString();
        }
        
        // Prevent negative values
        if (parseFloat(input.value) < 0) {
            input.value = '0';
        }
    });
});

// Add button listeners
document.querySelector('.calculate-btn').addEventListener('click', calculateProfit);
document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

// Initial calculation
calculateProfit();
