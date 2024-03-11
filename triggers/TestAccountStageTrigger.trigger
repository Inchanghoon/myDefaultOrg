trigger TestAccountStageTrigger on TestAccount__c (before update) {
    List<String> stageName = new List<String>();
    Schema.DescribeFieldResult fieldResult = TestAccount__c.Rating__c.getDescribe();
    List<Schema.PicklistEntry> pEntry = fieldResult.getPicklistValues();
    for(Schema.PicklistEntry a : pEntry) {
        stageName.add(a.getValue());
    }

    for(TestAccount__c a : Trigger.new) {
        if(Trigger.oldMap.get(a.Id).Rating__c != a.Rating__c) {
            Integer oldIndex = stageName.indexOf(Trigger.oldMap.get(a.Id).Rating__c);
            Integer newIndex = stageName.indexOf(a.Rating__c);

            if(oldIndex != -1 && newIndex != -1 && newIndex < oldIndex) {
                a.addError('Hot -> Warm -> Cold 순서로 이동해야 합니다.');
            }
        }
    }
}