import { track, wire } from 'lwc';
import LightningModal from 'lightning/modal'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
// Label and picklist
import TEST_ACCOUNT_OBJECT from '@salesforce/schema/TestAccount__c';
import TA_Rating from '@salesforce/label/c.Rating';
import TA_Account_Name from '@salesforce/label/c.Account_Name';
import TA_Annual_Revenue from '@salesforce/label/c.Annual_Revenue';
import TA_Type from '@salesforce/label/c.Type';
import TA_Phone from '@salesforce/label/c.Phone';
import TA_Number_Of_Employees from '@salesforce/label/c.Number_Of_Employees';
import TA_Billing_Address from '@salesforce/label/c.Billing_Address';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi'
// get fields
import NAME_FIELD from '@salesforce/schema/TestAccount__c.Name';
import ANNUALREVENUE_FIELD from '@salesforce/schema/TestAccount__c.AnnualRevenue__c';
import PHONE_FIELD from '@salesforce/schema/TestAccount__c.Phone__c';
import NUMBEROFEMPLOYEES_FIELD from '@salesforce/schema/TestAccount__c.NumberOfEmployees__c';
import BILLINGADDRESS_FIELD from '@salesforce/schema/TestAccount__c.BillingAddress__c';
import TYPE_FIELD from '@salesforce/schema/TestAccount__c.Type__c';
import RATING_FIELD from '@salesforce/schema/TestAccount__c.Rating__c';

export default class MultipleNewModal extends LightningModal {
    @track insertList = [0];        // Add Row 사용
    @track insertRecords = [{
        name: '',
        billingAddress: '',
        phone: '',
        type: '',
        employees: '',
        rating: '',
        annualRevenue: ''
    }];
    // insertRecords push용
    @track copyColumns = [{
        name: '',
        billingAddress: '',
        phone: '',
        type: '',
        employees: '',
        rating: '',
        annualRevenue: ''
    }];
    @track addRowNum = 0;
    @track showSpinner = false;
    picklistType = [];
    picklistRating = [];

    labels = {
        TA_Account_Name,
        TA_Annual_Revenue,
        TA_Type,
        TA_Phone,
        TA_Number_Of_Employees,
        TA_Billing_Address,
        TA_Rating
    };

    @wire(getObjectInfo, { objectApiName: TEST_ACCOUNT_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: TYPE_FIELD
    })
    wireTypePickList({ error, data }) {
        if (data) {
            this.picklistType = data.values;
        } else if (error) {
            console.log(error);
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: RATING_FIELD
    })
    wireRatingPickList({ error, data }) {
        if (data) {
            this.picklistRating = data.values;
        } else if (error) {
            console.log(error);
        }
    }
    // Modal Close
    handleClose() {
        this.close();
    }
    // 입력창 추가
    handleAddRow() {
        this.addRowNum++;
        this.insertRecords.push(JSON.parse(JSON.stringify(this.copyColumns)));
        this.insertList.push(this.addRowNum);
    }
    // 입력창 삭제
    deleteRow(event) {
        let rowIndex = event.target.dataset.index;
        if(this.insertList.length > 1){
            this.insertList.splice(rowIndex, 1);
            this.insertRecords.splice(rowIndex, 1);
        } else {
            console.log('last row');
        }
    }
    // input에 입력할 때마다 value 저장
    handleChange(event) {
        let rowIndex = event.target.dataset.index;
        if(event.target.name === 'name') {
            this.insertRecords[rowIndex].name = event.target.value;
        } else if(event.target.name === 'billingAddress') {
            this.insertRecords[rowIndex].billingAddress = event.target.value;
        } else if(event.target.name === 'phone') {
            this.insertRecords[rowIndex].phone = event.target.value;
        } else if(event.target.name === 'type') {
            this.insertRecords[rowIndex].type = event.target.value;
        } else if(event.target.name === 'employees') {
            this.insertRecords[rowIndex].employees = event.target.value;
        } else if(event.target.name === 'rating') {
            this.insertRecords[rowIndex].rating = event.target.value;
        } else if(event.target.name === 'annualRevenue') {
            this.insertRecords[rowIndex].annualRevenue = event.target.value;
        }
    }
    // Insert Button Event
    handleSave(){
        this.showSpinner = true;
        let emptyCheck = false;
        for(let i in this.insertRecords) {
            if(this.insertRecords[i].name == null || this.insertRecords[i].name == '') {
                emptyCheck = true;
                this.showToast('Error', 'Please insert Account Name field', 'error');
                return false;
            } else {
                console.log('insertRecords Name : ', this.insertRecords[i].name);
                console.log('Good');
            }
        }
        if(!emptyCheck) {
            const fields = {};
            for(let j in this.insertRecords) {
                fields[NAME_FIELD.fieldApiName] = this.insertRecords[j].name;
                fields[BILLINGADDRESS_FIELD.fieldApiName] = this.insertRecords[j].billingAddress;
                fields[PHONE_FIELD.fieldApiName] = this.insertRecords[j].phone;
                fields[TYPE_FIELD.fieldApiName] = this.insertRecords[j].type;
                fields[NUMBEROFEMPLOYEES_FIELD.fieldApiName] = this.insertRecords[j].employees;
                fields[RATING_FIELD.fieldApiName] = this.insertRecords[j].rating;
                fields[ANNUALREVENUE_FIELD.fieldApiName] = this.insertRecords[j].annualRevenue;

                const recordInput = { apiName: TEST_ACCOUNT_OBJECT.objectApiName, fields };
                createRecord(recordInput).then(result => {
                    if(result !== undefined) {
                        this.insertRecords[j].name = '';
                        this.insertRecords[j].billingAddress = '';
                        this.insertRecords[j].phone = '';
                        this.insertRecords[j].type = '';
                        this.insertRecords[j].employees = '';
                        this.insertRecords[j].rating = '';
                        this.insertRecords[j].annualRevenue = '';
                        this.showToast('Success', 'All Insert Account List', 'success');
                    }
                }).catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                }).finally(() => {
                    // this.dispatchEvent(new CustomEvent( 'onrefresh' ));
                    this.showSpinner = false;
                    this.handleClose();
                    window.location.reload();
                });
            };
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}