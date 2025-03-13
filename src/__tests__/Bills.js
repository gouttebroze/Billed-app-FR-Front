/**
 * @jest-environment jsdom
 */
import { getByTestId, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import Bills, { getBills } from '../containers/Bills.js'
import NewBillUI from "../views/NewBillUI.js";

/***** use getAllByTestId pr récupérer pluieurs élément (ici, la liste des notes de frais) *******/
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {

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
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

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
  describe("When I am on Bills Page and I click on 'Nouvelle note de frais' button", () => {
    test('Then, It should renders NewBill page', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const handleClickNewBill = jest.fn((e) => e.preventDefault)
      const newBill = screen.getByTestId('btn-new-bill')
      newBill.addEventListener('click', handleClickNewBill)
      userEvent.click(newBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      //expect(screen.getBy...t()).toBeTruthy()
    })
  })

  describe('When I am on Bills page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })
  // test click sur icon oeil pr afficher modale avec justificatifs de la note de frais
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      //document.body.innerHTML = BillsUI.render(bills)

      const bills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
      if (iconEye) iconEye.forEach(icon => {
        const handleClickIconEye = jest.fn((e) => bills.handleClickIconEye(e))
        icon.addEventListener('click', handleClickIconEye)
        userEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalled()
        const modale = screen.getByTestId('modaleFileEmployee')
        expect(modale).toBeTruthy()
      })
    })
  })
})

// TODO : test d'intégration GET
describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then I should fetch bills from the mock API GET', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText('Mes notes de frais'))
      expect(screen.getByTestId('tbody')).toBeTruthy()
      const bills = await mockStore.bills().list()
      expect(bills.length).toBe(4)
    })

    describe('When an error occurs on API', () => {
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

      test("fetches bills from an API and fails with 404 message error", async () => {
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

      test("fetches messages from an API and fails with 500 message error", async () => {
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
