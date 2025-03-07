gsap.registerPlugin(ScrollTrigger, TextPlugin);

gsap.registerPlugin(MotionPathPlugin);

const cloudFrontArray = [
    "assets/images/Header/cloudOneFG.svg",
    "assets/images/Header/cloudTwoFG.svg",
    "assets/images/Header/cloudThreeFG.svg",
    "assets/images/Header/cloudFourFG.svg",
    "assets/images/Header/cloudFiveFG.svg",
    "assets/images/Header/cloudSixFG.svg"
];

const cloudFrontSmallArray = [
    "assets/images/Header/cloudOneFGsmall.svg",
    "assets/images/Header/cloudTwoFGsmall.svg"
];

const cloudBackArray = [
    "assets/images/Header/cloudOneBG.svg",
    "assets/images/Header/cloudTwoBG.svg",
    "assets/images/Header/cloudThreeBG.svg",
    "assets/images/Header/cloudFourBG.svg"
];

const sazPieceFilePath = "assets/images/SazPiece.svg";
const sazPieceElementID = "SazPiece";
function adjustSVGSize() {
    const svgContainer = document.getElementById(sazPieceElementID);
    if (window.innerWidth < 768) { // Mobile view
       
        svgContainer.style.height = '60vh';
        svgContainer.style.overflowX = 'auto';
        svgContainer.style.overflowY = 'hidden';
        svgContainer.style.whiteSpace = 'nowrap';
    } else { // Desktop view
        svgContainer.style.width = '100%';
        svgContainer.style.height = 'auto';
        svgContainer.style.overflow = 'hidden';
    }
}
let scrollAnimationFrame;

function autoScrollSVG() {
    const svgContainer = document.getElementById(sazPieceElementID);
    const svgObject = svgContainer.querySelector('object.svg-object');
    if (window.innerWidth < 768 && svgObject) { // Mobile view
        const maxScroll = svgObject.clientWidth - svgContainer.clientWidth;
        if (scrollAnimationFrame) {
            cancelAnimationFrame(scrollAnimationFrame);
        }
        gsap.to(svgObject, {
            x: -maxScroll,
            duration: 10, // Adjust duration to control the scroll speed
            ease: "none",
            repeat: -1, // Infinite loop
            startAt: { x: -maxScroll * -0.5, opacity: 0 }, // Start from the left position with 0 opacity
            endAt: { x: 0, opacity: 0 },
            modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % maxScroll) // Loop the scroll
            },
            onStart: () => {
                svgContainer.style.overflowX = 'hidden'; // Hide the scrollbar
            },
            onComplete: () => {
                svgContainer.style.overflowX = 'auto'; // Show the scrollbar after animation
            },
            onUpdate: function() {
            const progress = gsap.getProperty(svgObject, "x") / maxScroll;
            if (progress < 0.1) {
                gsap.to(svgObject, { opacity: progress * 10, duration: 1 });
            } else if (progress > 0.9) {
                gsap.to(svgObject, { opacity: (1 - progress) * 10, duration: 1 });
            } else {
                gsap.to(svgObject, { opacity: 1, duration: 0 });
            }
            }
        });
    }
}



window.addEventListener('resize', () => {

    //autoScrollSVG();
    //adjustSVGSize();
    
});

if (window.innerWidth < 768) {

    //autoScrollSVG();

}


function loadSVGIntoElement(svgPath, containerElementId) {
    return new Promise((resolve, reject) => {
        fetch(svgPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const container = document.getElementById(containerElementId);
                if (!container) {
                    throw new Error(`Element with id ${containerElementId} not found.`);
                }
                const embedElement = document.createElement('embed');
                embedElement.type = 'image/svg+xml';
                const blob = new Blob([data], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                embedElement.src = url;
                embedElement.onload = () => {
                    URL.revokeObjectURL(url); // Revoke the object URL after the SVG is loaded
                    resolve(embedElement.getSVGDocument()); // Resolve with the getSVGDocument for manipulation
                };
                embedElement.classList.add('svg-object');
                container.appendChild(embedElement);
                //autoScrollSVG();
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
                reject(error); // Reject the promise if there's an error
            });
            
    });
}
document.addEventListener('DOMContentLoaded', () => {
    //adjustSVGSize();
    //autoScrollSVG();
    loadSVGIntoElement(sazPieceFilePath, sazPieceElementID)
        .then(svgDocument => {
            const pieceGroup = svgDocument.getElementById('Piece');
            const keylineGroup = svgDocument.getElementById('keyline');
            const starGroup = [];
            for (let i = 1; i <= 16; i++) {
                starGroup.push(svgDocument.getElementById(`star${i}`));
            }

            initializeSVGElements(keylineGroup, starGroup);
            addEventListenersToPieceGroup(pieceGroup, keylineGroup, starGroup);
        })
        .catch(error => {
            console.error('Error loading SVG into element:', error);
        });

function initializeSVGElements(keylineGroup, starGroup) {
    if (keylineGroup) {
        keylineGroup.style.opacity = 0; // Set initial opacity to 0
    }
    if (starGroup) {
        starGroup.forEach(star => {
            if (star) star.style.opacity = 0; // Set initial opacity to 0 for each star, making them invisible
        });
    }
}

function addEventListenersToPieceGroup(pieceGroup, keylineGroup, starGroup) {
    if (pieceGroup) {
        pieceGroup.addEventListener('mouseover', () => {
            animateKeylineAndStars(keylineGroup, starGroup);
        });

        pieceGroup.addEventListener('touchstart', () => {
            animateKeylineAndStars(keylineGroup, starGroup);
        });

        pieceGroup.addEventListener('mouseout', () => {
            gsap.to(keylineGroup, {
                opacity: 0,
                duration: 1,
                ease: "power1.in"
            });
        });
    } else {
        console.error("SVG group with ID 'Piece' not found.");
    }
}

function animateKeylineAndStars(keylineGroup, starGroup) {
    gsap.to(keylineGroup, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out"
    });
    starGroup.forEach((star, index) => {
        for (let i = 0; i < 1; i++) {
            const starCopy = star.cloneNode(true);
            star.parentNode.insertBefore(starCopy, star.nextSibling);

            gsap.fromTo(starCopy, 
                { opacity: 1 },
                {
                    motionPath: {
                        path: [
                            {x: 0, y: 0},
                            {x: 3, y: -3},
                            {x: -2, y: -6},
                            {x: 2, y: -9},
                            {x: -2, y: -12}
                        ],
                        curviness: .1,
                        autoRotate: false
                    },
                    opacity: 0,
                    duration: 1 + Math.random(),
                    delay: index * 0.1 + i * 0.2,
                    ease: "power1.out",
                    onStart: () => { starCopy.style.opacity = 1; },
                    onComplete: () => starCopy.remove()
                }
            );
        }
    });
}
});