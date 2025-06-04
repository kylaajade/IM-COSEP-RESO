document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const inputData = {
        "Weight_(kg)": parseFloat(document.getElementById('weight').value),
        "BMI": parseFloat(document.getElementById('bmi').value),
        "General_Health": document.getElementById('generalHealth').value,
        "Exercise": document.getElementById('exercise').value,
        "Depression": document.getElementById('depression').value,
        "Diabetes": document.getElementById('diabetes').value,
        "Sex": document.getElementById('sex').value,
        "Age_Category": document.getElementById('ageCategory').value,
        "Smoking_History": document.getElementById('smokingHistory').value,
        "Alcohol_Consumption": document.getElementById('alcoholConsumption').value
    };

    try {
        const response = await fetch('http://localhost:8000/api/hfp_prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: [inputData] })
        });

        const result = await response.json();
        const prediction = result.prediction[0];

        // Assuming prediction is in the form of { "0": 0, "1": 100 } or similar
        const predictedClass = prediction["1"] > prediction["0"] ? "Yes" : "No";

        document.getElementById('result').innerHTML = `
            <div class="alert alert-info text-start" role="alert">
                <h4 class="alert-heading">Prediction Result</h4>
                <p><strong>Prediction:</strong> ${predictedClass}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `
            <div class="alert alert-danger" role="alert">
                An error occurred while making the prediction.
            </div>
        `;
    }
});
