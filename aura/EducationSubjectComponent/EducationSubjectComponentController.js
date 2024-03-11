({
    myAction : function(component, event, helper) {
        helper.getEducationSubjectList(component).then($A.getCallback(function(info) {
            console.log('EducationSubjectList => ', info);
            component.set('v.EducationSubjectList', info);
            if(info != null) {
                component.set('v.EducationSubjectSize', info.length);
                console.log('EducationSubjectSize => ', info.length);
            }
        }));
    }
    // viewEducationSubjectList : function(component, event, helper) {
    //     helper.getEducationSubjectList(component).then($A.getCallback(function(info) {
    //         console.log('EducationSubjectList => ', info);
    //         component.set('v.EducationSubjectList', info);
    //         if(info != null) {
    //             component.set('v.EducationSubjectSize', info.length);
    //             console.log('EducationSubjectSize => ', info.length);
    //         }
    //     }));
    // }
})
