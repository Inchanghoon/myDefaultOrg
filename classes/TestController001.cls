public with sharing class TestController001 {
    @AuraEnabled
    public static List<Contact> getContactList(String recordId) {
        // 함수에 정의한 타입과 return 값의 타입은 항상 같아야 한다.
        try {
            List<Contact> result = [SELECT id, Name, FirstName, LastName FROM Contact WHERE AccountId = :recordId];
            return result;
        } catch(Exception e) {
            // console.error(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createContact(String contactFirstName, String contactLastName, String recordId){
        try {
            Contact con = new Contact();
            con.FirstName = contactFirstName;
            con.LastName = contactLastName;
            con.AccountId = recordId;
            // con.Name = contactLastName + ' ' + contactFirstName;
            // contact의 특징으론 Name을 자동으로 firstName과 lastName 을 합쳐서 만들어준다.
            Database.SaveResult sr = Database.insert(con);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}