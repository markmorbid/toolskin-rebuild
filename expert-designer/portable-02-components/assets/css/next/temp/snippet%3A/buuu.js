(function() {
    let cssRulesText = [];
    document.querySelectorAll('.markdown-content').forEach(sheetTag => {
        let sheet = sheetTag.sheet;
        if (sheet && sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
                cssRulesText.push(rule.cssText);
            });
        }
    });

    let finalCSS = cssRulesText.join('\n');
    if (finalCSS.trim().length === 0) {
        console.error("No live CSS rules found in head style tags.");
    } else {
        copy(finalCSS);
        console.log("SUCCESS: All live CSS rules copied to clipboard!");
    }
})();