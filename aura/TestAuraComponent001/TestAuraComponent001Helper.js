({
    helperMethod : function() {

    },
    callMethod : function() {
        let sTitle = "Toast Message";
        let sMsg = "안녕하세요 메세지 테스트입니다.";

        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: sTitle,
            message: sMsg,
            type : "Error"
        });
        toastEvent.fire();
    },
    // Controller Class 에서 값을 가져오기
    getContactList : function(component){
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get('c.getContactList'); // 매개변수 이름이 APEX의 함수 이름이어야 한다.
            action.setParams({
                 recordId : component.get('v.recordId')
            });
            
            // 비동기 함수들은 이 작업을 지정하고 이 작업이 끝나면 이 작업을 해 라고 하는게 Callback 함수이다.
            action.setCallback(this, function(res) {
                console.log('getContactList.result => ', res);
                let state = res.getState();
                if(state === 'SUCCESS') {
                    resolve(res.getReturnValue());
                } else {
                    reject(res.getError());
                }
            });
            $A.enqueueAction(action);
        }));
    },
    createContactList : function(component) {
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get('c.createContact');
            action.setParams({
                 contactFirstName : component.get('v.contactFirstName'),
                 contactLastName : component.get('v.contactLastName'),
                 recordId : component.get('v.recordId')
            });
            action.setCallback(this, function(res) {
                let state = res.getState();
                if(state === 'SUCCESS') {
                    resolve(res.getReturnValue());
                } else {
                    reject(res.getError());
                }
            });
            $A.enqueueAction(action);
        }));
    }
})
