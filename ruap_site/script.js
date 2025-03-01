document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    const modal = document.getElementById("loanResultModal");
    const loanMessage = document.getElementById("loanMessage");
    const closeModal = document.querySelector(".close");

    if (!form) {
        console.error("Form not found!");
        return;
    }

    const proxyUrl = 'http://localhost:3000/proxy'; 

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formattedData = {
            person_age: parseFloat(formData.get('person_age')) || 0,
            person_gender: formData.get('person_gender') || "unknown",
            person_education: formData.get('person_education') || "unknown",
            person_income: parseFloat(formData.get('person_income')) || 0,
            person_emp_exp: parseInt(formData.get('person_emp_exp')) || 0,
            person_home_ownership: formData.get('person_home_ownership') || "unknown",
            loan_amnt: parseFloat(formData.get('loan_amnt')) || 0,
            loan_intent: formData.get('loan_intent') || "unknown",
            credit_score: parseInt(formData.get('credit_score')) || 0,
            previous_loan_defaults_on_file: formData.get('previous_loan_defaults_on_file') === 'yes',
            loan_status: 1
        };

        const requestBody = {
            Inputs: {
                input1: [formattedData]
            }
        };

        console.log("Sending JSON Data:", JSON.stringify(requestBody, null, 2));

        try {
            const response = await axios.post(proxyUrl, requestBody, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Server Response:", response.data);

            
            let loanResult = response.data?.Results?.WebServiceOutput0?.[0]?.loan_status; 
            let scoredProbability = response.data?.Results?.WebServiceOutput0?.[0]?.["Scored Probabilities"];

            console.log("Scored Probability:", scoredProbability); 
            if (loanResult === 1) {
                loanMessage.innerHTML = `You can have a loan.`;
                loanMessage.style.color = "green";
                modal.style.display = "flex";
            } else {
                loanMessage.innerHTML = `Unfortunately, you can't have a loan.`;
                loanMessage.style.color = "red";
                modal.style.display = "flex";
            }

        } catch (error) {
            console.error("Request failed:", error);
            loanMessage.innerHTML = "⚠️ An error occurred while processing your request.";
            loanMessage.style.color = "orange";
            modal.style.display = "flex";
        }
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
