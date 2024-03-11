trigger ProjectTrigger on Project_CustomObject1__c (before insert) {

 if (trigger.isBefore && trigger.isInsert)

 {

   // ---- GENERATE PROJECT NUMBER, AUTO RUNNING NUMBER, RESET EVERY YEAR BASED ON CREATED DATE --- //

   // ---- PROJECT NUMBER FORMAT : {0000} --//

   Integer iCharLen = 4; // character length for number

   Integer iLastNo = 0; // information last running number this year

   Integer iThisYear = Date.Today().year();

 

   // search latest project number

   String strTemp = '0';

   String strZero = '0';

   List<Project_CustomObject1__c> lsProject = new List<Project_CustomObject1__c>([SELECT Id, Name, Project_Code__c FROM Project_CustomObject1__c WHERE CALENDAR_YEAR(CreatedDate) = :iThisYear ORDER BY CreatedDate DESC LIMIT 1 ]);

   if (lsProject.size() > 0) strTemp = lsProject[0].Project_Code__c; // in this case, project number only contains numeric value : 001, 003, etc

   iLastNo = Integer.valueOf(strTemp.Substring(strTemp.LastIndexOf('-')+1));

 

   // start generate number

   for(Project_CustomObject1__c Pro: trigger.new)

   {

     iLastNo++;

     strTemp = String.valueOf(iLastNo);

     if (strTemp.length() < iCharLen) strTemp = 'PRO-' + Date.Today().year() +'-'+ strZero.repeat(iCharLen - strTemp.length()) + strTemp; // add 0 prefix

     Pro.Project_Code__c = strTemp;

 

   }system.debug('aaa'); 

 }

}