({
    helperMethod : function() {

    },
    getEducationSubjectList : function(component) {
        return new Promise($A.getCallback(function(resolve, reject) {
            let action = component.get('c.getEducationSubjectList');
            action.setCallback(this, function(res) {
                console.log('getEducationSubjectList.result => ', res);
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
