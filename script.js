let screen = document.getElementById("screen");
let buttons = document.querySelectorAll(".button");

let numbers = [];
let operators = [];
let isNumActive = false;

buttons.forEach(function(button){
  button.onclick = function(){
    if(screen.textContent==`NaN`){
      screen.textContent=``;
    }
    switch(this.value){
      case "0" :
      case "1" :
      case "2" : 
      case "3" :
      case "4" : 
      case "5" :
      case "6" :
      case "7" :
      case "8" :
      case "9" : 
        screen.textContent += `${this.value}`;
        if(isNumActive){
          numbers[numbers.length-1] = `${numbers[numbers.length-1]}${this.value}`;
          isNumActive = true;
          break;
        } 
        else{
          numbers.push(`${this.value}`);
          isNumActive = true;
          break;
        }
      case "." :
        if(numbers.length != 0 && numbers[numbers.length-1].includes(".") && isNumActive){
          break;
        }
        else if(numbers.length == 0 || numbers[numbers.length-1]==`-` || !isNumActive){
          screen.textContent += `0.`;
          numbers.push(`0.`);
          isNumActive = true;
          break;
        }
        else if(isNumActive){
          screen.textContent += `.`;
          numbers[numbers.length-1] = `${numbers[numbers.length-1]}.`;
          isNumActive = true;
          break;
        } 
      case "%" :
        if(numbers.length== 0){
          break;
        }
        else {
          operators.push("%");
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
      case "+" :
      case "×" :
      case "÷" :
        if(numbers.length== 0 || (numbers.length < 2 && numbers[numbers.length-1]==`-`)){
          break;
        }
        else if(isNumActive && numbers[numbers.length-1]==`-`){
          operators.pop();
          numbers.pop();
          screen.textContent = screen.textContent.slice(0, -1);
          screen.textContent = screen.textContent.slice(0, -1);
          operators.push(`${this.value}`);
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
        else if(operators[operators.length-1] == "%"){
          operators.push(`${this.value}`);
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
        else if(numbers.length==operators.length-countIncludedPercents()){
          operators.pop();
          screen.textContent = screen.textContent.slice(0, -1);
          operators.push(`${this.value}`);
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
        else if(isNumActive){
          operators.push(`${this.value}`);
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
      case "-" :
        if(numbers[numbers.length-1]==`-` || (operators[operators.length-1]==`-` && !isNumActive)){
          break;
        }
        else if((numbers.length == 0)||(!isNumActive && operators[operators.length-1]=="×")||(!isNumActive && operators[operators.length-1]=="÷")){
          numbers.push(`-`);
          screen.textContent += `-`;
          isNumActive = true;
          break;
        }
        else if(operators[operators.length-1] == "%"){
          operators.push(`${this.value}`);
          screen.textContent += `${this.value}`;
          isNumActive = false;
          break;
        }
        else if(numbers.length==operators.length-countIncludedPercents() && operators[operators.length-1]==`+`){
          operators.pop();
          screen.textContent = screen.textContent.slice(0, -1);
          operators.push("-");
          screen.textContent += `-`;
          isNumActive = false;
          break;
        }
        else if(isNumActive){
          operators.push("-");
          screen.textContent += `-`;
          isNumActive = false;
          break;
        }
      case "erase" :
        if(numbers.length==0 && operators.length==0){
          break;
        }
        else{
          if(isNumActive){
            if(numbers[numbers.length-1].length > 1 ){
              numbers[numbers.length-1] = numbers[numbers.length-1].slice(0, -1);
              screen.textContent = screen.textContent.slice(0, -1);
              isNumActive = true;
              break;
            }
            else{
              numbers.pop();
              screen.textContent = screen.textContent.slice(0, -1);
              isNumActive = false;
              break;
            }
          }
          else{
            operators.pop();
            screen.textContent = screen.textContent.slice(0, -1);
            isNumActive = true;
            break;
          }
        }
      case "clear" :
        screen.textContent = ``;
        numbers.length = 0;
        operators.length = 0;
        isNumActive = false;
        break;
      case "=" :
        for(let i = 0; i < numbers.length; i++){
          numbers[i] = Number(numbers[i]);
        }
        let result = compute(numbers, operators);
        if(isNaN(result)){
          screen.textContent = `NaN`;
          numbers.length = 0;
          operators.length = 0;
          isNumActive = false;
          break;
        }
        else{
          screen.textContent = parseFloat(result.toFixed(10));
          numbers.length = 0;
          operators.length = 0;
          result = String(result);
          numbers.push(result);
          isNumActive = true;
          break;
        }
    }
    adjustFontSize();
  }
});

function compute(numbers, operators){
  for(let i = 0; i < operators.length; i++){
    if (operators[i] == "%") {
      if (operators[i - 1] === undefined || operators[i-1] == "×" || operators[i-1] == "÷" ) {
        numbers[i] /= 100;
      }
      else if(operators[i -1] == "+" || operators[i-1] == "-"){
        numbers[i] = numbers[i - 1] * (numbers[i] / 100);
      }
      operators.splice(i, 1);
      i--;
      continue;
    }
  }
  for(let i = 0; i < operators.length; i++){
    if(operators[i] == "×"){
      let newNum = numbers[i] * numbers[i+1];
      operators.splice(i, 1);
      numbers.splice(i, 2, newNum);
      i--;
      continue;
    }
    else if(operators[i] == "÷"){
      if(numbers[i+1]==0){
        return NaN;
      }
      else{
        let newNum = numbers[i] / numbers[i+1];
        operators.splice(i, 1);
        numbers.splice(i, 2, newNum);
        i--;
        continue;
      }
    }
  }
  for(let i = 0; i < operators.length; i++){
    if(operators[i] == "+"){
      let newNum = numbers[i] + numbers[i+1];
      operators.splice(i, 1);
      numbers.splice(i, 2, newNum);
      i--;
      continue;
    }
    else if(operators[i] == "-"){
      let newNum = numbers[i] - numbers[i+1];
      operators.splice(i, 1);
      numbers.splice(i, 2, newNum);
      i--;
      continue;
    }
  }
  return numbers[0];
}

function countIncludedPercents(){
  return operators.filter(item => item == '%').length;
}

function adjustFontSize(){
  let length = screen.textContent.length;
  if(length <= 10){
    screen.style.fontSize = "4em";
  }
  else if(length <= 14){
    screen.style.fontSize = "3em";
  }
  else if(length <= 21){
    screen.style.fontSize = "2em";
  }
  else{
    screen.style.fontSize = "1.5em";
  }
}
