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
        name: 'hacker',
        colors: {
            background: [1, 22, 39],
            surface: [5, 34, 57],
            primary: [0, 255, 198],
            secondary: [33, 211, 255],
            accent: [0, 183, 255],
            text: [240, 248, 255],
            textMuted: [154, 177, 198]
        }
    },
    {
        name: 'cyberpunk',
        colors: {
            background: [13, 13, 23],
            surface: [23, 23, 38],
            primary: [0, 255, 159],
            secondary: [255, 0, 255],
            accent: [0, 255, 255],
            text: [235, 235, 235],
            textMuted: [190, 190, 190]
        }
    },
    {
        name: 'sunset',
        colors: {
            background: [35, 15, 34],
            surface: [71, 8, 40],
            primary: [255, 159, 28],
            secondary: [238, 69, 64],
            accent: [199, 44, 65],
            text: [255, 255, 255],
            textMuted: [220, 220, 220]
        }
    },
    {
        name: 'forest',
        colors: {
            background: [22, 57, 40],
            surface: [40, 96, 69],
            primary: [169, 233, 198],
            secondary: [136, 218, 177],
            accent: [84, 165, 128],
            text: [255, 255, 255],
            textMuted: [220, 220, 220]
        }
    },
    {
        name: 'ocean',
        colors: {
            background: [2, 3, 84],
            surface: [2, 52, 128],
            primary: [164, 244, 255],
            secondary: [0, 200, 236],
            accent: [0, 139, 202],
            text: [255, 255, 255],
            textMuted: [220, 220, 220]
        }
    },
    {
        name: 'neon',
        colors: {
            background: [20, 20, 20],
            surface: [30, 30, 30],
            primary: [255, 0, 128],
            secondary: [0, 255, 255],
            accent: [255, 0, 255],
            text: [255, 255, 255],
            textMuted: [200, 200, 200]
        }
    },
    {
        name: 'galaxy',
        colors: {
            background: [16, 6, 37],
            surface: [26, 16, 47],
            primary: [171, 123, 255],
            secondary: [123, 31, 255],
            accent: [209, 182, 255],
            text: [255, 255, 255],
            textMuted: [200, 200, 220]
        }
    }
];

let currentThemeIndex = 0;
let defaultThemeIndex = 0; // Store default theme index

// Set theme
function applyTheme(themeIndex) {
    const theme = themes[themeIndex];
    Object.keys(theme.colors).forEach(key => {
        document.documentElement.style.setProperty(
            `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
            rgbToString(theme.colors[key])
        );
    });
}

// Initialize with default theme
applyTheme(defaultThemeIndex);

// Theme toggle button handler
document.querySelector('.theme-toggle').addEventListener('click', () => {
    // Reset to default theme if we're on the last theme
    if (currentThemeIndex === themes.length - 1) {
        currentThemeIndex = defaultThemeIndex;
    } else {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    }
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
