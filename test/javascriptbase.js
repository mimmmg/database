자바스크립트란?
정의: 자바스크립트는 웹 페이지에 동적이고 인터랙티브한 기능을 추가하기 위해 설계된 프로그래밍 언어
역할: HTML이 구조를, CSS가 스타일을 정의하는 반면, 자바스크립트는 웹 페이지의 동작을 제어.
특징: 동적 타입 언어: 변수의 타입에 따라 런타임이 결정됨.
      인터프리터 언어: 코드를 작성한 후 컴파일하지 않고도 즉시 실행 가능.
      이벤트기반: 사용자의 상호작용에 따라 코드가 실행됨.
      크로스 플랫폼: 웹 브라우저나 서버에서 실행되며, 운영체제에 상관없이 동작. (anywhere 가능)

자바스크립트의 용도
클라이언트 측 스크립팅
 정의: 웹 브라우저와 서버에서 실행되는 자바스크립트 코드.
 역할: 사용자와의 상호작용 처리, 폼 검증, 애니메이션, 콘텐츠 동적업데이트 등.
 예시: 버튼 클릭 시 내용 변경
 document.querySelector('button').addEventListener('click', function() {
    document.querySelector('p').textContent = 'Button clicked!';
 });

서버 측 스크립팅
 정의: Node.js와 같은 환경에서 서버 측에서 실행되는 자바스크립트 코드.
 역할: 서버 요청 처리, 데이터베이스와 상호작용, 파일 시스템 접근 등.
 예시: 간단한 서버 생성(Node.js)
 const http = require('http');
 const server= http.createServer((req, res) => {
    res.statusCode = 200;
    res,setHeader('Content-Type', 'text/plain');
    res.end('Hello,World!\n');
 });
 server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
 });

 자바스크립트의 주요 기능
 •변수와 데이터 타입
   변수 선언: var,let,const 키워드를 사용해 변수 선언
   데이터 타입: 숫자,문자열,불리언,객체,배열 등.
• 조건문과 반복문
   조건문: if, else, switch 등을 사용하여 조건에 따라 코드 블록 실행
   반복문: for, while, do...while 등을 사용하여 코드를 반복 실행
• 함수
 정의: 자바스크립트에서 특정 작업을 수행하는 코드블록
 사용법: function 키워드를 사용해 함수 선언하고 호출
 function greet(name) {
    return `Hello,${name}!`;
 }  
 console.log(greet('Alice')); 

자바스크립트의 장점
 광범위한 호환성
 즉각적인 피드백
 풍부한 라이브러리와 프레임워크: React, Angular, Vue.js 등 다양한 프레임워크와 
 라이브러리를 활용해 복잡한 웹 애플리케이션 개발 가능
자바스크립트의 단점
 브라우저 간의 차이: 일부 브라우저에서 자바스크립트 기능이 다르게 구현될수있음
 보안문제: 클라이언트 측에서 실행되기 때문에 코드가 노출될 수 있고, 악의적인 스크립트 공격의 대상이 될수있음

자바스크립트의 발전
 ES6이후 : 화살표함수, 템플릿 리터럴, 클래스, 모듈 등 현대 자바스크립트에서 필수적인 기능이 추가됨.
 모듈 시스템: 자바스크립트 코드의 재사용성을 높이고 유지보수를 용이하게 하기 위새 모듈화가 도입됨
 비동기처리: Promise, async/await 등의 기능을 통해 비동기 작업을 효율적으로 처리 가능


데이터 타입과 연산자
변수 선언 방식: var, let, const
• var
 정의: 자바스크립트에서 가장 오래된 변수 선언방법
 특징: 
  함수스코프: 함수 내에서만 유효. 함수 외부에서는 접근 불가. 블록 스코프가 아닌 함수 스코프를 따름.
  중복 선언 가능: 동일한 이름으로 여러 번 변수 선언 가능. 이전 값 덮어씀. 의도치 않은 변수 재정의 가능성.
  호이스팅: 변수 선언이 코드 최상단으로 끌어올려짐. 선언 전 변수 참조 시 undefined로 평가.
 예시:
var x = 10;
console.log(x);

if (true) {
    var y = 20;
}
console.log(y); // 블록 외부에서도 접근 가능
추가예제:
 함수스코프 예제:
 function testVar() {
    var name = "Alice" ;
    console.log(name);
 }

 testVar();
 // console.log(name); // ReferenceError: name is not defined(함수 외부에서는 접근불가)
 호이스팅 예제:
 console.log(a); //undefined
 var a = 30;
 console.log(a); //30

• let
 정의: 
 특징:
  블록스코프: 블록 내에서만 유효. 블록 외부에서는 접근 불가.
  중복선언불가: 동일 이름으로 재선언 불가. 의도치 않은 변수 재정의 방지.
  호이스팅되지만 초기화는 선언 이후에 이루어짐: 선언 전 접근 시 ReferenceError 발생.
 예시:
  let a= 10;
  if(true) {
    let b = 20;
    console.log(b); //20
  }
  // console.log(b); // ReferenceError: b is not defined
추가예제:
 let x = 5;
 // let x =10; // SyntaxError: Idenrifier 'x' has already been declared
 console.log(y); // ReferenceError: Cannot access'y' before initialization
 let y =10;
 console.log(y); //10

• const
 정의: 상수를 선언하는 방법. 선언시 반드시 초기화 필요
 특징:
  블록스코프: 블록 내에서만 유효. 블록 외부에서는 접근 불가.
  값 재할당 불가: 변수 값 재할당 불가. 단, 객체나 배열의 내부 값은 변경 가능.
 예시:
 const c = 10;
 // c=20; // TypeError: Assignment to constant variable. 
 const person = {name:"Alice"};
 person.name = "Bob"; // 객체의 속성은 변경가능
 console.log(person.name); //"Bob"  
 추가예제:
 const arr = [1,2,3];
 arr.push(4); // 배열 요소 추가기능
 console.log(arr); // [1,2,3,4]

자바스크립트의 데이터타입
• 기본 데이터타입
   숫자
• 정의: 자바스크립트에서 숫자 데이터 타입. 정수와 실수를 포함한 모든 숫자를 Number 타입으로 표현.    
• 예시:
 let age = 25;
 let price = 19.99;
 console.log(age);
 console.log(price);
 console.log(age+price);
• 추가예제:
   소수점 처리예제:
   let num = 1.23456789;
   console.log(num.toFixed(2)); // 1.23 (소수점 둘째 자리까지 반올림)
   console.log(num.toFixed(5)); // 1.23457 (소수점 다섯째 자리까지 반올림)
   특수 숫자 값: 
   console.log(1/0); // Infinity(무한대)
   console.log(-1/0); // -Infinity (음의 무한대)
   console.log("hello" * 2); //NaN (Not a Number)
   숫자타입확인:
   let value = 42;
   console.log(typeof value); // "number"
• 문자열(string)
 정의: 텍스트데이터를 표현하며, 작은따옴표 또는 큰따옴표로 감싼다
 예시: 
 let name = "Alice";
 let greeting =