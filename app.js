// Initialize UI elements
const results = {
    profitLoss: document.getElementById('profitLoss'),
    roi: document.getElementById('roi'),
    xReturn: document.getElementById('xReturn'),
    totalInvested: document.getElementById('totalInvested'),
    totalValue: document.getElementById('totalValue'),
    adjustedValue: document.getElementById('adjustedValue'),
    totalFees: document.getElementById('totalFees'),
    totalFeesSOL: document.getElementById('totalFeesSOL'),
    totalBribesSOL: document.getElementById('totalBribesSOL'),
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

// Format SOL numbers
function formatSOL(num) {
    if (num === undefined || num === null || isNaN(num)) return '0.000 SOL';
    return num.toFixed(3) + ' SOL';
}

// Calculate profit and update UI
function calculateProfit() {
    // Get input values
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const buyMarketCap = parseFloat(document.getElementById('buyMarketCap').value) || 0;
    const sellMarketCap = parseFloat(document.getElementById('sellMarketCap').value) || 0;
    const buyFee = parseFloat(document.getElementById('buyFee').value) || 0;
    const sellFee = parseFloat(document.getElementById('sellFee').value) || 0;
    const buyBribe = parseFloat(document.getElementById('buyBribe').value) || 0;
    const sellBribe = parseFloat(document.getElementById('sellBribe').value) || 0;
    const solPrice = parseFloat(document.getElementById('solPrice').value) || 0;

    // Calculate buy fees and bribes in SOL and USD
    const buyFeeSOL = buyFee;
    const buyBribeSOL = buyBribe;
    const buyFeeUSD = buyFeeSOL * solPrice;
    const buyBribeUSD = buyBribeSOL * solPrice;
    const totalBuyFees = buyFeeUSD + buyBribeUSD;

    // Calculate total invested including buy fees and bribes
    const totalInvested = investment + totalBuyFees;

    // Calculate value and profit/loss
    let totalValue = 0;
    let adjustedValue = 0;
    let profitLoss = 0;
    let roi = 0;
    let xReturn = 0;
    let sellFeeSOL = 0;
    let sellBribeSOL = 0;
    let sellFeeUSD = 0;
    let sellBribeUSD = 0;

    if (buyMarketCap > 0 && sellMarketCap > 0) {
        const multiplier = sellMarketCap / buyMarketCap;
        totalValue = investment * multiplier;
        sellFeeSOL = sellFee;
        sellBribeSOL = sellBribe;
        sellFeeUSD = sellFeeSOL * solPrice;
        sellBribeUSD = sellBribeSOL * solPrice;
        adjustedValue = totalValue - sellFeeUSD - sellBribeUSD;
        profitLoss = adjustedValue - totalInvested;
        roi = ((adjustedValue - totalInvested) / totalInvested) * 100;
        xReturn = adjustedValue / totalInvested;
    }

    // Calculate total fees and bribes in both SOL and USD
    const totalFeesSOL = buyFeeSOL + sellFeeSOL;
    const totalBribesSOL = buyBribeSOL + sellBribeSOL;
    const totalFeesUSD = buyFeeUSD + sellFeeUSD;
    const totalBribesUSD = buyBribeUSD + sellBribeUSD;
    const totalCostsUSD = totalFeesUSD + totalBribesUSD;

    // Update UI
    updateMetric(results.totalInvested, formatNumber(totalInvested));
    updateMetric(results.totalValue, formatNumber(totalValue));
    updateMetric(results.adjustedValue, formatNumber(adjustedValue));
    updateMetric(results.totalFees, formatNumber(totalCostsUSD));
    updateMetric(results.totalFeesSOL, formatSOL(totalFeesSOL));
    updateMetric(results.totalBribesSOL, formatSOL(totalBribesSOL));
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

// Calculate relative luminance
function getLuminance(r, g, b) {
    let [rs, gs, bs] = [r/255, g/255, b/255].map(c => {
        if (c <= 0.03928) {
            return c / 12.92;
        }
        return Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(l1, l2) {
    let lighter = Math.max(l1, l2);
    let darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Get contrasting text color (black or white) with increased contrast
function getContrastingTextColor(bgR, bgG, bgB) {
    const bgLuminance = getLuminance(bgR, bgG, bgB);
    const whiteLuminance = getLuminance(255, 255, 255);
    const blackLuminance = getLuminance(0, 0, 0);
    
    const whiteContrast = getContrastRatio(whiteLuminance, bgLuminance);
    const blackContrast = getContrastRatio(blackLuminance, bgLuminance);
    
    // Increase contrast by choosing more extreme values
    return whiteContrast > blackContrast ? [255, 255, 255] : [0, 0, 0];
}

// Get semi-transparent version of a color with increased contrast
function getTransparentColor(color, alpha) {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.min(alpha * 1.2, 1)})`;
}

// Theme data with RGB colors
const themes = [
    {
        name: 'light',
        colors: {
            background: [245, 245, 245],
            surface: [255, 255, 255],
            primary: [25, 118, 210],
            secondary: [33, 150, 243],
            accent: [100, 181, 246],
            text: [33, 33, 33],
            textMuted: [87, 87, 87]
        }
    },
    {
        name: 'dark',
        colors: {
            background: [18, 18, 18],
            surface: [30, 30, 30],
            primary: [144, 202, 249],
            secondary: [100, 181, 246],
            accent: [66, 165, 245],
            text: [255, 255, 255],
            textMuted: [200, 200, 200]
        }
    }
];

let currentThemeIndex = 0;

// Set initial theme
function applyTheme(themeIndex) {
    const theme = themes[themeIndex];
    Object.keys(theme.colors).forEach(key => {
        document.documentElement.style.setProperty(
            `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
            rgbToString(theme.colors[key])
        );
    });
}

// Initialize with first theme
applyTheme(currentThemeIndex);

// Theme toggle button handler
document.querySelector('.theme-toggle').addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(currentThemeIndex);
});

// Convert RGB array to CSS color string
function rgbToString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
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

// Initial calculation
calculateProfit();
