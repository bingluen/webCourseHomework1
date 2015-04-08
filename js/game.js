// 在這裡寫 js code
// 取得 canvas 物件
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
// 外牆的起始點、框線寬度與顏色
var startX = 10;
var startY = 10;
var wallLineWidth = 10;
var wallColor = "#AAAAAA";
var wallWidth = c.width - wallLineWidth*2;
var wallHeight = c.height - wallLineWidth*2;
// 計算牆的邊界
var topBound = startX + wallLineWidth/2;
var bottomBound = startX + wallWidth - wallLineWidth/2;
var leftBound = startY + wallLineWidth/2;
var rightBound = startY + wallHeight - wallLineWidth/2;
// 畫牆
function drawWall() {
ctx.strokeStyle = wallColor;
ctx.lineWidth = wallLineWidth;
ctx.strokeRect(startX, startY, wallWidth, wallHeight);
}
// 畫木板
var boardWidth = 60;
var boardStart = Math.floor(Math.random()*(wallWidth-wallLineWidth-boardWidth)) + 15;
// 計算木板移動的左右界限
var boardLeftBound = leftBound;
var boardRightBound = rightBound - boardWidth;
// 每次木板的位移量
var unit = 10;
function drawBoard() {
ctx.strokeStyle = "blue";
ctx.beginPath();
ctx.moveTo(boardStart, c.height - wallLineWidth);
ctx.lineTo(boardStart+boardWidth, c.height - wallLineWidth);
ctx.closePath();
ctx.stroke();
}
// 移動木板
function moveBoard(unit){
ctx.fillStyle = wallColor;
ctx.fillRect(boardStart, c.height - wallLineWidth*1.5, boardWidth, wallLineWidth);
boardStart += unit;
if(boardStart < boardLeftBound) {
boardStart = boardLeftBound;
} else if(boardStart > boardRightBound){
boardStart = boardRightBound;
}
drawBoard();
}
// 偵測鍵盤事件
window.onkeydown = function(event){
switch(event.keyCode){
case 37:  // 向左
moveBoard(-unit);
break;
case 39:  // 向右
moveBoard(unit);
break;
}
};
// 彈力球的起始點與半徑
var ballX = 100;
var ballY = 100;
var ballR = 10;
// 把牆的邊界加/減上彈力球的半徑就是球的邊界
var ballTopBound = topBound + ballR;
var ballBottomBound = bottomBound - ballR;
var ballLeftBound = leftBound + ballR;
var ballRightBound = rightBound - ballR;
// 彈力球的速度
var speedX = 10;
var speedY = 20;
// 移動球
function moveBall(){
// 把目前的球擦掉
ctx.clearRect(ballX-ballR, ballY-ballR, ballR*2, ballR*2);
// 加上位移，計算新的位置
ballX+= speedX;
ballY+= speedY;
// 檢查是否有撞到左右邊界，有的話要反彈
if(ballX <= ballLeftBound) {
var dx = ballLeftBound - (ballX - speedX);
ballX = ballLeftBound;
var dy = Math.round((dx/speedX) * speedY);
ballY = ballY - speedY + dy;
// 反彈
speedX = -speedX;
} else if(ballX >= ballRightBound) {
var dx = ballRightBound - (ballX - speedX);
ballX = ballRightBound;
var dy = Math.round((dx/speedX) * speedY);
ballY = ballY - speedY + dy;
speedX = -speedX;
}
// 計算是否有撞到上下邊界
if(ballY <= ballTopBound) {
// 有撞到上邊界，反彈
var dy = ballTopBound - (ballY - speedY);
ballY = ballTopBound;
var dx = Math.round((dy/speedY) * speedX);
ballX = ballX - speedX + dx;
speedY = -speedY;
} else if(ballY >= ballBottomBound) {
// 撞到下邊界時，要檢查是不是有撞在木板上，有的話反彈
if(ballX>=boardStart && ballX<=(boardStart+boardWidth)) {
var dy = ballBottomBound - (ballY - speedY);
ballY = ballBottomBound;
var dx = Math.round((dy/speedY) * speedX);
ballX = ballX - speedX + dx;
speedY = -speedY;
score += dScore;
document.getElementById("scoreDisplay").innerHTML = score;
} else {
// 沒有的話就掉出界外，輸掉遊戲
ctx.fillStyle = "red";
ctx.font = "60px impact";
ctx.textAlign = "center";
ctx.fillText("你輸了！", c.width/2, c.height/2, 200);
gameStart = false;
}
}
// 根據以上計算出來的位置，重新畫彈力球
drawBall();
if(gameStart){
setTimeout(moveBall, 200);
}
}
// 繪製彈力球
function drawBall() {
ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(ballX, ballY, ballR, 0, 2*Math.PI);
ctx.closePath();
ctx.fill();
}
var gameStart = false;
var score = 0;
var dScore = 10;
// 讓使用者設定彈力球的起始點
document.getElementById("startXRange").onchange = function(e){
if(gameStart) {
return;
}
// 清空畫布，重新開始繪製
ctx.clearRect(0, 0, c.width, c.height);
// 畫外牆
drawWall();
ballX = document.getElementById("startXRange").value;
ballY = 100;
drawBall();
};
// 背景
var bg = document.getElementById("bg");
var offset = 0;
function drawBackground(){
var y = offset;
var i = 0;
while (y < c.height) {
var x = 0;
while (x < c.width) {
ctx.drawImage(bg, x, y, bg.width, bg.height);
x += bg.width;
}
y += bg.height;
}
}
// 初始化動作
function init(){
// 重設分數
score = 0;
document.getElementById("scoreDisplay").innerHTML = score;
// 清空畫布，重新開始繪製
ctx.clearRect(0, 0, c.width, c.height);
// 畫外牆
drawWall();
// 準備彈力球的起始點，開始繪製彈力球
ballX = Number(document.getElementById("startXRange").value);
ballY = 100;
drawBall();
if(firstLoad === false) {
// 隨機產生木板的起始點
boardStart = Math.floor(Math.random()*(wallWidth-wallLineWidth-boardWidth)) + 15;
drawBoard();
startGame();
} else {
firstLoad = false;
}
}
function startGame(){
gameStart = true;
// 讓球定時移動
setTimeout(moveBall, 200);
}
var firstLoad = true;
window.onload = init;
// 掛載 click 事件，按下restart按鈕後，重新開始遊戲
document.getElementById("restartBtn").onclick = function(){
// 遊戲還沒有啟動的時候才可以重新啟動
if(gameStart === false) {
init();
}
};