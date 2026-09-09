jest.mock("./github", () => ({
  getUserInfo: jest.fn(),
  getRepoInfo: jest.fn(),
}));

const { getUserInfo, getRepoInfo } = require("./github");
const {
  checkUserLogin,
  checkUserName,
  checkRepoName,
  checkRepoStars,
} = require("./mock");

describe("User Info Checks (with mocked getUserInfo)", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    jest.resetAllMocks();
  });

  test("checkUserLogin matches expected", async () => {
    getUserInfo.mockResolvedValue({ login: "chrisjblackburn" });
    await checkUserLogin("chrisjblackburn", "chrisjblackburn");
    expect(getUserInfo).toHaveBeenCalledWith("chrisjblackburn");
    expect(logSpy).toHaveBeenCalledWith(
      "User login matches expected: chrisjblackburn",
    );
  });

  test("checkUserLogin does not match expected", async () => {
    getUserInfo.mockResolvedValue({ login: "otheruser" });
    await checkUserLogin("chrisjblackburn", "chrisjblackburn");
    expect(getUserInfo).toHaveBeenCalledWith("chrisjblackburn");
    expect(logSpy).toHaveBeenCalledWith(
      "User login does NOT match expected. Got: otheruser, Expected: chrisjblackburn",
    );
  });

  test("checkUserName matches expected", async () => {
    getUserInfo.mockResolvedValue({ name: "Chris Blackburn" });
    await checkUserName("chrisjblackburn", "Chris Blackburn");
    expect(getUserInfo).toHaveBeenCalledWith("chrisjblackburn");
    expect(logSpy).toHaveBeenCalledWith(
      "User name matches expected: Chris Blackburn",
    );
  });

  test("checkUserName does not match expected", async () => {
    getUserInfo.mockResolvedValue({ name: "Other Name" });
    await checkUserName("chrisjblackburn", "Chris Blackburn");
    expect(getUserInfo).toHaveBeenCalledWith("chrisjblackburn");
    expect(logSpy).toHaveBeenCalledWith(
      "User name does NOT match expected. Got: Other Name, Expected: Chris Blackburn",
    );
  });
});

describe("Repo Info Checks (with mocked getRepoInfo)", () => {
  // TODO Create tests for
});
