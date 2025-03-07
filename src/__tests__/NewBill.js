/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

    })
  })
  describe("When I do not fill fields and I click on submit", () => {
    test("Then I am on NewBill Page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

    })
  })
})

/**************************************************************************************************
 * Test de soumission du formulaire
 *  GIVEN: Etant connecté commen employé, sur la page Nouvelle notes de frais & remplissant le formulaire,
 *  WHEN: Quand je soumet ce formulaire avec tous les champs requis remplis,
 *  THEN: Alors le formulaire doit être soumis avec succès
***************************************************************************************************/

describe('Given I am connected as an employee, I am on NewBill Page & I am filling the new bill form', () => {
  describe('When I submit the form with all required fields filled', () => {
    test('The form should be submitted successfully', () => {
      // recupération des data attributes "data-testid"
      const form = screen.getByTestId('form-new-bill');
      const expenseType = screen.getByTestId('expense-type');
      const expenseName = screen.getByTestId('expense-name');
      const datepicker = screen.getByTestId('datepicker');
      const amount = screen.getByTestId('amount');
      const vat = screen.getByTestId('vat');
      const pct = screen.getByTestId('pct');
      const commentary = screen.getByTestId('commentary');
      const file = screen.getByTestId('file');
      //const btnSendBill = screen.getByTestId('btn-send-bill');

      // see user-event to replace fireEvent
      fireEvent.change(expenseType, { target: { value: 'Transports' } });
      fireEvent.change(expenseName, { target: { value: 'Vol Paris Londres' } });
      fireEvent.change(datepicker, { target: { value: '2022-01-01' } });
      fireEvent.change(amount, { target: { value: '348' } });
      fireEvent.change(vat, { target: { value: '70' } });
      fireEvent.change(pct, { target: { value: '20' } });
      fireEvent.change(commentary, { target: { value: 'Test Commentary' } });
      fireEvent.change(file, { target: { files: [new File(['test'], 'test.pdf', { type: 'application/pdf' })] } });

      const handleSubmit = jest.fn();
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should display title", () => { // Mes notes de frais
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      // "When I do fill fields in correct format and I click on submit"
      // "When I do not fill fields and I click on submit"
    })
  })
  describe("When I do not fill fields and I click on submit", () => {
    test("Then I am on NewBill Page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

    })
  })
  /* describe("When I upload a file", () => {
    // Test case: should upload only file with png, jpg or jpeg extention
    test('should upload only file with png, jpg or jpeg extention', () => {

    })
  }) */
})