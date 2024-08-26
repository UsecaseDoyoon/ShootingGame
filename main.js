//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 500;
canvas.height = 800;
document.body.appendChild(canvas)

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver = false // true 이면 게임이 끝남, false 이면 게임이 안끝남

let score=0

//우주선 좌표
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

let bulletList = [] //총알들을 저장하는 리스트

function Bullet() {
  this.x= 0 ;
  this.y= 0 ;
  this.init=function(){
    this.x = spaceshipX +20 ; 
    this.y = spaceshipY
    bulletList.push(this)
  };
  this.update = function() {
    this.y -= 5; // 총알이 위로 이동
  };
}

function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min
  return randomNum
}

let enemyList = []

function Enemy(){
  this.x=0
  this.y=0
  this.init = function(){
    this.y= 0
    this.x= generateRandomValue(0,canvas.width-48)
    enemyList.push(this);
  }
  this.update = function(){
    this.y += 2;

    if(this.y >= canvas.height-44){
      gameOver = true;
      console.log("gameOVER")
    }
  };
}


function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src="image/background.gif";

  spaceshipImage = new Image();
  spaceshipImage.src = "image/spaceship.png"

  bulletImage = new Image();
  bulletImage.src = "image/bullet.png"

  enemyImage = new Image();
  enemyImage.src = "image/enemyImage.png"

  gameOverImage = new Image();
  gameOverImage.src = "image/gameover.gif"
}

let keysDown= {};
function setupKeyboardListener(){
  document.addEventListener("keydown",function(event){
    keysDown[event.keyCode] = true ;
    console.log("키다운객체 값 ?",keysDown);

  });
  document.addEventListener("keyup",function(event){
    delete keysDown[event.keyCode]
    console.log("버튼 클릭후",keysDown);

    //스페이스 키코드 32
    if(event.keyCode == 32){
      createBullet() //총알 생성
    }
  });
}

function createBullet(){
  console.log("총알생성")
  let b = new Bullet() //총알 하나 생성
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new Enemy()
    e.init()
  },1100)
}

function update(){
  if( 39 in keysDown) {
    spaceshipX += 2
  }
  if ( 37 in keysDown) {
    spaceshipX -= 2
  }

  if (spaceshipX <=0){
    spaceshipX=0;
  }
  if (spaceshipX >= canvas.width-64){
    spaceshipX = canvas.width-64;
  }
  // 우주선의 좌표값이 무한대로 업데이트 x, 경기장 안에서만.

  // 총알의 y좌표 업데이트하는 함수 호출.
  for(let i=0;i<enemyList.length;i++){
    enemyList[i].update();

  }

  for (let i = bulletList.length - 1; i >= 0; i--) {
    bulletList[i].update(); // 총알의 위치 업데이트
    // 총알이 화면 밖으로 나가면 제거
    if (bulletList[i].y < 0) {
      bulletList.splice(i, 1);
    }
  }
  
  
  for (let i = bulletList.length - 1; i >= 0; i--) {
    for (let j = enemyList.length - 1; j >= 0; j--) {
      if (
        bulletList[i].x < enemyList[j].x + 48 &&
        bulletList[i].x + 16 > enemyList[j].x &&
        bulletList[i].y < enemyList[j].y + 48 &&
        bulletList[i].y + 16 > enemyList[j].y
      ){
        // 충돌 발생
        bulletList.splice(i, 1); // 총알 제거
        enemyList.splice(j, 1); // 적 제거
        score++;
        break;
      }
  }
}
}

/*추가 */
for (let i = 0; i < enemyList.length; i++) {
  enemyList[i].update();
}

function render() {
  ctx.drawImage(backgroundImage, 0 , 0, canvas.width, canvas.height );
  ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
  ctx.fillStyle= "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`,20,30); //점수표시...
  
  for(let i=0;i<bulletList.length;i++){
    ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
  }

  for(let i=0;i<enemyList.length; i++){
    ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y)
  }
}


function main(){
  if( !gameOver) {
  update(); //좌표값 을 업데이트
  render(); // 업데이트 그려주기
  console.log("animation calls main function")
  requestAnimationFrame(main);
  } else{
    ctx.drawImage(gameOverImage,70,100,380,380)
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선 xy 좌표가 바뀌고
// 다시 render 그리기.


// 총알만들기
//1. 스페이스 누르면 총알발사
//2. 총알이 발사 = 총알의 y값이 -- , 총알의 x값은 ? 스페이스를 누른순간의 우주선의 좌표.
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x,y좌표값이 있어야 한다.
//5. 총알 ㅇ배열을 가지고 render 그려준다.

//적군
//1. 적군 위치 랜덤하게 나오기
//2. 적군은 밑으로 내려오게
//3. 1.2초마다 내려오게 하기
//4. 적군의 우주선이 바닥에 닿으면 게임 오버
//5. 적군과 총알이 만나면 우주선이 사라진다 , 점수 1점 +

// 점수 
