import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecordDetail from '@salesforce/apex/TestAccountListController.getRecordDetail';
import deleteSelectedAccount from '@salesforce/apex/TestAccountListController.deleteSelectedAccount';
import insertTestAccountData from '@salesforce/apex/TestAccountListController.insertTestAccountData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// field Api
import NAME_FIELD from '@salesforce/schema/TestAccount__c.Name';
import ANNUALREVENUE_FIELD from '@salesforce/schema/TestAccount__c.AnnualRevenue__c';
import PHONE_FIELD from '@salesforce/schema/TestAccount__c.Phone__c';
import NUMBEROFEMPLOYEES_FIELD from '@salesforce/schema/TestAccount__c.NumberOfEmployees__c';
import BILLINGADDRESS_FIELD from '@salesforce/schema/TestAccount__c.BillingAddress__c';
import TYPE_FIELD from '@salesforce/schema/TestAccount__c.Type__c';
import RATING_FIELD from '@salesforce/schema/TestAccount__c.Rating__c';
import OWNER_FIELD from '@salesforce/schema/TestAccount__c.OwnerId';
import CREATEDBY_FIELD from '@salesforce/schema/TestAccount__c.CreatedById';
import LASTMOD_FIELD from '@salesforce/schema/TestAccount__c.LastModifiedById';
import EditRecordModal from 'c/editRecordModal';        // Edit Modal

export default class TestAccountRecordPage extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @track testAccountRecord = [];      // Detail Fields Object
    @track recordName;                  // 하이라이트 패널에 오브젝트 이름 출력
    @track deleteFlag = false;          // Delete Modal Control
    @track actionFlag = false;          // Action Button Modal Control
    @track buttonName;                  // 모달창에 어떤 Action인지 출력
    @track actionInput = [];            // Action Modal Input 출력
    @track actionObject;                // Action Object 설정
    @track cloneFlag = false;           // Action Clone Button Modal Control
    @track cloneInsertData;
    @track tempRecord;
    // Record Detail Fields
    fields = [
        NAME_FIELD,
        ANNUALREVENUE_FIELD,
        PHONE_FIELD,
        NUMBEROFEMPLOYEES_FIELD,
        BILLINGADDRESS_FIELD,
        TYPE_FIELD,
        RATING_FIELD,
        OWNER_FIELD,
        CREATEDBY_FIELD,
        LASTMOD_FIELD
    ];

    connectedCallback() {
        this.init();
    }
    async init() {
        this.testAccountRecord = await getRecordDetail({ recordId: this.recordId });
        this.recordName = this.testAccountRecord[0].Name;
    }

    // Clone Type commobox options
    get typeOptions() {
        return [
            { label: '--None--', value: '' },
            { label: 'Prospect', value: 'Prospect'},
            { label: 'Customer - Direct', value: 'Customer - Direct'},
            { label: 'Customer - Channel', value: 'Customer - Channel'},
            { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller'},
            { label: 'Installation Partner', value: 'Installation Partner'},
            { label: 'Technology Partner', value: 'Technology Partner'},
            { label: 'Other', value: 'Other'}
        ];
    }
    // Clone Rating combobox options
    get ratingOptions() {
        return [
            { label: '--None--', value: '' },
            { label: 'Hot', value: 'Hot'},
            { label: 'Warm', value: 'Warm'},
            { label: 'Cold', value: 'Cold'}
        ];
    }
    // Connect Edit Modal
    handleEdit() {
        EditRecordModal.open({
            size: 'small',
            bubbles: true, 
            composed: true,
            rId: this.recordId,
            onabc: () => {
                console.log('Action Edit in!!!');
            }
        });
    }
    // delete modal on
    handleDelete() {
        this.deleteFlag = true;
    }
    // delete modal 확인창에서 OK Event
    handleDeleteOkay() {
        deleteSelectedAccount({ deleteRows: this.testAccountRecord }).then(() => {
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: 'TestAccountList'
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }
    // Modal Off
    hideModalBox() {
        this.deleteFlag = false;
        this.actionFlag = false;
        this.cloneFlag = false;
    }
    // Action Success Event
    handleSuccess() {
        this.actionFlag = false;
        this.cloneFlag = false;
        this.showToast('Success Message', 'Record Insert successfully', 'success');
    }
    // Action Save Button Event
    handleSaveOkay() {
        if(this.cloneFlag) {
            let tempArray = {};
            tempArray.Name = this.template.querySelector('.cloneName').value;
            tempArray.BillingAddress__c = this.template.querySelector('.cloneBillingAddress').value;
            tempArray.Phone__c = this.template.querySelector('.clonePhone').value;
            tempArray.Type__c = this.template.querySelector('.cloneType').value;
            tempArray.NumberOfEmployees__c = parseInt(this.template.querySelector('.cloneNumberOfEmployees').value);
            tempArray.Rating__c = this.template.querySelector('.cloneRating').value;
            tempArray.AnnualRevenue__c = parseInt(this.template.querySelector('.cloneAnnualRevenue').value);
            this.cloneInsertData = tempArray;
            insertTestAccountData({ 
                accName: tempArray.Name, 
                accAddr: tempArray.BillingAddress__c, 
                accPhone: tempArray.Phone__c,
                accType: tempArray.Type__c,
                accEmp: tempArray.NumberOfEmployees__c,
                accRating: tempArray.Rating__c,
                accAR: tempArray.AnnualRevenue__c
            }).then((result) => {
                this.actionFlag = false;
                this.cloneFlag = false;
                this.tempRecord = result.Id;
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.tempRecord,
                        objectApiName: 'TestAccount__c',
                        actionName: 'view'
                    }
                })
                this.showToast('Insert Success', 'Clone data insert success', 'success');
            }).catch((error) => {
                this.showToast('Insert Failed', error.body.message, 'error');
            });
        } else {
            this.template.querySelector("lightning-record-edit-form").submit();
        }
    }
    // If Action Error
    handleError(error) {
        this.showToast('Error Message', JSON.stringify(error.detail.detail), 'error');
    }
    // Action Button Event
    handleNewContact(event) {
        this.actionInput = [];
        this.actionFlag = true;
        this.actionObject = 'Contact';
        this.buttonName = event.target.label;
        this.actionInput.push('Name', 'Email', 'Phone', 'AccountId', 'Title');
    }
    handleNewOppty(event) {
        this.actionInput = [];
        this.actionFlag = true;
        this.actionObject = 'Opportunity';
        this.buttonName = event.target.label;
        this.actionInput.push('Name', 'AccountId', 'CloseDate', 'StageName', 'Amount', 'NextStep');
    }
    handleCase(event) {
        this.actionInput = [];
        this.actionFlag = true;
        this.actionObject = 'Case';
        this.buttonName = event.target.label;
        this.actionInput.push('ContactId', 'Status', 'Subject', 'Description');
    }
    handleLead(event) {
        this.actionInput = [];
        this.actionFlag = true;
        this.actionObject = 'Lead';
        this.buttonName = event.target.label;
        this.actionInput.push('Name', 'Email', 'Phone', 'Company', 'Title');
    }
    // Action Clone Event
    handleClone() {
        this.actionFlag = true;
        this.cloneFlag = true;
        this.actionObject = 'TestAccount__c';
        this.buttonName = 'New TestAccountList'
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}