import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor01.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// ssecurity-code
const cvcCode = document.getElementById("security-code")
const cvcCodePattern = {
  mask: "0000",
}
const cvcCodeMasked = IMask(cvcCode, cvcCodePattern)

function updateCvc(code) {
  const ccCvc = document.querySelector(".cc-security .value")
  ccCvc.innerText = code.length === 0 ? "123" : code
}

cvcCodeMasked.on("accept", () => updateCvc(cvcCodeMasked.value))

const expDate = document.querySelector("#expiration-date")
const expDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expDateMasked = IMask(expDate, expDatePattern)

function updateExpDate(date) {
  const ccExpDate = document.querySelector(".cc-extra .cc-expiration .value")
  ccExpDate.innerText = date.length === 0 ? "02/32" : date
}

expDateMasked.on("accept", () => updateExpDate(expDateMasked.value))

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document
  .querySelector("form")
  .addEventListener("submit", (event) => event.preventDefault())

const nameInput = document.querySelector("#card-holder")
nameInput.addEventListener("input", () => {
  const ccName = document.querySelector(".cc-holder .value")
  ccName.innerText =
    nameInput.value.length === 0 ? "FULANO DA SILVA" : nameInput.value
})
