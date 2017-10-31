
// console.log('input handler loaded')

window.onload=function(){
    window.addEventListener('keydown', function (key) {
        keyboardDown(key);
    }, false);

    window.addEventListener('keyup', function (key) {
        keyboardUp(key);
    }, false);
}

// keyboard mapping 
function keyboardDown(key) {
    switch (key.keyCode) {
        case 65: //'a'
            var kickpad = document.getElementById("kickPad"); 
            kickpad.className = 'active';
            simulateClick(kickpad);
            break;
        case 83: //'s'
            var snarepad = document.getElementById("snarePad"); 
            snarepad.className = 'active';
            simulateClick(snarepad);
            break;
        case 76: //'l'
            var hihatpad = document.getElementById("hihatPad"); 
            hihatpad.className = 'active';
            simulateClick(hihatpad);
            break;
    }
}

function keyboardUp(key) {
    switch (key.keyCode) {
        case 65: //'a'
            var kickpad = document.getElementById("kickPad"); 
            kickpad.className = '';
            break;
        case 83: //'s'
            var snarepad = document.getElementById("snarePad"); 
            snarepad.className = '';
            break;
        case 76: //'l'
            var hihatpad = document.getElementById("hihatPad"); 
            hihatpad.className = '';
            break;
    }
}

// simulated mousedown on buttons
function simulateClick(element) {
    var event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
}


