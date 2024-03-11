import { LightningElement, track } from 'lwc';

export default class BaseballGame extends LightningElement {
    // @track firstNumber;
    // @track secondNumber;
    // @track thirdNumber;
    // @track inputNum1;
    // @track inputNum2;
    // @track inputNum3;
    // @track sameNumber = 0;
    @track numberCheck1 = [];
    @track numberCheck2 = [];
    @track maxCount = 10;
    @track playCount = 1;
    @track strikeCount = 0;
    @track ballCount = 0;
    @track sameFlag = true;
    @track gameFlag = true;
    @track winText;

    connectedCallback() {
        this.init();
    }
    init() {
        this.sameFlag = true;
        // this.firstNumber = Math.floor(Math.random() * 10);
        // this.secondNumber = Math.floor(Math.random() * 10);
        // this.thirdNumber = Math.floor(Math.random() * 10);
        this.numberCheck1[0] = Math.floor(Math.random() * 10);
        this.numberCheck1[1] = Math.floor(Math.random() * 10);
        this.numberCheck1[2] = Math.floor(Math.random() * 10);
        while(this.sameFlag) {
            if(this.numberCheck1[0] === this.numberCheck1[1] || this.numberCheck1[0] === this.numberCheck1[2] || this.numberCheck1[1] === this.numberCheck1[2]) {
                console.log('중복 체크 : ',this.numberCheck1[0], this.numberCheck1[1], this.numberCheck1[2])
                this.numberCheck1[1] = Math.floor(Math.random() * 10);
                this.numberCheck1[2] = Math.floor(Math.random() * 10);
            } else {
                this.sameFlag = false;
            }
        }
        console.log('init.firstNumber = ', this.numberCheck1[0]);
        console.log('init.secondNumber = ', this.numberCheck1[1]);
        console.log('init.thirdNumber = ', this.numberCheck1[2]);
        // this.maxCount = 10;
        // this.playCount = 0;
        // this.strikeCount = 0;
        // this.ballCount = 0;
    }
    
    // handleInput(event) {
    //     this.inputNum1 = Number(event.detail.value);
    //     this.inputNum2 = Number(event.detail.value);
    //     this.inputNum3 = Number(event.detail.value);
    // }
    resetGame() {
        this.maxCount = 10;
        this.playCount = 1;
        this.strikeCount = 0;
        this.ballCount = 0;
        this.gameFlag = true;
        this.init();
    }
    @track errorMsg;
    @track errorFlag = false;
    checkNumber() {
        this.strikeCount = 0;
        this.ballCount = 0;
        this.playCount++;
        // this.maxCount--;
        if(this.playCount === 10){
            this.gameFlag = false;
            this.winText = 'You Lose';
        }
        // this.sameNumber = 0;
        // this.inputNum1 = Number(this.template.querySelector('.inputFirst').value);
        // this.inputNum2 = Number(this.template.querySelector('.inputSecond').value);
        // this.inputNum3 = Number(this.template.querySelector('.inputThird').value);
        this.numberCheck2[0] = Number(this.template.querySelector('.inputFirst').value);
        this.numberCheck2[1] = Number(this.template.querySelector('.inputSecond').value);
        this.numberCheck2[2] = Number(this.template.querySelector('.inputThird').value);
        console.log('결과값 : ',this.numberCheck2[0], this.numberCheck2[1], this.numberCheck2[2]);
        if(this.numberCheck2[0] === '' || this.numberCheck2[1] === '' || this.numberCheck2[2] === ''){
            console.log('ERROR');
            this.errorFlag = true;
            this.errorMsg = '숫자를 입력해주세요';
        } else {
            this.errorFlag = false;
            for(let i=0; i < this.numberCheck1.length; i++) {
                for(let j=0; j < this.numberCheck2.length; j++) {
                    if(this.numberCheck1[i] === this.numberCheck2[j]) {
                        if(i === j) {
                            this.strikeCount++;
                            console.log(`입력한 ${j+1}번째 숫자와 ${i}번째 숫자가 맞아 strike`);
                        } else {
                            this.ballCount++;
                            console.log(`입력한 ${j+1}번째 숫자와 입력한 ${i}번째 숫자가 맞아 ball`);
                        }
                    }
                }
            }
            if(this.strikeCount === 3){
                this.winText = 'You Win';
                this.gameFlag = false;
            }
            this.template.querySelector('.inputFirst').focus();
        }

        // if(this.firstNumber === this.inputNum1) {
        //     this.sameNumber++;
        //     this.strikeCount++;
        //     console.log('1번째 숫자와 1번째 입력값이 같습니다.');
        // } else if(this.secondNumber === this.inputNum1) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('2번째 숫자와 1번째 입력값이 같습니다.');
        // } else if(this.thirdNumber === this.inputNum1) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('3번째 숫자와 1번째 입력값이 같습니다.');
        // } else {
        //     console.log('맞는 숫자가 없습니다');
        // }
        // if(this.firstNumber === this.inputNum2) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('1번째 숫자와 2번째 입력값이 같습니다.');
        // } else if(this.secondNumber === this.inputNum2) {
        //     this.sameNumber++;
        //     this.strikeCount++;
        //     console.log('2번째 숫자와 2번째 입력값이 같습니다.');
        // } else if(this.thirdNumber === this.inputNum2) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('3번째 숫자와 2번째 입력값이 같습니다.');
        // } else {
        //     console.log('맞는 숫자가 없습니다');
        // }
        // if(this.firstNumber === this.inputNum3) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('1번째 숫자와 3번째 입력값이 같습니다.');
        // } else if(this.secondNumber === this.inputNum3) {
        //     this.sameNumber++;
        //     this.ballCount++;
        //     console.log('2번째 숫자와 3번째 입력값이 같습니다.');
        // } else if(this.thirdNumber === this.inputNum3){
        //     this.sameNumber++;
        //     this.strikeCount++;
        //     console.log('3번째 숫자와 3번째 입력값이 같습니다.');
        // } else {
        //     console.log('맞는 숫자가 없습니다');
        // }
    }

}