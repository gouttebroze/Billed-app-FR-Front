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

    test('Then it should displayed NewBill page title', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    test("Then mail icon in vertical layout should be highlighted", async () => {
      const pathname = ROUTES_PATH["NewBill"];
      root.innerHTML = ROUTES({ pathname: pathname, loading: true });
      document.getElementById("layout-icon1").classList.remove("active-icon");
      document.getElementById("layout-icon2").classList.add("active-icon");
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      const iconActivated = mailIcon.classList.contains("active-icon");
      expect(iconActivated).toBeTruthy();
    });

    test("Then window icon in vertical layout should be highlighted", async () => {
      const pathname = ROUTES_PATH["NewBill"];
      root.innerHTML = ROUTES({ pathname: pathname, loading: true });
      document.getElementById("layout-icon1").classList.add("active-icon");
      document.getElementById("layout-icon2").classList.remove("active-icon");
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      const iconActivated = windowIcon.classList.contains("active-icon");
      expect(iconActivated).toBeTruthy();
    });
  })

  describe('When I am on NewBill Page, I do fill all required fields,', () => {
    test('Then it should submit the form with values indicated in the form fields.', () => {
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
      fireEvent.change(inputFile, { target: { files: [new File(["fileToUpload"], "fileToUpload.png", { type: "application/png" })] } })
      expect(inputFile.files[0].name).toBe("fileToUpload.png");

      const handleSubmit = jest.fn((e) => e.preventDefault())
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })

  describe("When I select a file with an incorrect extension", () => {
    test("Then this file should be deleted.", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);
      fireEvent.change(input, {
        target: {
          files: [
            new File(["file.pdf"], "file.pdf", {
              type: "image/txt",
            }),
          ],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0].name).toBe("file.pdf");
    });
  });

  describe('When I am on NewBill page, I fill in every field on the form & I select a file with a correct extention, to be uploaded,', () => {
    test('Then it should submit the form with the uploaded file', () => {
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
describe('Given I am connected as an employee,', () => {
  describe("When I am on the NewBill page, I have filled in every required fields & I submit this form,", () => {
    // test-"Puis Il devrait renvoyer les données que j'ai envoyé avec la soumission du formulaire"
    test("Then It should fetch datas I have post since form's submission,", async () => {
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

    beforeEach(() => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)
      router()
    })

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
      });
    });
  })
})       
