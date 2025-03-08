import{loadSVGIntoElement} from './generalFunctions.js';



const sazHeaderFilePath = 'assets/images/SazHeader.svg';
const sazHeaderElementID = 'SazPiece';

document.addEventListener('DOMContentLoaded', () => {
    loadSVGIntoElement(sazHeaderFilePath, sazHeaderElementID);
});