import { LightningElement, wire, track } from 'lwc';
import getOpportunityReport from '@salesforce/apex/CustomReportView.getOpportunityReport';

export default class CustomReportView extends LightningElement {
    
    // wire : 메서드와 연결하여 데이터를 가져온다
    // Opportunity Report를 호출하고 그 결과를 받아온다.
    // 호출결과가 성공하면 'data', 결과 데이터가 실패하면 'ㄷㄱ객;에 오류 정보가 전달된다.
    @wire(getOpportunityReport)
    wiredopportunities({ data, error }) {
        if (data) {
            this.OpportunityArray = data;
        } else if (error) {
            console.error(error);
        }
    }
    // 기회 데이터를 저장할 배열, 변경을 감지하기 위해 @track 사용
    @track OpportunityArray = [];

    // 그룹화된 기회 보고서 데이터를 생성하는 메서드
    get OppReport() {

        // 빈 Map을 생성하여 사용자별로 데이터를 그룹화할 map 객체
        let groupedDataMap = new Map();

        // OpportunityArray 배열의 각 항목을 반복하며 데이터를 그룹화한다.
        this.OpportunityArray.forEach(opportunity => {
            // 각 기회의 필요한 데이터를 추출하여 opp객체에 저장
            let opp = {
                UserName : opportunity.UserName__c,
                opName : opportunity.Name
            };
            if(groupedDataMap.has(opp.UserName)) {
                // 이미 UserName의 데이터가 있는 경우, opportunities 배열을 생성하고 데이터를 추가
                groupedDataMap.get(opp.UserName).opportunities.push(opp);
            } else {
                // 해당 UserName의 데이터가 없는 경우, 새로운 opportunity 배열을 생성하고 데이터를 추가
                let newOpportunity = {};
                newOpportunity.UserName = opp.UserName;
                newOpportunity.opportunities = [opp];
                groupedDataMap.set(opp.UserName, newOpportunity);
            }
        });

        // 그룹화된 데이터 map의 값을 기반으로 보고서를 생성
        let itr = groupedDataMap.values();

        // 결과를 반환할 그룹화된 기회 보고서 데이터 배열
        let OppReport = [];

        // 각 UserName별 데이터 객체에 rowspan 속성 추가하고 결과배열에 추가
        let result = itr.next();
        while(!result.done) {
            result.value.rowspan = result.value.opportunities.length + 1;
            OppReport.push(result.value);
            result = itr.next();
        }

        // 최종 보고서 데이터를 반환
        return OppReport;
    }
}