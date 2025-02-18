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
                const objectElement = document.createElement('object');
                objectElement.type = 'image/svg+xml';
                objectElement.data = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' }));
                objectElement.classList.add('svg-object');
                container.appendChild(objectElement);
                objectElement.onload = () => {
                    resolve(objectElement.contentDocument); // Resolve with the contentDocument for manipulation
                };
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
                reject(error); // Reject the promise if there's an error
            });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadSVGIntoElement(sazPieceFilePath, sazPieceElementID)
        .then(svgDocument => {
            // Access SVG elements and add animations
            const pieceGroup = svgDocument.getElementById('Piece');
            const keylineGroup = svgDocument.getElementById('keyline');
            const starGroup = [];
                for (let i = 1; i <= 16; i++){starGroup.push(svgDocument.getElementById(`star${i}`));}

            if (keylineGroup) {
                keylineGroup.style.opacity = 0; // Set initial opacity to 0
            }
            if (starGroup) {
                starGroup.forEach(star => {
                    if (star) star.style.opacity = 0; // Set initial opacity to 0 for each star, making them invisible
                });
            }

            if (pieceGroup) {
                // Add event listener for mouseover to change opacity and animate stars
                pieceGroup.addEventListener('mouseover', () => {
                    gsap.to(keylineGroup, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                    starGroup.forEach((star, index) => {
                        // Create multiple copies of each star and animate them
                        for (let i = 0; i < 1; i++) { // Assuming we want to create 5 copies
                            const starCopy = star.cloneNode(true); // Clone the star
                            star.parentNode.insertBefore(starCopy, star.nextSibling); // Insert the copy after the original star
            
                            gsap.fromTo(starCopy, 
                                { opacity: 1 }, // Start from opacity 1
                                {
                                    motionPath: {
                                        path: [
                                            {x: 0, y: 0},
                                            {x: 3, y: -3}, // Moves right and up
                                            {x: -2, y: -6}, // Moves left and further up
                                            {x: 2, y: -9}, // Moves right and even further up
                                            {x: -2, y: -12} // Moves left and to the highest point
                                        ],
                                        curviness: .1, // Adjust curviness to make the S shape softer or more pronounced
                                        autoRotate: false // Optionally, auto-rotate the star to align with the path direction
                                    },
                                    opacity: 0, // End at opacity 0
                                    duration: 1 + Math.random(), // Random duration between 1 and 2 seconds
                                    delay: index * 0.1 + i * 0.2, // Stagger the animation based on the star index and copy number
                                    ease: "power1.out",
                                    onStart: () => { starCopy.style.opacity = 1; }, // Ensure opacity is set to 1 at the start
                                    onComplete: () => starCopy.remove() // Remove the star copy after animation completes
                                }
                            );
                        }
                    });
                });

                // Add event listener for mouseout to reset opacity
                pieceGroup.addEventListener('mouseout', () => {
                    gsap.to(keylineGroup, {
                        opacity: 0,
                        duration: 1,
                        ease: "power1.in"
                    }); 
                    // starGroup.forEach((star, index) => {
                    //     gsap.to(star, {
                    //         opacity: 0,
                    //         duration: 0.3,
                    //         delay: index * 0.1,
                    //         ease: "power1.in"
                    //     });
                    // });
                });
            } else {
                console.error("SVG group with ID 'Piece' not found.");
            }
        })
        .catch(error => {
            console.error('Error loading SVG into element:', error);
        });
});