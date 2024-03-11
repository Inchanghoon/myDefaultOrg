trigger OpportunityFeedTrigger on Opportunity (after update,before update,before insert) {

   if(Trigger.isAfter)

   {

       String txt;

       List<Id> listUser = new List<Id>();

      

       List<User> user = [select Id,name,UserRole.name from User where UserRole.name ='대표' LIMIT 1];

    

       for(User tempUser : user){

           listUser.add(tempUser.id);

       }

      

       for(Opportunity newTriggerObj : Trigger.new) {

          

           Opportunity oldTriggerObj = Trigger.oldMap.get(newTriggerObj.id);

           if(newTriggerObj.StageName  == '계약완료' && newTriggerObj.StageName  != oldTriggerObj.StageName){

               txt ='대표님 ' + newTriggerObj.Name +  ' 기회가 ' + newTriggerObj.StageName + ' 되었습니다.';

              

               Util.chat(txt, newTriggerObj.Id, listUser); 

           }

                              

       }

   }

}