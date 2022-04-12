// Adding the canvas with id="imageView" from HTML
let canvaso = document.getElementById("imageView");
canvaso.width = 1200 
canvaso.height = 600

// Get 2d canvas context from canvas id="imageView"
// This canvas involves the drawings
let contexto = canvaso.getContext("2d")
contexto.fillStyle = "white"
contexto.fillRect(0, 0, canvaso.width, canvaso.height)

// Temporary context/canvas for drawing
// The drawings of this canvas are pushed 
// to the imageView canvas
let container = canvaso.parentNode
let canvas = document.createElement("canvas")
canvas.id = 'imageTemp'
canvas.width = canvaso.width
canvas.height = canvaso.height
container.appendChild(canvas)

let context = canvas.getContext('2d')

let drawValue = document.querySelector('input[name="shapes"]:checked').value;
// Variables to starting point of the shape drawing
let start_x
let start_y

// String selected value of the buttons
// pen selected when opened
let drawing_shape = "pen"

let start_background_color = "white"
let draw_color = "black"
let draw_width = ""
let is_drawing = false

//undo variables
let restore_array = []
let index = -1

//redo variables here
//      probably other array where to throw restore array objects
// JUST WROTE THE VARIABLES NOT WORKING
let redo_array = []
let redo_index = -1


// onClick function used from color elements 
// to select the drawing color 
function change_color(element) {
    draw_color = element.style.backgroundColor
    console.log(element.style.backgroundColor)
    console.log("draw_color: " + draw_color)
}

// Event listeners to draw for mobile
canvas.addEventListener("touchstart", start, false)
canvas.addEventListener("touchmove", draw, false)
canvas.addEventListener("touchout", stop, false)
// To computer
canvas.addEventListener("mousedown", start, false)
canvas.addEventListener("mousemove", draw, false)
canvas.addEventListener("mouseup", stop, false)
canvas.addEventListener("mouseout", stop, false)

// Function to start drawing
function start(event) {
    drawValue = document.querySelector('input[name="shapes"]:checked').value;
    console.log("Drawing a shape: " + drawValue)
    console.log("Starting drawing")
    is_drawing = true
    console.log("is_drawing: " + is_drawing)

    context.beginPath()
    start_x = event.clientX - canvas.offsetLeft
    start_y = event.clientY - canvas.offsetTop

    context.moveTo(start_x, start_y)
                    
    event.preventDefault()
}

// Function to draw
// Draws the selected shape
function draw(event) {

    if (is_drawing){

        switch (drawValue){
            case "pen":
                console.log("Drawing with pen") 
                context.lineTo(event.clientX - canvas.offsetLeft,
                    event.clientY - canvas.offsetTop)
                context.strokeStyle = draw_color
                context.lineWidth = draw_width
                context.lineCap = "round"
                context.lineJoin = "round"
                context.stroke()
                break;
            case "line":
                console.log("Drawing line")    
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath()
                context.moveTo(start_x, start_y)
                context.lineTo(event.clientX - imageTemp.offsetLeft,
                                event.clientY - imageTemp.offsetTop);
                context.strokeStyle = draw_color
                context.lineWidth = draw_width                                
                context.stroke();
                context.closePath();
                break;
            case "rect":
                console.log("Drawing rectancle")
                
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.beginPath()
                context.moveTo(start_x, start_y)
                context.rect(start_x, start_y, 
                             event.clientX - start_x - imageTemp.offsetLeft,
                             event.clientY - start_y - imageTemp.offsetTop)
                context.strokeStyle = draw_color
                context.lineWidth = draw_width
                context.stroke()
                context.closePath()
                break;
            case "circ":
                console.log("Drawing circle")
                // x and y distance from starting point of the circle when drawing
                let x_distance = Math.abs(event.clientX - start_x - imageTemp.offsetLeft)
                let y_distance = Math.abs(event.clientY - start_y - imageTemp.offsetTop)
                let arc_size;
                if (x_distance > y_distance){
                    arc_size = x_distance
                } else{
                    arc_size = y_distance
                }

                context.clearRect(0, 0, canvas.width, canvas.height)
                context.beginPath()
                context.arc(start_x, start_y, arc_size, 0, 2 * Math.PI)
                context.strokeStyle = draw_color
                context.lineWidth = draw_width
                context.stroke()
                context.closePath()
                break;
            case "write":
                //can't work with mousemove event

                // pause mousemove somehow? and how
                console.log("Writing")
                
                context.font = "30px Arial"
                context.strokeText("Sorry I'm not available", start_x, start_y,)


        }       

    }
    event.preventDefault()
}

// Function to stop the the drawing event
// Sets the drawed shape to the imageView canvas
function stop(event) {
    if(is_drawing) {
        console.log("Ending drawing")
        context.stroke()
        context.closePath()
        is_drawing = false
        drawing_shape = 0
        //img_update() adds the data to the imageview and then it's
        //pushed to the array
        img_update();
        //push to the array
        restore_array.push(contexto.getImageData(0, 0, canvas.width, canvas.height))
        index += 1
        console.log(restore_array)
    } 
    event.preventDefault()
}

// Updates the image datas to the imageView canvas
// Clears the other canvas's drawings (to make new drawing)
function img_update() {
    contexto.drawImage(canvas, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
}

// Clear the canvas and resets the array & index values
function clear_canvas() {
    contexto.fillStyle = start_background_color
    //why clearRect? (if only, color as page's background)
    contexto.clearRect(0, 0, canvas.width, canvas.height)
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    restore_array = []
    index = -1

}

// Undo the last drawing
// Should make to work from CTRL+Z
// mahdollisesti pois
function undo_last(){
    if ( index <= 0){
        clear_canvas()
    } else {
        index -= 1;
        //removes the last element
        restore_array.pop()
        contexto.putImageData(restore_array[index], 0, 0)
    }
}

// Redo the last selected undo
function redo_last() {
    
}

//makes a PNG capture of the drawing
//yes or no could be added when clicked
function captureCanvas() {
    //if windows explorer (working)
    // (actually there is many things which ain't working
    // well with IE (e.g. slider, colorpicker))
    if (window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(canvas.msToBlob(), "drawing.png")
    }else {
        const a = document.createElement("a")
        console.log(a)
        document.body.appendChild(a)
        console.log(a)
        a.href = imageView.toDataURL()
        a.download = "drawing.png"
        a.click()
        document.body.removeChild(a)
        console.log(a)
    }
} 



/* 

todo:
- background change
- make custom cursor to draw
- redo button?
- redesign color choser
- Width slider not working properly
- make image from canvas background?
- select resolution
- ctr+z undo
- draw design on paper so would be easier to know what
- writing [A] to work
- onload and buttons to work

done:
- Design drawing (31.3.2022)
- undo, clear, colors working (5.4.2022)
- draw lines, rectangles, circles (11.04.2022)

 */