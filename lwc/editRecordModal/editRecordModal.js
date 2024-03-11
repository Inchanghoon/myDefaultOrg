import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import getRecordDetail from '@salesforce/apex/TestAccountListController.getRecordDetail';

export default class EditRecordModal extends LightningModal {
    @api recordId;
    @api objectApiName = 'TestAccount__c';
    @api rId;
    @track editTarget;
    @track showSpinner = true;
    connectedCallback() {
        this.init();
    }
    async init() {
        let tempArray = await getRecordDetail({ recordId: this.rId });
        this.recordId = tempArray[0].Id;
        this.editTarget = "Edit " + tempArray[0].Name;
        this.showSpinner = false;
    }
    // Action Edit Success event
    async handleSuccess() {
        await this.dispatchEvent(new CustomEvent( 'abc' ));
        this.close();
        this.showToast('Success Message', 'Record Updated successfully', 'success');
    }
    // Action Edit 실패시 Toast Message
    handleError(error) {
        this.showToast('Error Editing record', JSON.stringify(error.detail.detail), 'error');
    }
    // Modal close
    hideModalBox() {
        this.close();
    }
    // Edit 확인버튼 눌렀을 때 record edit form 안의 submit button 호출
    handleFakeSubmit() {
        this.template.querySelector("lightning-record-edit-form").submit();
    }
    // Toast Message
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