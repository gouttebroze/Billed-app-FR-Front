/**
 * @jest-environment jsdom
 */
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import Bills, { getBills } from '../containers/Bills.js'

/***** use getAllByTestId pr récupérer pluieurs élément (ici, la liste des notes de frais) *******/
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {

  describe("When I click on icon eye", () => {
    test('Then the modal is open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: localStorageMock,
      })
      const iconEye = screen.getAllByTestId('icon-eye')[0]
      $.fn.modal = jest.fn()
      const handleIconEyeClick = jest.fn(() => {
        billsContainer.handleClickIconEye
      })
      iconEye.addEventListener('click', handleIconEyeClick)
      fireEvent.click(iconEye)
      expect(handleIconEyeClick).toHaveBeenCalled()
      expect($.fn.modal).toHaveBeenCalled()
    });
  })

  // test code implementation to fix issue describe on kanban (add missed imports & fix errors on attributs writting)
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByTestId('icon-window')[0])
      const windowIcon = screen.getAllByTestId('icon-window')[0]

      // todo on this test part: implement expect test part
      expect(windowIcon).toHaveClass('active-icon')
    })

    // test si notes bien trié du + récent au + ancien
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I am on Bills Page and I click on new bill's button", () => {
    test('Then, It should call handleClickNewBill method,', () => {
      //, It should renders the new bill page
      document.body.innerHTML = BillsUI({ data: bills })
      const handleClickNewBill = jest.fn((e) => e.preventDefault)
      const newBill = screen.getByTestId('btn-new-bill')
      newBill.addEventListener('click', handleClickNewBill)
      userEvent.click(newBill)
      expect(handleClickNewBill).toHaveBeenCalled()
    })

    test('Then, It should renders the new bill page', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      })
      const newBill = screen.getByTestId('btn-new-bill')
      userEvent.click(newBill)
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    })
  })

  describe('When I am on Bills page but it is loading', () => {
    test('Then, It should displayed loading component,', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })

  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, an error page should be rendered', () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
})

// Integration test (GET method)
describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then I should get bills datas, from the mock API', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText('Mes notes de frais'))

      // test boolean value on BillsUI data attributs
      expect(screen.getByTestId('tbody')).toBeTruthy()
      const bills = await mockStore.bills().list()
      expect(bills.length).toBe(4)
    })

    describe('When an error occurs on API', () => {
      // test form submission 
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage', {
          value: localStorageMock
        }
        )
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from a mocked API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from a mocked API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
