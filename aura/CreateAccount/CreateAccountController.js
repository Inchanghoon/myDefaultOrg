({
    //This function to create an account
   CreateAccount : function(component, event, helper) {

       //Calling server-side apex method

       var action = component.get('c.createAcc');

       //Passing value to the apex  method that accepts parameter.

       //Here apex parameter is case-sensitive in js, how you have wrote in apex method same ,

       //you have to write in here as well.

       //check apex method paramter and acc below.

       action.setParams({

           "acc": component.get('v.AccountList')

       });

       action.setCallback(this, function(response) {

           //store state of response

           let state = response.getState();

           if (state === "SUCCESS") {

               //No need to worry below code.

               //This is the stadard code for toast message.

 

               var toastEvent = $A.get("e.force:showToast");

               toastEvent.setParams({

                   "title": "Success!",

                   "message": "The record Created successfully."

               });

               toastEvent.fire();  

                

           }

       });

       $A.enqueueAction(action);

   },

   //This fucntion for displaying account.

   displayAccount : function(component, event, helper) {

       //Calling server-side apex method.

       var action = component.get('c.displayAcc');

       action.setCallback(this, function(response) {

           //store state of response

           var state = response.getState();

           if (state === "SUCCESS") {

               //storing response to attribute.

               //then we are using this for iteration.

                component.set('v.AccListToDisplay', response.getReturnValue());              

           }

       });

       $A.enqueueAction(action);

   }

})