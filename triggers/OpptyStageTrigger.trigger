trigger OpptyStageTrigger on Opportunity (before update) {
    List<String> stageArray = new List<String>();
    Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
    List<Schema.PicklistEntry> pEntry = fieldResult.getPicklistValues();
    for(Schema.PicklistEntry a : pEntry){
        stageArray.add(a.getValue());
    }
    
    for(Opportunity a : Trigger.new){
        if(Trigger.oldMap.get(a.Id).StageName != a.StageName){
            Integer oldIndex = stageArray.indexOf(Trigger.oldMap.get(a.Id).StageName);
            Integer newIndex = stageArray.indexOf(a.StageName);

            if(oldIndex != -1 && newIndex != -1 && newIndex < oldIndex){
                a.addError('이전 단계로의 이동은 허용되지 않습니다.');
            }
            if(a.Amount == NULL && (a.StageName == 'Proposal/Price Quote' || a.StageName == 'Negotiation/Review' || a.StageName == 'Closed Won')){
                a.addError('Proposal/Price Quote 단계를 넘어가기 위해선 금액이 있어야 합니다.');
                System.debug(a.Amount);
            }
        }
    }
}