({
    myAction : function(component, event, helper) {
        helper.getSubjectRegistrationList(component).then($A.getCallback(function(info) {
            component.set('v.subjectRegistrationList', info);
            console.log('info = ', info);
        }));
    },
    registSubject : function(component, event, helper) {
        console.log('registSubject Controller => ', component);
        helper.createRegistSubject(component)
            .then(function() {
                // $A.get('e.force:refreshView').fire();
                location.reload();
            });
    }
    // handleSuccess : function(component, event, helper) {
    //     console.log('handleSuccess in!!');
    // },
    // handleReset: function(cmp, event, helper) {
    //     cmp.find('field').forEach(function(f) {
    //         console.log('handleReset : ', f);
    //         f.reset();
    //     });
    // }
})
