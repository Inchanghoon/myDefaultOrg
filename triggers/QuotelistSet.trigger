trigger QuotelistSet on Quote (before update) {
   for(Quote Opp : Trigger.New){
       if(Opp.Status == '견적확정' && Opp.Status != Trigger.OldMap.get(Opp.Id).Status) {
           List<Quote> quote = [select Id, OpportunityId ,name,Status from Quote where OpportunityId  != null and 
                                OpportunityId =:Opp.OpportunityId and Id !=: Opp.Id and Status ='견적확정' limit 1];
           if(quote.size() > 0){
               Trigger.New[0].addError('이미 확정된 다른 견적이 있습니다.!!');
           }
       }
   }
}