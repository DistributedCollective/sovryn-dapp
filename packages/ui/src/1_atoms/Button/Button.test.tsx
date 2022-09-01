import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

test("button has boop", () => {
  render(<Button />);
  const linkElement = screen.getByText(/boop/i);
  expect(linkElement).toBeInTheDocument();
});
