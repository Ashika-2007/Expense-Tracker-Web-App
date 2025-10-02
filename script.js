let expenses = [];
let chart;

// Load existing expenses from localStorage
if(localStorage.getItem('expenses')){
  expenses = JSON.parse(localStorage.getItem('expenses'));
}

// Handle Category "Other"
function handleCategoryChange() {
  const category = document.getElementById("category").value;
  const otherInput = document.getElementById("otherCategory");
  otherInput.style.display = (category === "Other") ? "block" : "none";
}

// Format Date as DD-MM-YYYY
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Add Expense
function addExpense() {
  let category = document.getElementById("category").value;
  if (category === "Other") {
    category = document.getElementById("otherCategory").value || "Other";
  }
  const amount = parseFloat(document.getElementById("amount").value);
  const dateInput = document.getElementById("date").value;

  if (!category || !amount || !dateInput) {
    alert("Please fill all fields!");
    return;
  }

  const formattedDate = formatDate(dateInput);
  expenses.push({ category, amount, date: formattedDate });
  localStorage.setItem('expenses', JSON.stringify(expenses)); // save to localStorage
  alert("Expense added!");
}

// Generate Monthly Report
function generateReport() {
  const month = prompt("Enter month number (1-12) for report:");
  if (!month) return;

  const filtered = expenses.filter(exp => {
    const m = exp.date.split("-")[1]; // extract MM
    return parseInt(m) == month;
  });

  if (filtered.length === 0) {
    alert("No expenses found for this month!");
    return;
  }

  const summary = {};
  filtered.forEach(exp => {
    summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
  });

  renderPieChart(summary, `Expenses for Month ${month}`);
}

// Compare Reports Category-wise
function compareReports() {
  const month1 = prompt("Enter first month number (1-12):");
  const month2 = prompt("Enter second month number (1-12):");
  if (!month1 || !month2) return;

  const filtered1 = expenses.filter(exp => parseInt(exp.date.split("-")[1]) == month1);
  const filtered2 = expenses.filter(exp => parseInt(exp.date.split("-")[1]) == month2);

  const summary1 = {}, summary2 = {};
  filtered1.forEach(exp => summary1[exp.category] = (summary1[exp.category] || 0) + exp.amount);
  filtered2.forEach(exp => summary2[exp.category] = (summary2[exp.category] || 0) + exp.amount);

  renderBarChart(summary1, summary2, month1, month2);
}

// Render Pie Chart
function renderPieChart(data, title) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: generateColors(Object.keys(data).length)
      }]
    },
    options: { plugins: { title: { display: true, text: title, font: { size: 18 } } } }
  });
}

// Render Bar Chart for comparison
function renderBarChart(data1, data2, month1, month2) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  if(chart) chart.destroy();

  const labels = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)]));
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: `Month ${month1}`, data: labels.map(l => data1[l] || 0), backgroundColor: 'rgba(75, 192, 192, 0.7)' },
        { label: `Month ${month2}`, data: labels.map(l => data2[l] || 0), backgroundColor: 'rgba(255, 99, 132, 0.7)' }
      ]
    },
    options: { plugins: { title: { display: true, text: `Comparison Month ${month1} vs ${month2}`, font:{size:18} } }, responsive:true }
  });
}

// Generate distinct colors for pie chart
function generateColors(count){
  const palette = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#00A86B','#FF1493'];
  return palette.slice(0,count);
}

// Theme switching
document.getElementById("theme").addEventListener("change", function() {
  document.body.className = ""; // reset
  const theme = this.value;
  document.body.classList.add(theme);
});
