import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getEducationSubjectList from '@salesforce/apex/EducationSubjectController.getEducationSubjectList';
import relatedFiles from '@salesforce/apex/EducationSubjectController.relatedFiles';

export default class EducationSubjectHomeModal extends NavigationMixin(LightningElement) {
    @track modalFlag = false;
    @track subjectList = [];
    @track photoUrl;

    connectedCallback(){
        this.init();
    }
    async init() {
        this.subjectList = await getEducationSubjectList();
        this.photoUrl = await relatedFiles({ imgId: this.subjectList[0].EducationProgram__c });
        this.checkCookie();
    }
    get getSubjectList() {
        return this.subjectList;
    }
    get getImageFile() {
        return this.photoUrl;
    }
    
    handleCancel() {
        this.modalFlag = false;
    }

    handleModalOn() {
        this.modalFlag = !this.modalFlag;
    }

    handleRegistrationSubject() {
        this.modalFlag = false;
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'SubjectRegistration__c',
                actionName: 'new',
            },
            state: {
                defaultFieldValues: `EducationSubject__c=${this.subjectList[0].Id}`,
                nooverride: '1'
            }
        });
    }
    // 오늘 하루 보지 않기
    setCookie(cName, cValue, cDay) {
        let todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + cDay);
        let expires = "expires=" + todayDate.toUTCString();
        document.cookie = cName + '=' + cValue + ';' + expires + ';path=/';
        let tempCookie = document.cookie;
        console.log('cName : ', cName);
        console.log('cValue : ', cValue);
        console.log('cDay : ', expires);
        console.log('tempCookie : ', tempCookie);
    }
    getCookie(cName) {
        let name = cName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        console.log('getCookie cName : ', name);
        for(let i=0; i<ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    checkCookie() {
        const cookieValue = this.getCookie('hideModal');
        if(cookieValue === 'done') {
            console.log('쿠키 확인됨(24시간동안 보이지 않음)');
            this.modalFlag = false;
        } else {
            console.log('쿠키 확인 안됨');
            this.modalFlag = true;
        }
    }
    modalCloseToday(event) {
        this.modalFlag = false;
        console.log('get Cookie : ', this.getCookie('hideModal'));
        this.setCookie('hideModal', 'done', 1);
        console.log('쿠키 : ', JSON.stringify(this.setCookie));
    }
}