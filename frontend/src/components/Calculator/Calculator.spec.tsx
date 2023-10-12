import { render, fireEvent, screen, waitForElementToBeRemoved, waitFor } from "@testing-library/react"
import Calculator from "./Calculator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const matchers = require("@testing-library/jest-dom");
expect.extend(matchers);

describe("The calculator", () => {
  it("should have a screen element and 18 buttons", async () => {
    const dom = render(<Calculator />);
    const screenElement = dom.container.querySelector(".display");
    const buttons = dom.container.querySelectorAll("button");
    expect(screenElement).toBeVisible();
    expect(buttons.length).toEqual(18);
    const contents = [...buttons].map(button => button?.textContent?.replace(" ", "")).sort();
    expect(contents).toEqual(["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "+/-", "*", "+", "-", "/", "CA"].sort());
  });
});
