import { testFunc } from '../src/app';

describe("app", () => {
    it("should return 42", () => {
      expect(testFunc()).toEqual(42)
    });
});
