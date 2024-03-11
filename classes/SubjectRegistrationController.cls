public with sharing class SubjectRegistrationController {
    @AuraEnabled
    public static List<SubjectRegistration__c> getSubjectRegistration(String recordId){
        try {
            List<SubjectRegistration__c> result = [
                SELECT Name, EducationSubject__c, ReasonForNonComplete__c, ReasonForReject__c, RejectDate__c,
                CompletionCheck__c, CompletionDate__c, EducationApprovalStatus__c, ApprovalUser__c, EducationSubject__r.Name,
                ApprovalManager__c, RegisterPath__c, RegisterDate__c, CreatedById, LastModifiedById,
                LGEducationMember__c, MemberEmail__c, MemberPhone__c, MemberCompany__c, MemberPosition__c 
                FROM SubjectRegistration__c 
                WHERE EducationSubject__c = :recordId
            ];
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void insertSubjectRegistration(String registName, String recordId, String registEducationApprovalStatus, String registMemberCompany, String registMemberPosition, String registMemberPhone, String registMemberEmail, String registRegisterPath, Date registRegisterDate){
        try {
            SubjectRegistration__c insertSub = new SubjectRegistration__c();
            insertSub.Name = registName;
            insertSub.EducationApprovalStatus__c = registEducationApprovalStatus;
            insertSub.MemberCompany__c = registMemberCompany;
            insertSub.MemberPosition__c = registMemberPosition;
            insertSub.MemberPhone__c = registMemberPhone;
            insertSub.MemberEmail__c = registMemberEmail;
            insertSub.RegisterPath__c = registRegisterPath;
            insertSub.RegisterDate__c = registRegisterDate;
            insertSub.EducationSubject__c = recordId;
            Database.SaveResult sr = Database.insert(insertSub);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}