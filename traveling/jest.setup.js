require ("@testing-library/jest-dom");

jest.mock("next/link", () => {
  return ({ children }) => children;
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));