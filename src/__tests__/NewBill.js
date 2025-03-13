/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom/extend-expect'
import { ROUTES_PATH, ROUTES } from '../constants/routes.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import store from '../__mocks__/store.js'
import mockStore from '../__mocks__/store'
import { bills } from "../fixtures/bills"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

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

  })

  describe('When I am on NewBill Page, I do fill all required fields and I submit the form', () => {
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

// integration tests POST 
describe('Given I am connected as an employee & I am on NewBill Page', () => {
  describe("When new bill's form is submited", () => {
    test('Then create new bill from mock API POST', async () => {
      const bill = [
        {
          id: "47qAXb6fIm2zOKkLzMro",
          vat: "80",
          fileUrl: "test_url",
          status: "pending",
          type: "Hôtel et logement",
          commentary: "séminaire billed",
          name: "encore",
          fileName: "test.jpg",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          email: "a@a",
          pct: 20,
        },
      ];
      const mockStoreSpy = jest.spyOn(mockStore, 'bills')
      mockStore.bills().create(bill)
      expect(mockStoreSpy).toHaveBeenCalledTimes(1)
    })

    /* beforeEach(() => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)
      router()
    }) */

    test('should create a new bill after form submission', async () => {
      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const store = mockStore;
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const form = screen.getByTestId('form-new-bill');
      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener('submit', handleSubmit);

      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();

      await waitFor(() => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: jest.fn(() => Promise.resolve(bills)),
          }
        });
        //expect(mockStore.bills().create).toHaveBeenCalled();
      });
    });

    describe('When an error occurs on API', () => {

      beforeEach(() => {
        jest.spyOn(mockStore, 'bills')
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
        const root = document.createElement('div')
        root.setAttribute('id', 'root')
        document.body.appendChild(root)
        router()
      })

      // test on a POST request with a 404 error
      test('Then it should handle the error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error('Erreur 404'))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick)
        const msg = await screen.getByDisplayValue(/Erreur 404/)
        expect(msg).toBeTruthy()
      })

      // test on a POST request with a 500 error
      test('Then It should create a new bill & fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error('Erreur 500'))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick)
        const msg = await screen.getByText(/Erreur 500/)
        expect(msg).toBeTruthy()
      })
    })
  })
})
