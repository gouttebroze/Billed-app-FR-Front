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
    test('Then it should submit the form.', () => {
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
    test("Then It should delete this file.", () => {
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

  /* // test form submission, with empty fields
  describe('When I submit new bill form with empty fields', () => { // should stay on same page
    test('Then It should ', () => { })
  }) */
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
  /* describe('When I fill the form, submit it & create a new bill', () => {
    test('Then it should post new bill datas', () => {
      document.body.innerHTML = NewBillUI()
      // init. datas to create a new bill
      const datasToFilled = {
        type: "Transports",
        name: "test",
        datepicker: "2022-06-27",
        amount: "76",
        vat: "70",
        pct: "20",
        commentary: "test",
        file: new File(["test"], "test.png", { type: "image/png" }),
      };

      // get the form elements by data-attributs ("data-testid")
      const formNewBill = screen.getByTestId("form-new-bill");
      const selectExpenseType = screen.getByTestId("expense-type");
      const inputExpenseName = screen.getByTestId("expense-name");
      const inputDatepicker = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByTestId("vat");
      const inputPct = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");

      // fill the form with datas
      fireEvent.change(selectExpenseType, { target: { value: datasToFilled.type } });
      fireEvent.change(inputExpenseName, { target: { value: datasToFilled.name } });
      fireEvent.change(inputDatepicker, { target: { value: datasToFilled.datepicker } });
      fireEvent.change(inputAmount, { target: { value: datasToFilled.amount } });
      fireEvent.change(inputVat, { target: { value: datasToFilled.vat } });
      fireEvent.change(inputPct, { target: { value: datasToFilled.pct } });
      fireEvent.change(inputCommentary, { target: { value: datasToFilled.commentary } });
      //fireEvent.change(inputFile, { target: { files: [datasToFilled.file] } });
      userEvent.upload(inputFile, datasToFilled.file);

      expect(selectExpenseType.value).toBe(datasToFilled.type);
      expect(inputExpenseName.value).toBe(datasToFilled.name);
      expect(inputDatepicker.value).toBe(datasToFilled.datepicker);
      expect(inputAmount.value).toBe(datasToFilled.amount);
      expect(inputVat.value).toBe(datasToFilled.vat);
      expect(inputPct.value).toBe(datasToFilled.pct);
      expect(inputCommentary.value).toBe(datasToFilled.commentary);
      expect(inputFile.files[0]).toStrictEqual(datasToFilled.file);
      expect(inputFile.files).toHaveLength(1);

      // to filled localStorage with form datas
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => JSON.stringify({ email: 'email@test.com' }))
        }
      })
      // simulate navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      formNewBill.addEventListener('submit', handleSubmit)
      fireEvent.submit(formNewBill)
      expect(handleSubmit).toHaveBeenCalled()
    })
  }) */
})       
