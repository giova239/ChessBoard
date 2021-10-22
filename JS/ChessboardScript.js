//BOARD HANDLING
let board = document.getElementsByTagName("Board")[0];

if (board){

    let FEN_string = board.getAttribute("data-FEN");
    let squareNames =  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
                        "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                        "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                        "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                        "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                        "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                        "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                        "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",];
    
    let index = 0;
    [...FEN_string].forEach((c)=>{
        let newSquare;
        switch(c){
            case '/':
                break;
            case'p':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_Pawn");
                board.appendChild(newSquare);
                break;
            case'r':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_Rook");
                board.appendChild(newSquare);
                break;
            case'n':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_Knight");
                board.appendChild(newSquare);
                break;
            case'b':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_Bishop");
                board.appendChild(newSquare);
                break;
            case'q':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_Queen");
                board.appendChild(newSquare);
                break;
            case'k':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "Black_King");
                board.appendChild(newSquare);
                break;
            case'P':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_Pawn");
                board.appendChild(newSquare);
                break;
            case'R':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_Rook");
                board.appendChild(newSquare);
                break;
            case'N':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_Knight");
                board.appendChild(newSquare);
                break;
            case'B':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_Bishop");
                board.appendChild(newSquare);
                break;
            case'Q':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_Queen");
                board.appendChild(newSquare);
                break;
            case'K':
                newSquare = document.createElement("Square");
                newSquare.classList.add(squareNames[index++], "White_King");
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
                console.log("FEN string contains an INVALID CHARACTER -> " + c);
        }

    });
} 


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

    //Mouse cliccking
    elem.onmousedown = () => {
        [...document.getElementsByClassName("selected")].forEach((other)=>{
            other.classList.remove("selected");
            other.classList.remove("overing");
        })
        elem.classList.add("selected");
        elem.classList.add("overing");
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
    elem.ondragenter = (event) => {event.preventDefault();};
    elem.ondragover = (event) => {event.preventDefault();};
    elem.ondrop = (event) => {
        event.preventDefault();

        //GET DRAGGED ELEMENT
        let e = document.getElementById("dragging");
        e.removeAttribute("id");
        let draggedPiece = e.classList[1];
        let targetPiece = event.target.classList[1];
        let draggedSquare = e.classList[0];
        let targetSquare = event.target.classList[0];

        //PRINT MOVE
        console.log(draggedPiece + " moved from " + draggedSquare + " -> " + targetSquare);


        //TODO: check if move is legal
        

        //UPDATE TARGET SQUARE
        event.target.classList.replace(targetPiece, draggedPiece);
        event.target.setAttribute("draggable", true);

        //UPDATE STARTING SQUARE
        e.classList.replace(draggedPiece, "Empty");
        e.setAttribute("draggable", false);
    };

})