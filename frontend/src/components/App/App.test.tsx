import { render, fireEvent, waitFor } from "@testing-library/react"
import App from "./App";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const matchers = require("@testing-library/jest-dom");
expect.extend(matchers);

describe("The home screen", () => {
  it("should have 19 buttons", async () => {
    const dom = render(<App />);
    const title = dom.container.querySelector("#app-title");
    const buttons = dom.container.querySelectorAll("button");
    expect(title).toBeVisible();
    expect(buttons.length).toEqual(19);
  });

  it("including a history toggle button", async () => {
    const dom = render(<App />);
    const historyToggle = dom.container.querySelector(".history-toggle");
    expect(historyToggle).not.toBeFalsy();
  });

  it("should also have calculator screen", async () => {
    const dom = render(<App />);
    const calculator = dom.container.querySelector(".calculator");
    expect(calculator).not.toBeFalsy();
  });

  it("should show the history page when the history button is clicked", async () => {
    const dom = render(<App />);
    const historyToggle = dom.container.querySelector(".history-toggle");
    expect(historyToggle).not.toBeNull();
    fireEvent.click(historyToggle!);
    const btns = dom.container.querySelectorAll("button");
    expect(btns.length).toEqual(2);
  });
});

describe("The history screen", () => {
  it("should display the app title and 2 buttons", async () => {
    const dom = render(<App />);
    const title = dom.container.querySelector("#app-title");
    expect(title, "The title ").toBeVisible();

    const historyToggle = dom.container.querySelector(".history-toggle");
    fireEvent.click(historyToggle!);
    const buttons = dom.container.querySelectorAll("button");
    expect(buttons.length).toEqual(2);
  });

  it("should have 3 history items", async () => {
    const dom = render(<App />);
    const historyToggle = dom.container.querySelector(".history-toggle");
    fireEvent.click(historyToggle!);

    await waitFor(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 4000);
      });
    }, {
      timeout: 5000
    });
    expect(dom.container.querySelector('.history-item')).toBeVisible();

    const historyItems = dom.container.querySelectorAll("li.history-item");
    expect(historyItems.length, `Found only ${historyItems.length} history item`).toEqual(3);

    const contents = [...historyItems].map(historyItem => historyItem?.textContent?.replace(" ", "")).sort();
    expect(contents).toEqual(["1+2=3", "4+5=9", "10+11=21"].sort());
  });

  test("Run calculations correctly", () => {
    it("should display the correct figures", async () => {
      const dom = render(<App />);
      const screenElement = dom.container.querySelector(".display");
      expect(screenElement).toBeVisible();

      const buttons = dom.container.querySelector("calculator")?.querySelectorAll("button");

      const contents = [...buttons].reduce((all: { [name: string]: HTMLButtonElement }, button: HTMLButtonElement) => {
        const label = button.textContent || "=";
        all[label] = button;
        return all;
      }, {});

      fireEvent.click(contents["1"]);
      fireEvent.click(contents["1"]);
      fireEvent.click(contents["+"]);
      fireEvent.click(contents["1"]);
      fireEvent.click(contents["1"]);
      fireEvent.click(contents["="]);

      await waitFor(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 4000);
        });
      }, {
        timeout: 5000
      });

      expect(screenElement?.textContent?.replace(" ", "")).toEqual("11+11=22");
      fireEvent.click(contents["*"]);
      fireEvent.click(contents["2"]);
      fireEvent.click(contents["="]);

      await waitFor(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 4000);
        });
      }, {
        timeout: 5000
      });

      expect(screenElement?.textContent?.replace(" ", "")).toEqual("22*2=44");
      fireEvent.click(contents["-"]);
      fireEvent.click(contents["44"]);
      fireEvent.click(contents["="]);

      await waitFor(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 4000);
        });
      }, {
        timeout: 5000
      });

      expect(screenElement?.textContent?.replace(" ", "")).toEqual("44-44=0");
      fireEvent.click(contents["/"]);
      fireEvent.click(contents["0"]);
      fireEvent.click(contents["="]);

      await waitFor(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 4000);
        });
      }, {
        timeout: 5000
      });

      expect(screenElement?.textContent?.replace(" ", "")).toEqual("0/0=E");

    });
  })
});
