import "./style.css";

// console.log("Tailwind is ready!");

import { generateReturnsArray } from "./investimentGoals.js";

const calculateButton = document.getElementById("calculate-results");

function renderProgression() {
  const startingAmount = Number(
    document.getElementById("startingAmount").value
  );

  const additionalContribution = Number(
    document.getElementById("additionalContribution").value
  );

  const timeAmount = Number(document.getElementById("timeAmount").value);
  const timeAmountPeriod = document.getElementById("timeAmountPeriod").value;
  const returnRate = Number(document.getElementById("returnRate").value);
  const returnRatePeriod = document.getElementById("evaluationPeriod").value;
  const taxRate = Number(document.getElementById("taxRate").value);

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );
  console.log(returnsArray);
}

calculateButton.addEventListener("click", renderProgression);
