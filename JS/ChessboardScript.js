//IMPORT Chess.js OPEN SOURCE LIBRARY
let chess;

//BOARD HANDLING
let board = document.getElementsByTagName("Board")[0];

if (board){

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

        //CLICKED ON A TARGET
        if(elem.classList.contains("target")){

            //CALLING THE MAKEMOVE FUNCTION
            makeMove(elem);

        //CLICKED ON A PIECE
        }else{

            //REMOVE OLD marks
            [...document.getElementsByClassName("selected")].forEach((other)=>{
                other.classList.remove("selected");
                other.classList.remove("overing");
            });
            [...document.getElementsByClassName("target")].forEach((other)=>{
                other.classList.remove("target");
            });

            //GET LEGAL MOVES
            let legalMoves = chess.moves({square: elem.classList[0], verbose: true});
            console.log("Legal Moves: " + legalMoves);

            //ADD NEW MARKS
            elem.classList.add("selected");
            [...legalMoves].forEach((move) => {
                let squareName = move.to;
                document.getElementsByClassName(squareName)[0].classList.add("target");

            });

        }

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

        //CALLING THE MAKEMOVE FUNCTION
        makeMove(event.target);

    };

})

function makeMove(target){

    //GET DRAGGED ELEMENT
    let e = document.getElementsByClassName("selected")[0];
    e.removeAttribute("id");
    let draggedPiece = e.classList[1];
    let targetPiece = target.classList[1];
    let draggedSquare = e.classList[0];
    let targetSquare = target.classList[0];

    //CHECK IF MOVE IS LEGAL
    
    let m = chess.move({from: draggedSquare,to: targetSquare, promotion: 'q'});
    if(m){
        //UPDATE TARGET SQUARE
        target.classList.replace(targetPiece, draggedPiece);
        target.setAttribute("draggable", true);

        //UPDATE STARTING SQUARE
        e.classList.replace(draggedPiece, "Empty");
        e.setAttribute("draggable", false);

        //REMOVE MARKS
        [...document.getElementsByClassName("selected")].forEach((other)=>{
            other.classList.remove("selected");
            other.classList.remove("overing");
        });
        [...document.getElementsByClassName("target")].forEach((other)=>{
            other.classList.remove("target");
        });

        //PRINT MOVE
        console.log("move: " + m.san);

        //HANDLE SPECIAL CASES (Castle, Enpassant and Promotion)
        if(m.flags == "k"){//short castle
            if(m.color == "w"){
                document.getElementsByClassName("h1")[0].classList.replace("R","Empty");
                document.getElementsByClassName("f1")[0].classList.replace("Empty","R");
            }else{
                document.getElementsByClassName("h8")[0].classList.replace("r","Empty");
                document.getElementsByClassName("f8")[0].classList.replace("Empty","r");
            }
        }else if(m.flags == "q"){//long castle
            if(m.color == "w"){
                document.getElementsByClassName("a1")[0].classList.replace("R","Empty");
                document.getElementsByClassName("d1")[0].classList.replace("Empty","R");
            }else{
                document.getElementsByClassName("a8")[0].classList.replace("r","Empty");
                document.getElementsByClassName("d8")[0].classList.replace("Empty","r");
            }
        }else if(m.flags == "e"){//enpassant
            let p = m.to[0]+m.from[1];
            if(m.color == "w")
                document.getElementsByClassName(p)[0].classList.replace("p","Empty");
            else
                document.getElementsByClassName(p)[0].classList.replace("P","Empty");
        }else if(m.flags == "np" || m.flags == "cp"){//promotion
            let p = m.to;
            if(m.color == "w")
                document.getElementsByClassName(p)[0].classList.replace("P","Q");
            else
                document.getElementsByClassName(p)[0].classList.replace("p","q");
        }


    }else{
        console.log("illegal move");
    }

}