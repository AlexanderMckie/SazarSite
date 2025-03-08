// Function to load an SVG file into an element

export function loadSVGIntoElement(filePath, elementID) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.overrideMimeType('image/svg+xml');
        xhr.onload = function() {
            if (xhr.status === 200) {
                const svgContainer = document.getElementById(elementID);
                if (svgContainer) {
                    svgContainer.innerHTML = xhr.responseText;
                    const svgDocument = svgContainer.querySelector('svg');
                    resolve(svgDocument);
                } else {
                    reject(new Error(`Element with ID ${elementID} not found`));
                }
            } else {
                reject(new Error(`Failed to load SVG file: ${xhr.statusText}`));
            }
        };
        xhr.onerror = function() {
            reject(new Error('Network error while loading SVG file'));
        };
        xhr.send();
    });
}