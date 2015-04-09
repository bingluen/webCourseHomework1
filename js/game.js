var canvas;
var ctx;
var bound;
var board;
var ball;
var score = 0;
var deadFlag = false;
$(document).ready(function() {
    //Get Canvas Object
    canvas = $('#myCanvas')[0];

    ctx = canvas.getContext('2d');
});


function gameStart() {
    init(canvas, ctx);
    deadFlag = false;
    //listen to keyboard
    $(document).keydown(function(event) {
        switch (event.keyCode) {
            case 39:
                moveBoard(board['speed']);
                if(board['speed'] < 100)
                    board['speed'] = board['speed'] + 1;
                break;
            case 37:
                moveBoard(-board['speed']);
                if(board['speed'] < 100)
                    board['speed'] = board['speed'] + 1;
                break;
        }
    });

    $(document).keyup(function(event) {
        switch (event.keyCode) {
            case 39:
                board['speed'] = 15;
                    break;
            case 37:
                board['speed'] = 15;
                break;
        }
    });

    setTimeout(function() {
        var startTime = (new Date()).getTime();
        animate(ball, canvas, ctx, startTime);
    }, 1000);
}


var box = {
    'pos': {
        'x': 0,
        'y': 0
    },
    'height': 640,
    'width': 480,
    'thickness': 5,
    'color': '#AAA'
};







window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();



function init(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bound = {
        'top': box['pos']['y'] + box['thickness'] / 2,
        'bottom': box['pos']['y'] + canvas.height - box['thickness'] / 2,
        'left': box['pos']['x'] + box['thickness'] / 2,
        'right': box['pos']['x'] + canvas.width - box['thickness'] / 2
    };

    board = {
        'width': 150,
        'thickness': 5,
        'pos': bound['left'],
        'speed': 15,
        'color': '#7F7'
    };

    ball = {
        'pos': {
            'x': 50,
            'y': 50
        },
        'r': 25,
        'color': '#eee',
        'speed': {
            'x': 5,
            'y': 5
        }
    };


    drawBox(ctx);
    drawBoard(ctx);

}


function drawBox(ctx) {
    //Set color
    ctx.strokeStyle = box['color'];
    //Set line width
    ctx.lineWidth = box['thickness'];
    //draw
    //ctx.strokeRect(box['thickness'] / 2 + box['pos']['x'], box['thickness'] / 2 + box['pos']['y'], box['height'], box['width']);
    ctx.beginPath();
    ctx.moveTo(bound['left'], bound['bottom']);
    ctx.lineTo(bound['left'], bound['top']);
    ctx.lineTo(bound['right'], bound['top']);
    ctx.lineTo(bound['right'], bound['bottom']);
    ctx.stroke();
}


function drawBoard() {
    ctx.strokeStyle = board['color'];
    ctx.lineWidth = board['thickness'];
    ctx.beginPath();
    ctx.moveTo(board['pos'], bound['bottom']);
    ctx.lineTo(board['pos'] + board['width'], bound['bottom']);
    ctx.stroke();
}

function moveBoard(unit) {
    //clear board
    ctx.clearRect(bound['left'] - board['thickness'] / 2, bound['bottom'] - board['thickness'] / 2, bound['right'] + board['thickness'] / 2, bound['bottom'] + board['thickness'] / 2);

    //move board
    board['pos'] += unit;

    if (board['pos'] < bound['left']) {
        board['pos'] = bound['left'];
    } else if (board['pos'] + board['width'] > bound['right']) {
        board['pos'] = bound['right'] - board['width'];
    }
}

function animate(graph, canvas, context, startTime) {

    var time = (new Date()).getTime() - startTime;

    //decide speed
    if ((graph['pos']['x'] + graph['r'] + graph['speed']['x']) >= bound['right'] || (graph['pos']['x'] - graph['r'] + graph['speed']['x']) <= bound['left']) {
        graph['speed']['x'] *= -1;
    }

    if ((graph['pos']['y'] - graph['r'] + graph['speed']['y']) <= bound['top']) {
        graph['speed']['y'] *= -1;
    } else if ((graph['pos']['y'] + graph['r']) >= bound['bottom'] && (graph['pos']['x'] + graph['r'] >= board['pos'] && graph['pos']['x'] - graph['r'] <= board['pos'] + board['width'])) {
        graph['speed']['y'] = Math.abs(graph['speed']['y']) * -1;
        $('#messages').html('<div class="alert alert-info" role="alert">Get 10 point</div>')
        score += 10;
        $('#score').html(score);
    } else if ((graph['pos']['y'] - graph['r'] + graph['speed']['y']) >= bound['bottom'] && (graph['pos']['x'] + graph['r'] < board['pos'] || graph['pos']['x'] - graph['r'] > board['pos'] + board['width'])) {
        deadFlag = true;
        $('#messages').html('<div class="alert alert-danger" role="alert">Game Over</div>')
    }



    var shift = {
        'x': graph['speed']['x'],
        'y': graph['speed']['y']
    };

    //clear ball
    context.clearRect(graph['pos']['x'] - graph['r'] - 1, graph['pos']['y'] - graph['r'] - 1, graph['r'] * 2 + 2, graph['r'] * 2 + 2);

    //apply shift
    graph['pos']['x'] += shift['x'];
    graph['pos']['y'] += shift['y'];

    drawBall(graph, context);
    drawBoard(context);
    drawBox(context);

    //condsider Acceleration of gravity
    /*
        
    if(ball['speed']['y'] > 0)
        ball['speed']['y'] += 0.098;
    else
    {
        ball['speed']['y'] += 0.009;
    }
    */

    //board['speed'] += 0.98;
    //console.log(ball['pos']);

    // request new frame
    if (!deadFlag) {
        requestAnimFrame(function() {
            animate(graph, canvas, context, startTime);
        });
    }

}

function drawBall(ball, context) {
    ctx.fillStyle = ball['color'];
    ctx.beginPath();
    ctx.arc(ball['pos']['x'], ball['pos']['y'], ball['r'], 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}
