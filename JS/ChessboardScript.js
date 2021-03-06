//IMPORT SOUNDS and DECLARE CHESS object
let chess;
let move_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Move.mp3");
let capture_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Capture.mp3");
let castle_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Castle.mp3");
let check_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Check.mp3");
let checkmate_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Checkmate.mp3");
let error_sound = new Audio ("http://localhost:8080/ASSETS/SOUNDS/Error.mp3");
let arrowStart;

//BOARD HANDLING
let board = document.getElementsByTagName("Board")[0];

if (board && board.hasAttribute("data-FEN")){

    let FEN_string = board.getAttribute("data-FEN");
    chess = new Chess(FEN_string);
    FEN_string = FEN_string.split(" ")[0];

    let squareNames =  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
                        "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                        "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                        "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",];
    
    //POPULATING THE BOARD WITH SQUARES AND PIECES
    let index = 0;
    [...FEN_string].forEach((c)=>{
        let newSquare;
        switch(c){
            case '/':
                break;
            case'p': case'r': case'n': case'b': case'q': case'k': case'P': case'R': case'N': case'B': case'Q': case'K':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], c);
                board.appendChild(newSquare);
                break;
            case'1': case'2': case'3': case'4': case'5': case'6': case'7': case'8':
                for(let i = 0; i<Number(c); i++){
                    newSquare = document.createElement("Square");
                    newSquare.classList.add(squareNames[index++], "Empty");
                    board.appendChild(newSquare);
                }
                break;
            default:
                break;
        }
    });

    //SQUARES AND PIECES HANDLING
    let squares = document.getElementsByTagName("Square");

    [...squares].forEach((elem)=> {

        //Make Pieces Draggable
        if(elem.classList.contains("Empty")){
            elem.setAttribute("draggable", false);
        }else{
            elem.setAttribute("draggable", true);
        }

        //Mouse overing
        elem.onmouseover = () => {
            elem.classList.add("overing");
        };

        elem.onmouseout = () => {
            if(!elem.classList.contains("selected"))
            elem.classList.remove("overing");
        };

        //Mouse clicking
        elem.onmousedown = (event) => {

            //LEFT CLICK
            if(event.button == 0){
                //CLICKED ON A TARGET
                if(elem.classList.contains("targeted")){

                    //CALLING THE MAKEMOVE FUNCTION
                    makeMove(elem);

                //CLICKED ON A PIECE
                }else{

                    //REMOVE OLD marks
                    removeMarks();
                    //GET LEGAL MOVES
                    let legalMoves = chess.moves({square: elem.classList[0], verbose: true});

                    //ADD NEW MARKS
                    elem.classList.add("selected");
                    [...legalMoves].forEach((move) => {
                        let squareName = move.to;
                        document.getElementsByClassName(squareName)[0].classList.add("target");

                    });

                }
            //RIGHT CLICK
            }else{
                arrowStart = elem.classList[0];
            }

        };

        elem.onmouseup = (event) => {
            if(event.button == 2){
                drawArrow(arrowStart, elem.classList[0]);
            }
        };

        //Mouse RIGHT CLICK prevent menu from opening
        elem.oncontextmenu = (event) => {event.preventDefault();};

        //Mouse Overing
        elem.onmouseenter = () => {
            elem.classList.replace("target", "targeted");
        };
        elem.onmouseleave = () => {
            elem.classList.replace("targeted", "target");
        };

        //Mouse Dragging
        elem.ondragstart = (event) => {
            event.dataTransfer.effectAllowed = "move";
            elem.id = "dragging";
        };

        elem.ondragend = () => {
            elem.removeAttribute("id");
        };

        //Mouse Dropping
        elem.ondragenter = (event) => {
            event.preventDefault();
            event.target.classList.replace("target", "targeted");
        };
        elem.ondragover = (event) => { event.preventDefault();};
        elem.ondragleave = (event) => {
            event.preventDefault();
            event.target.classList.replace("targeted", "target");
        };
        elem.ondrop = (event) => {
            event.preventDefault();

            //CALLING THE MAKEMOVE FUNCTION
            makeMove(event.target);

        };

    })

    //AROWGRID HANDLING
    let arrowGrid = document.getElementsByTagName("ArrowGrid")[0];

    if(arrowGrid){
        [...squareNames].forEach((c)=>{
            let newArrow = document.createElement("Arrow");
            newArrow.classList.add(c, "None");
            arrowGrid.appendChild(newArrow);
        });
    }
} 

function makeMove(target){

    //GET DRAGGED ELEMENT
    let e = document.getElementsByClassName("selected")[0];
    e.removeAttribute("id");
    let draggedPiece = e.classList[1];
    let targetPiece = target.classList[1];
    let draggedSquare = e.classList[0];
    let targetSquare = target.classList[0];

    //REMOVE OLD marks
    removeMarks();

    //CHECK IF MOVE IS LEGAL
    let m = chess.move({from: draggedSquare,to: targetSquare, promotion: 'q'});
    if(m){

        //UPDATE TARGET SQUARE
        target.classList.replace(targetPiece, draggedPiece);
        target.setAttribute("draggable", true);
        target.classList.remove("targeted");

        //UPDATE STARTING SQUARE
        e.classList.replace(draggedPiece, "Empty");
        e.setAttribute("draggable", false);

        //PRINT MOVE
        console.log(m.san);

        //HANDLE EVERY CASE (Move, Capture, Castle, Enpassant, Promotion, check, and checkMate) AND PLAY SOUNDS
        let p;
        switch(m.flags){
            case "n": case "b": //non-capture move
                move_sound.play();
                break;
            case "c": //capture move
                capture_sound.play();
                break;
            case "k": //short castle
                castle_sound.play();
                if(m.color == "w"){
                    document.getElementsByClassName("h1")[0].classList.replace("R","Empty");
                    document.getElementsByClassName("f1")[0].classList.replace("Empty","R");
                }else{
                    document.getElementsByClassName("h8")[0].classList.replace("r","Empty");
                    document.getElementsByClassName("f8")[0].classList.replace("Empty","r");
                }
                break;
            case "q": //long castle
                castle_sound.play();
                if(m.color == "w"){
                    document.getElementsByClassName("a1")[0].classList.replace("R","Empty");
                    document.getElementsByClassName("d1")[0].classList.replace("Empty","R");
                }else{
                    document.getElementsByClassName("a8")[0].classList.replace("r","Empty");
                    document.getElementsByClassName("d8")[0].classList.replace("Empty","r");
                }
                break;
            case "e": //enpassant
                capture_sound.play()
                p = m.to[0]+m.from[1];
                if(m.color == "w")
                    document.getElementsByClassName(p)[0].classList.replace("p","Empty");
                else
                    document.getElementsByClassName(p)[0].classList.replace("P","Empty");
                break;
            case "np": case "cp": //promotion
                if(m.flags == "np"){
                    move_sound.play();
                }else{
                    capture_sound.play();
                }
                p = m.to;
                if(m.color == "w")
                    document.getElementsByClassName(p)[0].classList.replace("P","Q");
                else
                    document.getElementsByClassName(p)[0].classList.replace("p","q");
                break;
            default:
                break;
        }
        //CHECKS and CHECKMATE
        let lastSymbol = m.san[m.san.length-1];
        if(lastSymbol == "+"){
            markKing(m.color);
            check_sound.play();
        }else if (lastSymbol == "#"){
            markKing(m.color);
            checkmate_sound.play();
        }else{
            let temp = document.getElementsByClassName("inCheck")[0];
            if(temp) temp.classList.remove("inCheck");
        }

    }else{
        //Play ERROR SOUND
        error_sound.play
        console.log("illegal move");
    }

}

function markKing(color) {
    if(color == "w"){
        document.getElementsByClassName("k")[0].classList.add("inCheck");
    }else{
        document.getElementsByClassName("K")[0].classList.add("inCheck");
    }
}

function removeMarks() {
    [...document.getElementsByClassName("selected")].forEach((other)=>{
        other.classList.remove("selected");
        other.classList.remove("overing");
    });
    [...document.getElementsByClassName("target")].forEach((other)=>{
        other.classList.remove("target");
    });
    [...document.getElementsByClassName("targeted")].forEach((other)=>{
        other.classList.remove("targeted");
    });
    [...document.getElementsByTagName("Arrow")].forEach((other)=>{
        let toRemove = other.classList[1];
        other.classList.replace(toRemove, "None");
    });
}

function drawArrow(from, to) {
    console.log(from + " -> " + to);

    if(from == to){
        //Highlight
        setArrow(from, "highlighted");
    }else{
        let columnsDiff = from.charCodeAt(0) - to.charCodeAt(0);
        let rowsDiff = from[1] - to[1]
        console.log("[ " + columnsDiff + " , " + rowsDiff + " ]");

        if(columnsDiff == 0){
            //Vertical Line
            if(rowsDiff > 0){
                //down
                setArrow(from, "startdown");
                for(let i = 1; i < rowsDiff; i++){
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1)-i), "vertical");
                }
                setArrow(to, "downarrow");
            }else{
                //up
                setArrow(from, "startup");
                for(let i = 1; i < -rowsDiff; i++){
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1)+i), "vertical");
                }
                setArrow(to, "uparrow");
            }
        }else if(rowsDiff == 0){
            //Horizontal Line
            if(columnsDiff > 0){
                //left
                setArrow(from, "startleft");
                for(let i = 1; i < columnsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)-i) + from[1], "horizontal");
                }
                setArrow(to, "leftarrow");
            }else{
                //right
                setArrow(from, "startright");
                for(let i = 1; i < -columnsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)+i) + from[1], "horizontal");
                }
                setArrow(to, "rightarrow");
            }
        //Oblique Line
        }else if (columnsDiff-rowsDiff == 0){
            if(columnsDiff > 0){
                //downleft
                setArrow(from, "startdownleft");
                for(let i = 1; i < rowsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)-i) + String.fromCharCode(from.charCodeAt(1)-i), "oblique1");
                }
                setArrow(to, "downleftarrow");
            }else{
                //upright
                setArrow(from, "startupright");
                for(let i = 1; i < -rowsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)+i) + String.fromCharCode(from.charCodeAt(1)+i), "oblique1");
                }
                setArrow(to, "uprightarrow");
            }
        }else if (columnsDiff+rowsDiff == 0){
            if(columnsDiff > 0){
                //upleft
                setArrow(from, "startupleft");
                for(let i = 1; i < -rowsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)-i) + String.fromCharCode(from.charCodeAt(1)+i), "oblique2");
                }
                setArrow(to, "upleftarrow");
            }else{
                //downright
                setArrow(from, "startdownright");
                for(let i = 1; i < rowsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)+i) + String.fromCharCode(from.charCodeAt(1)-i), "oblique2");
                }
                setArrow(to, "downrightarrow");
            }
        }else if (Math.abs(columnsDiff) > Math.abs(rowsDiff)){
            //horizontal edge vertical
            if(columnsDiff > 0){
                //horizontalleft
                setArrow(from, "startleft");
                for(let i = 1; i < columnsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)-i) + from[1], "horizontal");
                }
                if(rowsDiff > 0){
                    //verticaldown
                    setArrow(String.fromCharCode(from.charCodeAt(0) - columnsDiff) + from[1] , "rightdown");
                    for(let i = 1; i < rowsDiff; i++){
                        setArrow(to[0] + String.fromCharCode(to.charCodeAt(1)+i), "vertical");
                    }
                    setArrow(to, "downarrow");
                }else{
                    //verticalup
                    setArrow(String.fromCharCode(from.charCodeAt(0) - columnsDiff) + from[1], "upright");
                    for(let i = 1; i < -rowsDiff; i++){
                        setArrow(to[0] + String.fromCharCode(to.charCodeAt(1)-i), "vertical");
                    }
                    setArrow(to, "uparrow");
                }
            }else{
                //horizontalright
                setArrow(from, "startright");
                for(let i = 1; i < -columnsDiff; i++){
                    setArrow(String.fromCharCode(from.charCodeAt(0)+i) + from[1], "horizontal");
                }
                if(rowsDiff > 0){
                    //verticaldown
                    setArrow(String.fromCharCode(from.charCodeAt(0) - columnsDiff) + from[1] , "downleft");
                    for(let i = 1; i < rowsDiff; i++){
                        setArrow(to[0] + String.fromCharCode(to.charCodeAt(1)+i), "vertical");
                    }
                    setArrow(to, "downarrow");
                }else{
                    //verticalup
                    setArrow(String.fromCharCode(from.charCodeAt(0) - columnsDiff) + from[1], "leftup");
                    for(let i = 1; i < -rowsDiff; i++){
                        setArrow(to[0] + String.fromCharCode(to.charCodeAt(1)-i), "vertical");
                    }
                    setArrow(to, "uparrow");
                }
            }
        }else{
            //vertical edge horizontal
            if(rowsDiff > 0){
                //vertical down
                setArrow(from, "startdown");
                for(let i = 1; i < rowsDiff; i++){
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1)-i), "vertical");
                }
                if(columnsDiff > 0){
                    //horizontalleft
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1) - rowsDiff) , "leftup");
                    for(let i = 1; i < columnsDiff; i++){
                        setArrow(String.fromCharCode(to.charCodeAt(0)+i) + to[1], "horizontal");
                    }
                    setArrow(to, "leftarrow");
                }else{
                    //horizontalright
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1) - rowsDiff), "upright");
                    for(let i = 1; i < -columnsDiff; i++){
                        setArrow(String.fromCharCode(to.charCodeAt(0)-i) + to[1], "horizontal");
                    }
                    setArrow(to, "rightarrow");
                }
            }else{
                //vertical up
                setArrow(from, "startup");
                for(let i = 1; i < -rowsDiff; i++){
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1)+i), "vertical");
                }
                if(columnsDiff > 0){
                    //horizontalleft
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1) - rowsDiff) , "downleft");
                    for(let i = 1; i < columnsDiff; i++){
                        setArrow(String.fromCharCode(to.charCodeAt(0)+i) + to[1], "horizontal");
                    }
                    setArrow(to, "leftarrow");
                }else{
                    //horizontalright
                    setArrow(from[0] + String.fromCharCode(from.charCodeAt(1) - rowsDiff), "rightdown");
                    for(let i = 1; i < -columnsDiff; i++){
                        setArrow(String.fromCharCode(to.charCodeAt(0)-i) + to[1], "horizontal");
                    }
                    setArrow(to, "rightarrow");
                }
            }
        }
    }
}

function setArrow (square, arrow){
    let a = document.querySelector("arrow." + square).classList;
    let toRemove = a[1];
    a.replace(toRemove, arrow);
}