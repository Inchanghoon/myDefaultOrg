public with sharing class TestAccountListController {
    @AuraEnabled(cacheable=true)
    public static List<TestAccount__c> getAccountList() {
        List<TestAccount__c> result = [
            SELECT Id,Name, BillingAddress__c, Phone__c, Type__c, OwnerId, NumberOfEmployees__c, Rating__c, AnnualRevenue__c, LastViewedDate
            FROM TestAccount__c
            LIMIT 5000
        ];
        return result;
    }
    // search 용 메소드
    @AuraEnabled(cacheable=true)
    public static List<TestAccount__c> getSearchAccountList(String searchTerm) {
        String key = '%' + searchTerm + '%';
        List<TestAccount__c> result = [
            SELECT Name, BillingAddress__c, Phone__c, Type__c, OwnerId, NumberOfEmployees__c, Rating__c, AnnualRevenue__c
            FROM TestAccount__c
            WHERE Name LIKE :key
            OR Rating__c LIKE :key
            OR Type__c LIKE :key
            OR Phone__c LIKE :key
            OR BillingAddress__c LIKE :key
        ];
        return result;
    }
    // update 용 메소드
    @AuraEnabled
    public static void updateRecords(String recordsJson){
        try {
            List<TestAccount__c> result = (List<TestAccount__c>) JSON.deserialize(
                recordsJson,
                List<TestAccount__c>.class
            );
            System.debug(result);
            update result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // Recently View 용 Method
    @AuraEnabled(cacheable=true)
    public static List<TestAccount__c> getRecentlyAccountList() {
        List<TestAccount__c> result = [
            SELECT Id,Name, BillingAddress__c, Phone__c, Type__c, OwnerId, NumberOfEmployees__c, Rating__c, AnnualRevenue__c, LastViewedDate
            FROM TestAccount__c
            WHERE LastViewedDate != NULL
            ORDER BY LastViewedDate
            DESC NULLS LAST LIMIT 15
        ];
        return result;
    }
    // inline selected rows multiple delete 
    @AuraEnabled
    public static void deleteSelectedAccount(List<TestAccount__c> deleteRows) {
        delete deleteRows;
    }
    // Insert Record Detail page the clone data
    @AuraEnabled
    public static TestAccount__c insertTestAccountData(String accName, String accAddr, String accPhone, String accType, Integer accEmp, String accRating, Integer accAR) {
        try{
            TestAccount__c result = new TestAccount__c();
            result.Name = accName;
            result.BillingAddress__c = accAddr;
            result.Phone__c = accPhone;
            result.Type__c = accType;
            result.NumberOfEmployees__c = accEmp;
            result.Rating__c = accRating;
            result.AnnualRevenue__c = accAR;
            Database.SaveResult sr = Database.insert(result);
            return result;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    // Record Detail Page
    @AuraEnabled(Cacheable=true)
    public static List<TestAccount__c> getRecordDetail(Id recordId) {
        List<TestAccount__c> result = [
            SELECT Id,Name, BillingAddress__c, Phone__c, Type__c, OwnerId, NumberOfEmployees__c, Rating__c, AnnualRevenue__c, LastViewedDate
            FROM TestAccount__c
            WHERE Id = :recordId
        ];
        return result;
    }
}