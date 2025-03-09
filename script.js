const API_KEY = "AIzaSyA-m2A1rED7UxYt0QiZPXsSfF-3GGVWcqQ";
const SPREADSHEET_ID = "15nIfpPsyRVPNy7DCBa3R6wLNs8himrU0DcDCVa6Cdb0";
const RANGE = "final-result";

async function fetchResults() {
    const rollNumber = document.getElementById("rollNumber").value;
    if (!rollNumber) {
        alert("Please enter a roll number");
        return;
    }
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data.values;
        displayResults(data, rollNumber);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayResults(data, rollNumber) {
    const studentDetails = document.getElementById("studentDetails");
    const resultsContainer = document.getElementById("results");
    studentDetails.innerHTML = "";
    resultsContainer.innerHTML = "";

    const headers = data[0];
    const studentData = data.find(row => row[0] == rollNumber);
    if (!studentData) {
        studentDetails.innerHTML = "<p>No student found with this Roll Number.</p>";
        return;
    }

    studentDetails.innerHTML = `<center><h3>Student Details</h3></center>
                                <table>
                                    <tr><th>Roll No</th><td>${studentData[0]}</td></tr>
                                    <tr><th>Name</th><td>${studentData[1]}</td></tr>
                                </table>`;

    let tableHtml = "";
    let i = 2;
    while (i < headers.length) {
        if (headers[i] === "Date") {
            let tableContent = `<div class='table-container'>
                                    <h3>${studentData[i]} - ${studentData[i+1]}</h3>
                                    <table>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Marks</th>
                                        </tr>`;
            
            i += 2; 
            while (i < headers.length && headers[i] !== "Date") {
                let subject = headers[i];
                let marks = studentData[i];
                
                if (marks && !marks.includes("(") && subject !== "Maths/Bio" && subject !== "Computer/PE") {
                    tableContent += `<tr><td>${subject}</td><td>${marks}</td></tr>`;
                } else if ((subject === "Maths/Bio" || subject === "Computer/PE") && marks.includes("(")) {
                    let extractedSubject = marks.match(/\((.*?)\)/);
                    if (extractedSubject) {
                        tableContent += `<tr><td>${extractedSubject[1]}</td><td>${marks.replace(/\(.*?\)/, "").trim()}</td></tr>`;
                    }
                }
                i++;
            }

            tableContent += `</table></div>`;
            tableHtml += tableContent;
        } else {
            i++;
        }
    }
    resultsContainer.innerHTML = tableHtml;
}
