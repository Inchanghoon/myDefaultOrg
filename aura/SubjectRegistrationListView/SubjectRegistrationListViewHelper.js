({
    getSubjectRegistrationList : function(component) {
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get('c.getSubjectRegistration');
            action.setParams({
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
    },
    createRegistSubject : function(component) {
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get('c.insertSubjectRegistration');
            action.setParams({
                registName : component.get('v.registName'),
                recordId : component.get('v.recordId'),
                registEducationApprovalStatus : component.get('v.registEducationApprovalStatus'),
                registMemberCompany : component.get('v.registMemberCompany'),
                registMemberPosition : component.get('v.registMemberPosition'),
                registMemberPhone : component.get('v.registMemberPhone'),
                registMemberEmail : component.get('v.registMemberEmail'),
                registRegisterPath : component.get('v.registRegisterPath'),
                registRegisterDate : component.get('v.registRegisterDate')
            })
            action.setCallback(this, function(res) {
                console.log('createRegistSubject.res =>', res);
                let state = res.getState();
                if(state === 'SUCCESS') {
                    resolve(res.getReturnValue());
                    // $A.get('e.force:refreshView').fire();
                } else {
                    reject(res.getError());
                }
            });
            $A.enqueueAction(action);
        }));
    }
})
