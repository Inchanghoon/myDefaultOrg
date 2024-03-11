import { LightningElement, track, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccountList from '@salesforce/apex/TestAccountListController.getAccountList';
import getSearchAccountList from '@salesforce/apex/TestAccountListController.getSearchAccountList';
import updateRecords from '@salesforce/apex/TestAccountListController.updateRecords';
import getRecentlyAccountList from '@salesforce/apex/TestAccountListController.getRecentlyAccountList';
import deleteSelectedAccount from '@salesforce/apex/TestAccountListController.deleteSelectedAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from "lightning/uiRecordApi";
// Use inline picklist
import TEST_ACCOUNT_OBJECT from '@salesforce/schema/TestAccount__c';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import TYPE_FIELD from '@salesforce/schema/TestAccount__c.Type__c';
import RATING_FIELD from '@salesforce/schema/TestAccount__c.Rating__c';
// import Custom Labels
import TA_Rating from '@salesforce/label/c.Rating';
import TA_Account_Name from '@salesforce/label/c.Account_Name';
import TA_Annual_Revenue from '@salesforce/label/c.Annual_Revenue';
import TA_Type from '@salesforce/label/c.Type';
import TA_Phone from '@salesforce/label/c.Phone';
import TA_Number_Of_Employees from '@salesforce/label/c.Number_Of_Employees';
import TA_Billing_Address from '@salesforce/label/c.Billing_Address';
import MultipleNewModal from 'c/multipleNewModal';      // 다중 insert Modal Component 호출
import EditRecordModal from 'c/editRecordModal';        // Edit Modal

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete'}
];

const columns = [
    { label: TA_Account_Name, fieldName: 'Account_Name', type: 'url', sortable: "true", typeAttributes: {
        label : { fieldName: 'Name' },
        target : '_blank',
    }},
    { label: TA_Rating, fieldName: 'Rating__c', type: 'picklistColumn', editable: true, sortable: "true", typeAttributes: {
        placeholder: 'Choose Rating', options: { fieldName: 'pickListRatingOptions' },
        value: { fieldName: 'Rating__c' },
        context: { fieldName: 'Id' }
    }},
    { label: TA_Type, fieldName: 'Type__c', type: 'picklistColumn', editable: true, sortable: "true", typeAttributes: {
        placeholder: 'Choose Type', options: { fieldName: 'pickListOptions' },
        value: { fieldName: 'Type__c' },
        context: { fieldName: 'Id' }
    }},
    { label: TA_Phone, fieldName: 'Phone__c', type: 'Phone', sortable: "true", editable: true},
    { label: TA_Annual_Revenue, fieldName: 'AnnualRevenue__c', type: 'currency', sortable: "true", editable: true},
    { label: TA_Billing_Address, fieldName: 'BillingAddress__c', type: 'text', sortable: "true", editable: true},
    { label: TA_Number_Of_Employees, fieldName: 'NumberOfEmployees__c', type: 'number', sortable: "true", editable: true},
    { type: 'action', typeAttributes: { rowActions: actions } }
];

export default class TestAccountList extends NavigationMixin(LightningElement) {
    @api objectApiName = 'TestAccount__c';
    @track testAccountList = [];    // datatable의 data 정보
    @track columns = columns;       // datatable의 column 정보
    @track recordSize;              // Object의 Record Counter
    @track searchAccountList = [];  // 검색했을 때의 datatable data 정보
    @track queryTerm = '';               // 검색 input에서 값을 받아 query 전달
    @track queryFlag = true;        // 검색 했을 때 화면 출력용 boolean
    @track allAccountList = [];
    error;
    @track actions = actions;
    refreshTable;                   // 테이블 새로고침
    @track showSpinner = true;
    selectedRecords = [];           // inline 선택된 레코드 저장
    // List View 보기 방식
    @track viewListAll = true;
    @track viewListRecently = false;
    @track viewListLabel = 'All Test Account';
    @track tempAccountList = [];
    @track recordsCount = 0;
    // Action Edit 사용
    // @track isEditRecord = false;
    // @track isShowModal = false;
    // @track recordIdToEdit;
    @track draftValues = [];
    // @track editTarget;
    // Pick List 용 track
    @track pickListOptions;
    @track pickListRatingOptions;
    // sort track 변수
    @track sortBy = 'Account_Name';
    @track sortDirection;
    // paging 변수
    @track pageCount = 0;           // 총 페이지 수
    @track pageSize = 15;           // 화면 출력 레코드 수
    @track pageNumber = [];         // 페이지 버튼 숫자
    @track nextPage = 15;           // 페이지 컨트롤
    @track prevPage = 0;
    @track pageIndex = 1;           // 현재 페이지 출력
    @track buttonFlag = true;       // 레코드 수에 따라 버튼 출력

    // inline picklist value 불러오기
    @wire(getObjectInfo, { objectApiName: TEST_ACCOUNT_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: TYPE_FIELD
    })
    wireTypePickList({ error, data }) {
        if (data) {
            this.pickListOptions = data.values;
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
            this.pickListRatingOptions = data.values;
        } else if(error) {
            console.log(error);
        }
    }
    // wire를 사용해서 record 정보 불러오는 방법과 Name 필드에 링크 연결
    @wire(getAccountList, { pickList: '$pickListOptions' })
    wiredAccountList( result ) {
        this.refreshTable = result;
        if (result.data) {
            let tempRecs = [];
            result.data.forEach((record) => {
                let tempRec = Object.assign( {}, record );
                tempRec.Account_Name = '/' + tempRec.Id;
                tempRecs.push( tempRec );
            });
            this.allAccountList = tempRecs;
            
            this.allAccountList.forEach(ele => {
                ele.pickListOptions = this.pickListOptions;
                ele.pickListRatingOptions = this.pickListRatingOptions;
            });
            this.recordSize = this.allAccountList.length;
            this.pageCount = Math.ceil(this.recordSize / this.pageSize);
            this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
            this.tempAccountList = [...this.testAccountList];
            this.pageNumber = [];
            for(let i=1; i<this.pageCount+1; i++) {
                this.pageNumber.push(i);
            }
            this.buttonFlag = this.recordSize >= 15 ? this.buttonFlag = true : this.buttonFlag = false;
            this.showSpinner = false;
        } else if (result.error) {
            this.error = result.error;
            console.log('Error Message : ', this.error);
        }
    }
   
    connectedCallback() {
        this.init();
    }
    // async await 없으면 작동 안함
    async init() {
        let tempSearchAccountList = await getSearchAccountList({searchTerm : this.queryTerm});
        let tempRecs = [];
        tempSearchAccountList.forEach(v => {    // Name 필드에 링크 연결
            let tempRec = Object.assign( {}, v );
            tempRec.Account_Name = '/' + tempRec.Id;
            tempRecs.push(tempRec);
        });
        this.searchAccountList = tempRecs;
        this.searchAccountList.forEach(ele => {
            ele.pickListOptions = this.pickListOptions;
            ele.pickListRatingOptions = this.pickListRatingOptions;
        });
        this.showSpinner = false;
        // 최근 목록 조회
        if(!this.viewListAll) {
            let tempRecentlyAccountList = await getRecentlyAccountList({ pickList: '$pickListOptions' });
            let tempRecs2 = [];
            tempRecentlyAccountList.forEach(v => {    // Name 필드에 링크 연결
                let tempRec = Object.assign( {}, v );
                tempRec.Account_Name = '/' + tempRec.Id;
                tempRecs2.push(tempRec);
            });
            this.tempAccountList = [...this.testAccountList];
            this.testAccountList = tempRecs2;
            this.testAccountList.forEach(ele => {
                ele.pickListOptions = this.pickListOptions;
                ele.pickListRatingOptions = this.pickListRatingOptions;
            });
        } else {
            this.testAccountList = this.tempAccountList;
        }
        if(this.queryTerm.length > 0) {
            this.recordSize = this.queryFlag ? this.recordSize = this.testAccountList.length : this.recordSize = this.searchAccountList.length;
        } else {
            this.recordSize = this.queryFlag ? this.recordSize = this.allAccountList.length : this.recordSize = this.searchAccountList.length;
        }
        this.buttonFlag = this.recordSize >= 15 ? this.buttonFlag = true : this.buttonFlag = false;
    }

    get getTestAccountList() {
        return this.testAccountList;
    }
    get getSearchAccountList() {
        return this.searchAccountList;
    }

    // Inline Edit Save Event
    async handleSave(event) {
        this.draftValues = event.detail.draftValues;
        this.showSpinner = true;
        try {
            await updateRecords({ recordsJson: JSON.stringify(this.draftValues)});
            this.draftValues = [];
            this.showToast("Inline Update Success", "TestAccount__c Inline Updated", 'success');
            this.handleRefresh();
        } catch (error) {
            this.showToast("Error updating or reloading test accounts", "Hot -> Warm -> Cold 순서로 이동해야 합니다.", 'error');
        } finally {
            this.showSpinner = false;
        }
    }
    // sort event
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }
    sortData(fieldName, direction) {
        if(this.queryFlag) {
            let parseData = JSON.parse(JSON.stringify(this.testAccountList));
            let keyValue = a => {
                return a[fieldName];
            }
            let isReverse = direction === 'asc' ? 1 : -1;
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : '';
                y = keyValue(y) ? keyValue(y) : '';
                return isReverse * ((x > y) - (y > x));
            });
            this.testAccountList = parseData;
        } else {
            let parseData = JSON.parse(JSON.stringify(this.searchAccountList));
            let keyValue = a => {
                return a[fieldName];
            }
            let isReverse = direction === 'asc' ? 1 : -1;
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : '';
                y = keyValue(y) ? keyValue(y) : '';
                return isReverse * ((x > y) - (y > x));
            });
            this.searchAccountList = parseData;
        }
    }

    // New 버튼 클릭했을때 TestAccount__c 의 New 버튼 불러오기
    handleNewBtn() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName : 'TestAccount__c',
                actionName: 'new'
            },
        });
    }
    // Multiple New 버튼 이벤트
    handleMultipleNew() {
        MultipleNewModal.open({
            size: 'large',
        });
    }

    // Printable View 버튼 클릭했을때
    handlePrintableViewBtn() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'TestAccount__c',
                actionName: 'view'
            },
            state: {
                navigationLocation: 'RELATED_LIST',
                useRecordTypeCheck: 'false'
            }
        }).then(() => {
            window.open(`/a05/x?fcf=00B5j00000fxr1O`);   // 하드코딩으로 성공
        }).catch(error => {
            console.error('Printable View Error : ', error);
        });
    }
    // 검색 이벤트
    handleKeyUp(event) {
        const isEnterKey = event.keyCode === 13;
        if(isEnterKey) {
            this.queryTerm = event.target.value;
            if(this.queryTerm.length > 0){
                this.showSpinner = true;
                this.queryFlag = false;
                this.init();
            } else {
                this.queryFlag = true;
                this.init();
            }
        }
    }
    // Edit Delete Action 전달 함수
    handleRowAction(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;
        switch(actionName) {
            case 'delete':
                this.showSpinner = true;
                this.handleDeleteRow(row.Id);
                break;
            case 'edit':
                // this.handleEditRow(row.Id);
                // Edit이 완료된 후 onabd function 실행
                EditRecordModal.open({
                    size: 'small',
                    bubbles: true, 
                    composed: true,
                    rId: row.Id,
                    onabc: () => {
                        this.handleRefresh();
                    }
                });
                // this.editTarget = row.Name;
                break;
            default:
                console.log('switch default');
        }
    }
    // Action Edit 이벤트
    // handleEditRow(rowId) {
        // this.isShowModal = true;
        // this.isEditRecord = true;
        // this.recordIdToEdit = rowId;
        // this.recordId = rowId;
    // }

    // Action Delete 이벤트
    handleDeleteRow(rowId) {
        deleteRecord(rowId)
            .then(() => {
                this.showToast('Success', "Record deleted", 'success');
                return refreshApex(this.refreshTable);
            }).catch((error) => {
                this.showToast('Error deleting record', error.body.message, 'error');
            }).finally(() => {
                this.showSpinner = false;
            })
    }
    // Edit 모달에서 Save 버튼 후 이벤트
    // Action Edit 모달 분리
    // handleSubmit() {
    //     this.isShowModal = false;
    // }
    // Action Edit 실패시 Toast Message
    // handleError(error) {
    //     this.showToast('Error Editing record', JSON.stringify(error.detail.detail), 'error');
    // }
    // Action Edit Success event
    // handleSuccess() {
    //     this.showToast('Success Message', 'Record Updated successfully', 'success');
    //     return refreshApex(this.refreshTable);
    // }
    // Edit 모달 끄기
    // hideModalBox() {
    //     this.isShowModal = false;
    // }

    // search box 옆에 refresh 버튼 이벤트
    handleRefresh() {
        return refreshApex(this.refreshTable);
    }

    // Toast Event handler
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
    // Page Headers Event(모두 보기, 최근목록 조회)
    handleAllView(event) {
        this.viewListAll = true;
        this.viewListRecently = false;
        this.viewListLabel = event.target.label;
        this.init();
    }
    handleRecentlyView(event) {
        this.viewListAll = false;
        this.viewListRecently = true;
        this.viewListLabel = event.target.label;
        this.init();
    }
    // Selected Records multiple Delete
    getSelectedRecords(event) {
        const selectedRows = event.detail.selectedRows;
        this.recordsCount = event.detail.selectedRows.length;
        this.selectedRecords = new Array();
        for(let i=0; i < selectedRows.length; i++) {
            this.selectedRecords.push(selectedRows[i]);
        }
    }
    handleDeleteBtn() {
        if(this.selectedRecords) {
            deleteSelectedAccount({ deleteRows: this.selectedRecords }).then(result => {
                this.showToast('multiple delete Success!!', this.recordsCount + ' records are deleted.', 'success');
                this.template.querySelector('c-l-w-c-custom-datatable-type').selectedRows = [];
                this.recordsCount = 0;
                this.viewListAll = true;
                this.viewListLabel = 'All Test Account';
                return this.handleRefresh();
            }).catch(error => {
                this.showToast('Multiple Delete Failed', error.body.message, 'error');
            });
        }
    }
    // Pagination Number Click
    handlePage(event) {
        const whatPage = event.target.label;
        this.pageIndex = whatPage;
        this.prevPage = (whatPage - 1) * this.pageSize;
        this.nextPage = this.pageSize * whatPage;
        this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
    }
    // 첫번째 페이지로 이동
    handleFirstPage(){
        this.prevPage = 0;
        this.nextPage = 15;
        this.pageIndex = 1;
        this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
    }
    // 마지막 페이지로 이동
    handleLastPage() {
        this.prevPage = (this.pageCount - 1) * this.pageSize;
        this.nextPage = this.pageCount * this.pageSize;
        this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
        this.pageIndex = this.pageCount;
    }
    // 이전 페이지로 이동
    handlePrevPage() {
        if(this.prevPage >= this.pageSize) {
            this.prevPage = this.prevPage - this.pageSize;
            this.nextPage = this.nextPage - this.pageSize;
            this.pageIndex--;
            this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
        } else {
            console.log('이전 페이지가 없습니다.');
        }
    }
    // 다음 페이지로 이동
    handleNextPage() {
        if(this.nextPage < (this.pageCount * this.pageSize)){
            this.prevPage = this.prevPage + this.pageSize;
            this.nextPage = this.nextPage + this.pageSize;
            this.pageIndex++;
            this.testAccountList = this.allAccountList.slice(this.prevPage, this.nextPage);
        } else {
            console.log('다음 페이지가 없습니다.');
        }
    }

    handleEditList() {
        console.log('handleEditList');
        // this.testAccountList.focus();
        let testVal = this.template.querySelector('c-l-w-c-custom-datatable-type');
        testVal.focus();
        console.log(testVal);
    }
}