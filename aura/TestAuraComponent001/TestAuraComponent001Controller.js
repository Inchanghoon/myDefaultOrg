({
    myAction : function(component, event, helper) {

    },
    changeMsg : function(component, event, helper) {
        let isManager = component.get('v.isManager');
        const labelEmail = $A.get("$Label.c.LabelTest002");
        if(isManager){
            component.set("v.isManager", false);
            component.set("v.strLabel", labelEmail);
        } else {
            component.set("v.isManager", true);
            component.set("v.strLabel", '');
        }
    },
    viewErrorMessage : function(component, event, helper) {
        helper.callMethod();
    },
    viewContactList : function(component, event, helper) {
        helper.getContactList(component).then($A.getCallback(function(info){
        	console.log('contactList =>', info);
            component.set('v.contactList', info);
            if(info != null ){
                component.set('v.contactListSize', info.length);
                console.log('contactListSize =>', info.length);
            }
        }));
    },
    registContact : function(component, event, helper) {
        console.log(component.get('v.contactFirstName'), component.get('v.contactLastName'));
        helper.createContactList(component);
    }
})
