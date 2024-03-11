trigger CustomAccountTrigger on sample_Account__c(before insert, before update, before delete){
    List<Account> newInsert = new List<Account>();
    List<sample_Account__c> toProcess = null;

    if(Trigger.isInsert){
        for(sample_Account__c a : trigger.new){
            newInsert.add(new Account(Name=a.Name,
                                    Phone=a.Phone__c, 
                                    AccountNumber=a.AccountNumber__c,
                                    Rating=a.Rating__c,
                                    Industry=a.Industry__c,
                                    Type=a.Type__c));
        }
        if(newInsert.size() > 0){
            insert newInsert;
        }
    } else if(Trigger.isBefore && Trigger.isDelete){
        for(sample_Account__c a : Trigger.old){
            newInsert = [SELECT Id FROM ACCOUNT WHERE AccountNUmber = :a.AccountNumber__c];
        }
        delete newInsert;
    } else if(Trigger.isBefore && Trigger.isUpdate) {
        for(sample_Account__c a : Trigger.old) {
            Account newInsert = [SELECT Id FROM ACCOUNT WHERE AccountNumber = :a.AccountNumber__c];
            newInsert.Name = Trigger.new[0].Name;
            newInsert.Phone = Trigger.new[0].Phone__c;
            newInsert.AccountNumber = Trigger.new[0].AccountNumber__c;
            newInsert.rating = Trigger.new[0].Rating__c;
            newInsert.Industry = Trigger.new[0].Industry__c;
            newInsert.Type = Trigger.new[0].Type__c;
            update newInsert;
        }
    }
}