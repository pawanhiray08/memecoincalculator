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

// Theme data with RGB colors for smooth interpolation
const themes = [
    {
        name: 'light',
        colors: {
            background: [255, 255, 255],
            surface: [245, 245, 245],
            primary: [33, 150, 243],
            secondary: [25, 118, 210],
            accent: [100, 181, 246],
            text: [33, 33, 33],
            textMuted: [117, 117, 117]
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
            textMuted: [176, 176, 176]
        }
    },
    {
        name: 'cyberpunk',
        colors: {
            background: [0, 0, 0],
            surface: [26, 26, 26],
            primary: [0, 255, 159],
            secondary: [255, 0, 255],
            accent: [0, 255, 255],
            text: [255, 255, 255],
            textMuted: [0, 255, 159]
        }
    },
    {
        name: 'sunset',
        colors: {
            background: [45, 20, 44],
            surface: [81, 10, 50],
            primary: [238, 69, 64],
            secondary: [255, 159, 28],
            accent: [199, 44, 65],
            text: [255, 255, 255],
            textMuted: [238, 69, 64]
        }
    },
    {
        name: 'forest',
        colors: {
            background: [27, 67, 50],
            surface: [45, 106, 79],
            primary: [116, 198, 157],
            secondary: [149, 213, 178],
            accent: [64, 145, 108],
            text: [255, 255, 255],
            textMuted: [116, 198, 157]
        }
    },
    {
        name: 'ocean',
        colors: {
            background: [3, 4, 94],
            surface: [2, 62, 138],
            primary: [0, 180, 216],
            secondary: [144, 224, 239],
            accent: [0, 119, 182],
            text: [255, 255, 255],
            textMuted: [0, 180, 216]
        }
    }
];

// Linear interpolation between two numbers
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// Interpolate between two colors
function lerpColor(color1, color2, t) {
    return [
        Math.round(lerp(color1[0], color2[0], t)),
        Math.round(lerp(color1[1], color2[1], t)),
        Math.round(lerp(color1[2], color2[2], t))
    ];
}

// Convert RGB array to CSS color string
function rgbToString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

let currentThemeIndex = 0;
let transitionProgress = 0;
const transitionDuration = 30; // 30 seconds for a full theme transition

function updateTheme() {
    const currentTheme = themes[currentThemeIndex];
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    
    // Update all color variables with interpolated values
    Object.keys(currentTheme.colors).forEach(key => {
        const currentColor = currentTheme.colors[key];
        const nextColor = nextTheme.colors[key];
        const interpolatedColor = lerpColor(currentColor, nextColor, transitionProgress);
        document.documentElement.style.setProperty(
            `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
            rgbToString(interpolatedColor)
        );
    });

    // Update transition progress
    transitionProgress += 1 / (60 * transitionDuration); // 60fps for transitionDuration seconds
    
    // When transition is complete, move to next theme
    if (transitionProgress >= 1) {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        transitionProgress = 0;
    }
}

// Start smooth theme cycling
const themeInterval = setInterval(updateTheme, 1000 / 60); // 60fps updates

// Manual theme toggle now smoothly transitions to next theme
document.querySelector('.theme-toggle').addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    transitionProgress = 0;
});

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
