import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import '@testing-library/jest-dom/extend-expect'

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Should render the 'Nouvelle note de frais' button", () => {
      const html = BillsUI()
      document.body.innerHTML = html
      const newBillButton = screen.getByTestId('btn-new-bill')
      expect(newBillButton).toBeTruthy()
      expect(newBillButton.textContent).toBe('Nouvelle note de frais')
    })

    // test: alors ns sommes sur la page "Bills", & ainsi, ns devrions avoir le texte 'mes notes de frais' 
    test('Then, it should render Bills page', () => {
      document.body.innerHTML = BillsUI();
      expect(screen.getAllByText('Mes note de frais')).toBeTruthy()
    })

    // tester si le status de la chaque note est bien reneigné
    test('Should displayed every bill status.', () => {

    })

    // tester si une modale apparait avec la visualisation des fichier justificatifs
  })


})
