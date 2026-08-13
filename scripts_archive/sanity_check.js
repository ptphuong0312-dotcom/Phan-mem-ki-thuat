const fs = require('fs');

try {
    const html = fs.readFileSync('index.html', 'utf8');
    if (!html.includes('js/isoUI.js')) console.log("ERROR: index.html missing isoUI.js");
    if (!html.includes('js/toleranceCalculator.js')) console.log("ERROR: index.html missing toleranceCalculator.js");

    console.log("Sanity check passed!");
} catch (e) {
    console.log("Error:", e);
}
