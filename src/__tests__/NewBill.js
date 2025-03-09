/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom/extend-expect'
import { ROUTES_PATH } from '../constants/routes.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import store from '../__mocks__/store.js'


describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
    })

    test('Then it should render NewBill page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    /* test('Then I should be able to upload a valid file', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH[pathname]
      }

      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
      const fileInput = screen.getByTestId('file')
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      expect(fileInput.files[0].name).toBe('test.png')
      expect(newBill.fileName).toBe('test.png')
    }) */
    /* test('Then I should see an alert if I upload an invalid file type', async () => {
      window.alert = jest.fn()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH[pathname]
      }
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
      const fileInput = screen.getByTestId('file')
      const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      expect(window.alert).toHaveBeenCalledWith('Invalid file type. Please select a jpg, jpeg, or png file.')
      expect(fileInput.value).toBe('')
    }) */
  })

  describe('When I am on NewBill Page, I do fill all required fields and I submit the form', () => {
    // modif. le When ...
    test('Then it should submit the form and renders Bills page.', () => {
      document.body.innerHTML = NewBillUI()
      const form = screen.getByTestId("form-new-bill")

      const selectExpenseType = screen.getByTestId("expense-type")
      fireEvent.change(selectExpenseType, { target: { value: "Transports" } })
      expect(selectExpenseType.value).toBe("Transports");

      const inputDate = screen.getByTestId("datepicker")
      fireEvent.change(inputDate, { target: { value: "2022-01-01" } })
      expect(inputDate.value).toBe("2022-01-01");

      const inputAmount = screen.getByTestId("amount")
      fireEvent.change(inputAmount, { target: { value: 348 } })
      expect(parseInt(inputAmount.value)).toBe(348);

      const inputPct = screen.getByTestId("pct")
      fireEvent.change(inputPct, { target: { value: 20 } })
      expect(parseInt(inputPct.value)).toBe(20);

      const inputFile = screen.getByTestId("file")
      fireEvent.change(inputFile, { target: { files: [new File(["fileToUpload"], "fileToUpload.pdf", { type: "application/pdf" })] } })
      expect(inputFile.files[0].name).toBe("fileToUpload.pdf");

      const handleSubmit = jest.fn((e) => e.preventDefault())
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })
  describe('When I am on NewBill Page, I do fill file field and I upload a file with a png extention. ', () => {
    test('Then it should ....', () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH[pathname]
      }
      const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFile)
      const file = new File(['dummy content'], 'test1.png', { type: 'image/png' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      expect(fileInput.files[0].name).toBe('test1.png')

      const handleAcceptSubmit = jest.fn(newBill.handleSubmit)
      const form = screen.getByTestId("form-new-bill")
      form.addEventListener("submit", handleAcceptSubmit)
      fireEvent.submit(form)

      expect(handleAcceptSubmit).toHaveBeenCalled()

      const handleSubmit = jest.fn((e) => e.preventDefault())
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
    })
  })
})

describe("Given I am connected as an employee", () => {
  /* describe("When I am on NewBill Page, I do fill all required fields and I submit form.", () => {
    test("Then It should renders Bills page and add the new bill to the list.", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      // check if a form element is currently required (An element is required if it is having a required or aria-required="true" attribute).
      expect(getByTestId('expense-type')).toBeRequired()
      expect(getByTestId('expense-name')).not.toBeRequired()
      expect(getByTestId('datepicker')).toBeRequired()
      expect(getByTestId('amount')).toBeRequired()
      expect(getByTestId('vat')).not.toBeRequired()
      expect(getByTestId('pct')).toBeRequired()
      expect(getByTestId('commentary')).not.toBeRequired()
      expect(getByTestId('file')).toBeRequired()

    })
  }) */

  describe("When I am on NewBill Page, I do fill expense-type, expense-name, datepicker & amount fields and I click on submit.", () => {
    test("Then It should renders NewBill page.", () => {
      /* const html = NewBillUI()
      document.body.innerHTML = html

      const selectExpenseType = screen.getByTestId('expense-type')
      fireEvent.change(selectExpenseType, { target: { value: 'Transports' } })
      expect(selectExpenseType.value).toBe('Transports')

      const inputExpenseName = screen.getByTestId('expense-name')
      fireEvent.change(inputExpenseName, { target: { value: 'heaven flying' } })
      expect(inputExpenseName.value).toBe('heaven flying') */

      /* const inputDate = screen.getByTestId('datepicker')
      fireEvent.change(inputDate, { target: { value: '01/03/2006' } })
      expect(inputDate.value).toBe('01/03/2006')

      const input = screen.getByTestId('')
      fireEvent.change(input, { target: { value: '' } })
      expect(input.value).toBe('')

      const input = screen.getByTestId('')
      fireEvent.change(input, { target: { value: '' } })
      expect(input.value).toBe('')

      const input = screen.getByTestId('')
      fireEvent.change(input, { target: { value: '' } })
      expect(input.value).toBe('')

      const input = screen.getByTestId('')
      fireEvent.change(input, { target: { value: '' } })
      expect(input.value).toBe('') 

      const inputAmount = screen.getByTestId('amount')
      fireEvent.change(inputAmount, { target: { value: 55765 } })
      expect(inputAmount.value).toBe(55765)

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => e.preventDefault())
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
*/
      //expect(getByTestId('expense-type')).toBeRequired()
      //expect(getByTestId('expense-name')).not.toBeRequired()
      // expect(getByTestId('datepicker')).toBeRequired()
      //expect(getByTestId('amount')).toBeRequired()
      /* expect(getByTestId('vat')).not.toBeRequired()
      expect(getByTestId('pct')).toBeRequired()
      expect(getByTestId('commentary')).not.toBeRequired()
      expect(getByTestId('file')).toBeRequired() */
    })
  })
})

/**************************************************************************************************
 * Test de soumission du formulaire
 *  GIVEN: Etant connecté commen employé, sur la page Nouvelle notes de frais & remplissant le formulaire,
 *  WHEN: Quand je soumet ce formulaire avec tous les champs requis remplis,
 *  THEN: Alors le formulaire doit être soumis avec succès
***************************************************************************************************/

/* describe('Given I am connected as an employee, I am on NewBill Page & I am filling the new bill form', () => {
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
}); */

/* describe("Given I am connected as an employee", () => {
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
}) */