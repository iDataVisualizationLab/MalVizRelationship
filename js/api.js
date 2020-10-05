let harmlessIcon = '<i class="fa fa-check-circle fa-lg" style="color: #4CAF50" aria-hidden="true"></i>';
let maliciousIcon = '<i class="fa fa-bug fa-lg" style="color: red" aria-hidden="true"></i>';
let suspiciousIcon = '<img src="images/suspiciousIcon.png" width="19px"/>';
let undetectedIcon = '<i class="fa fa-question-circle fa-lg"  aria-hidden="true"></i>';
let timeoutIcon = '<img src="images/timeout.png" width="25"/>';

const keys = ["malicious", "suspicious", "timeout", "undetected", "harmless"];

function loadDataAPI(domainData, networkData) {
    console.log(networkData);

    let sortedDomainData = domainData.sort(function (a,b) {
        return countGreaterThanZero(b) - countGreaterThanZero(a)
    })

    console.log(sortedDomainData);

    const domains = sortedDomainData.map(d => d.domain);

    $("#apiTableHolder").empty();
    d3.select("#apiTableHolder").selectAll("*").remove();

    var titles = ["Target Domains", "IP Address", "VirusTotal Detection", "Associated Processes | Activities", "Country"];

    let thisTable = d3.select('#apiTableHolder')
        .attr("class", "w3-responsive")
        .append('table')
        .attr("class", "w3-table w3-striped w3-bordered w3-border-top");


    thisTable.append('tbody')
        .attr("id", "tb")
        .append('tr')
        .selectAll('th')
        .data(titles).enter()
        .append('th')
        .style("margin-top", "15px")
        .text(d => d.charAt(0).toUpperCase() + d.substring(1))
        .attr("font-weight", "bold");

    domainData.forEach(function (row, index) {
        console.log(row)
        var domainValue = row.domain;

        var IPValue = row.urlLocation.ip;

        var virusTotalValue = virusCheck(row) ? virusCheck(row) : "Unavailable";

        var linkedProcess = linkedProcesses(domainValue, networkData)

        var countryValue = row.urlLocation.country_name ?
            '<p>' + row.urlLocation.location.country_flag_emoji + ' ' +
            row.urlLocation.city + ", " +
            row.urlLocation.region_name + ', ' +
            row.urlLocation.country_name + '</p>' :
            "Unavailable";

        return $("#tb").append('<tr>' +
            '<td>' + domainValue + '</td>' +
            '<td>' + IPValue + '</td>' +
            '<td>' + virusTotalValue + '</td>' +
            '<td>' + linkedProcess + '</td>' +
            '<td>' + countryValue + '</td>' +

            '</tr>');
    });

}

function linkedProcesses(domain, networkData) {
    let str = "";
    let objProcess = {};
    let arr = networkData.filter(d => d.Path.indexOf(domain.toLowerCase()) >= 0).map(d => d.Process_Name+ " | "+d.Operation);
    arr.forEach(d => {
        if (!objProcess[d]){
            objProcess[d] = true;
            str = str.concat(d + '<br>')
        }
    })

    return str;
}

function virusCheck(row){
    let check = row.virusCheck.data[0];
    if (check){
        let stats = row.virusCheck.data[0].attributes.last_analysis_stats;

        let resultCriteria = keys.filter(d => stats[d] > 0);

        if ((resultCriteria.length === 1) && (resultCriteria[0] === "harmless")){
            return harmlessIcon + " harmless";
        }
        else {
            let str = "";
            resultCriteria.forEach(d => {
                if (d === "malicious"){
                    str = str.concat(eval(d+"Icon") + " " + "<span style='color: red'>" + d  + " (" + stats[d]) + ") "+"</span>" + "<br>"
                }
                else if (d === "suspicious"){
                    str = str.concat(eval(d+"Icon") + " " + "<span style='color: #7336d2'>" + d  + " (" + stats[d]) + ") "+"</span>" + "<br>"
                } else {
                    str = str.concat(eval(d+"Icon") + " " + d + " (" + stats[d]) + ") "+ '<br>'
                }
            })
            console.log(str);
            return str;
        }
    }
    else return "Unavailable"

}

function countGreaterThanZero(row) {
    let check = row.virusCheck.data[0];
    if (check){
        let stats = row.virusCheck.data[0].attributes.last_analysis_stats;
        let resultCriteria = keys.filter(d => stats[d] > 0);
        if (stats["malicious"] > 0)
            return resultCriteria.length + 1;
        else return resultCriteria.length;
    }
    else return 0;
}