# Test Plan: SauceDemo E-Commerce Site

## 1. Purpose
Check that the main shopping flow of [SauceDemo](https://www.saucedemo.com) works correctly — logging in, browsing products, using the cart and checking out — and find and document defects.

## 2. Scope

**In scope**
- Login (valid and invalid credentials, locked-out user, empty fields, access without login)
- Products page (product list, sorting by name and price)
- Shopping cart (add, remove, badge count, cart contents)
- Checkout (customer information form, price/tax/total calculation, order completion)
- Known-bug checks for `problem_user`

**Out of scope**
- Performance and load testing
- Security testing
- Mobile layouts
- Payment processing (the demo site has none)

## 3. Approach
- **Automated end-to-end tests** with Playwright and TypeScript, using the Page Object Model.
- **Positive tests** (things that should work) and **negative tests** (invalid input should show the right error).
- **Exploratory testing** with `problem_user` to find defects, then automated tests to track each one.
- Tests run automatically on every push with **GitHub Actions**.

## 4. Test environment
| Item | Details |
|---|---|
| Application | https://www.saucedemo.com |
| Browsers | Chromium (Chrome), Firefox, WebKit (Safari) |
| Tools | Playwright, TypeScript, Node.js, GitHub Actions |
| Test accounts | `standard_user`, `locked_out_user`, `problem_user` (password `secret_sauce`) |

## 5. Test cases

| ID | Area | Test case | Type | Spec file |
|---|---|---|---|---|
| TC-01 | Login | Standard user logs in and sees 6 products | Positive | `login.spec.ts` |
| TC-02 | Login | Wrong password shows an error | Negative | `login.spec.ts` |
| TC-03 | Login | Locked-out user is blocked | Negative | `login.spec.ts` |
| TC-04 | Login | Empty username shows "Username is required" | Negative | `login.spec.ts` |
| TC-05 | Login | Empty password shows "Password is required" | Negative | `login.spec.ts` |
| TC-06 | Login | Products page can't be opened without logging in | Negative | `login.spec.ts` |
| TC-07 | Products | Sort by name A to Z | Positive | `products.spec.ts` |
| TC-08 | Products | Sort by name Z to A | Positive | `products.spec.ts` |
| TC-09 | Products | Sort by price low to high | Positive | `products.spec.ts` |
| TC-10 | Products | Sort by price high to low | Positive | `products.spec.ts` |
| TC-11 | Cart | Cart badge is hidden when the cart is empty | Positive | `cart.spec.ts` |
| TC-12 | Cart | Adding one item shows "1" on the badge | Positive | `cart.spec.ts` |
| TC-13 | Cart | Adding three items shows "3" on the badge | Positive | `cart.spec.ts` |
| TC-14 | Cart | Removing an item from the products page updates the badge | Positive | `cart.spec.ts` |
| TC-15 | Cart | Added items appear in the cart | Positive | `cart.spec.ts` |
| TC-16 | Cart | Removing an item inside the cart | Positive | `cart.spec.ts` |
| TC-17 | Cart | Cart keeps its items after "Continue Shopping" | Positive | `cart.spec.ts` |
| TC-18 | Checkout | Complete purchase end-to-end | Positive | `checkout.spec.ts` |
| TC-19 | Checkout | Item total, 8% tax and total are calculated correctly | Positive | `checkout.spec.ts` |
| TC-20 | Checkout | First name is required | Negative | `checkout.spec.ts` |
| TC-21 | Checkout | Last name is required | Negative | `checkout.spec.ts` |
| TC-22 | Checkout | Postal code is required | Negative | `checkout.spec.ts` |
| TC-23–27 | Known bugs | One test per bug, BUG-001 to BUG-005 | Defect tracking | `problem-user.spec.ts` |

## 6. Entry and exit criteria
**Entry:** the site is reachable, test accounts work, and the test environment is set up.

**Exit:** all test cases have been run in all three browsers, all `standard_user` tests pass, and every defect found is documented in [bug-reports.md](bug-reports.md) with steps, evidence and severity.

## 7. Results
- **TC-01 to TC-22:** passing in Chromium, Firefox and WebKit.
- **5 defects found** with `problem_user`, including 1 critical defect that blocks checkout. See [bug-reports.md](bug-reports.md).

## 8. Risks
| Risk | Mitigation |
|---|---|
| The demo site changes and breaks selectors | Use stable `data-test` attributes; selectors are kept in one place (page objects) |
| Network slowness causes flaky failures | Playwright auto-waiting; automatic retries on CI |
| A known bug gets fixed on the site | `test.fail()` flags the change so the test and report can be updated |
