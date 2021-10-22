let pieces = document.getElementsByTagName("Piece");

[...pieces].forEach((elem)=> {

    elem.onmouseover = () => {
        elem.classList.add("overing");
    };

    elem.onmouseout = () => {
        elem.classList.remove("overing");
    };

    elem.onmousedown = () => {
        [...document.getElementsByClassName("selected")].forEach((other)=>{
            other.classList.remove("selected");
        })
        elem.classList.add("selected");
    };

    elem.setAttribute("draggable", true);

    elem.ondragstart = () => {
        [...document.getElementsByClassName("selected")].forEach((other)=>{
            other.classList.remove("selected");
        })
        elem.classList.add("dragging");
    };

    elem.ondragend = () => {
        elem.classList.remove("dragging");
    };

    elem.ondragleave = (event) => {
        event.preventDefault();
        console.log(event.target);
    };

})