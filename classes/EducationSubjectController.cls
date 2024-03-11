public with sharing class EducationSubjectController {
    @AuraEnabled(cacheable=true)
    public static List<EducationSubject__c> getEducationSubjectList(){
        try {
            List<EducationSubject__c> result = [
                SELECT Name, ProgramCheck__c, ClassName__c, OpeningYear__c, ClassRounds__c, RelatedDepartments__c,
                EducationProgram__c, ClassStartDay__c, ClassEndDay__c, RegisterStartDay__c, RegisterEndDay__c,ModalStartDay__c,
                OnlineEducationCheck__c, OnlineEducationURL__c, RoomNumber__c, Status__c, Password__c, EducationProgram__r.Name,
                OfflineEducationPlace__c, AdditionalNote__c, NonscheduleClassName__c, EducationCategoty__c
                FROM EducationSubject__c
                WHERE ModalStartDay__c <= TODAY
                AND RegisterEndDay__c >= TODAY
                AND ProgramCheck__c = true
                LIMIT 1
            ];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static String relatedFiles(Id imgId) {
        List<ContentDocumentLink> contentDocumentLinks = [
            SELECT ContentDocument.FileExtension, ContentDocument.LatestPublishedVersion.Title, ContentDocument.LatestPublishedVersion.VersionData
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :imgId
            LIMIT 1
        ];
        String base64Data;
        if(!contentDocumentLinks.isEmpty()) {
            ContentDocumentLink cdl = contentDocumentLinks[0];
            base64Data = 'data:image/' + cdl.ContentDocument.FileExtension + ';charset=utf-8;base64, ';
            base64Data += EncodingUtil.base64Encode(cdl.ContentDocument.LatestPublishedVersion.VersionData);
        }
        return base64Data;
    }
}