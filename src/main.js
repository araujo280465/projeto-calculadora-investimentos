import "./style.css";

import Chart from "chart.js/auto";

// console.log("Tailwind is ready!");

import { generateReturnsArray } from "./investimentGoals.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

const form = document.getElementById("investment-form");

const calculateButton = document.getElementById("calculate-results");

const clearFormButton = document.getElementById("idClearFormButton");

let doughnutChartReference = {};

let progressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    // Se houver algum input inválido, não prossegue com o cálculo
    //    console.log("Há campos inválidos. Corrija-os antes de prosseguir.");
    return;
  }
  resetCharts();
  const startingAmount = Number(
    document.getElementById("startingAmount").value.replace(",", ".")
  );

  const additionalContribution = Number(
    document.getElementById("additionalContribution").value.replace(",", ".")
  );

  const timeAmount = Number(
    document.getElementById("timeAmount").value.replace(",", ".")
  );
  const timeAmountPeriod = document.getElementById("timeAmountPeriod").value;
  const returnRate = Number(
    document.getElementById("returnRate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluationPeriod").value;
  const taxRate = Number(
    document.getElementById("taxRate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );
  // console.log(returnsArray);
  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investimento", "Rendimento", "Imposto"],
      datasets: [
        {
          label: "My First Dataset",
          data: [
            formatCurrency(finalInvestimentObject.investedAmount),
            formatCurrency(
              finalInvestimentObject.totalInterestReturn * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestimentObject.totalInterestReturn * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();

    progressionChartReference.destroy();
  }
}

function clearForm() {
  // clears only the input values and error messages, not the form itself
  const inputs = form.querySelectorAll("input[name]");
  for (const input of inputs) {
    input.value = "";
    const parentElement = input.parentElement;
    const grandParentElement = parentElement.parentElement;
    parentElement.classList.remove("error");
    const errorTextElement = grandParentElement.querySelector(".text-red-500");
    if (errorTextElement) {
      grandParentElement.removeChild(errorTextElement);
    }
  }
  form.timeAmountPeriod.value = "monthly"; // Define o período de tempo padrão como mensal
  form.evaluationPeriod.value = "monthly"; // Define o período de avaliação padrão como mensal

  resetCharts();

  //console.log("Formulário limpo!");
  return false; // Para evitar o comportamento padrão do botão de submit
}

function validadeInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const parentElement = evt.target.parentElement;
  const grandParentElement = parentElement.parentElement;

  const inputValue = evt.target.value.replace(",", ".");
  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    // meta <p class="text-red-500">Insira um valor numérico maior que zero</p>
    const errorTextElement = document.createElement("p"); //<p></p>
    errorTextElement.classList.add("text-red-500"); //<pclass="text-red-500></p>
    errorTextElement.textContent = "Insira um valor numérico maior que zero"; //<p class="text-red-500">Insira um valor numérico maior que zero</p>
    parentElement.classList.add("error"); // <div class="error"></div>
    grandParentElement.appendChild(errorTextElement); //<div class="error"><p class="text
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    // Se o input for válido e já tiver a classe de erro, removemos a classe e o texto de erro
    parentElement.classList.remove("error");
    const errorTextElement = grandParentElement.querySelector(".text-red-500");
    if (errorTextElement) {
      grandParentElement.removeChild(errorTextElement);
    }
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validadeInput);
  }
}

form.addEventListener("submit", renderProgression);

clearFormButton.addEventListener("click", clearForm);
