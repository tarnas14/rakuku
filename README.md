# Welcome to the Voucherify redemption example
---

This example shows how you could implement a voucher redemption as the last step of your e-commerce business flow. There are two examples, one of them shows the easiest, most basic redemption, and the other one uses pretty much every feature available for redemption in the [Voucherify package](https://github.com/voucherifyio/voucherify-nodejs-sdk).

You can browse the code (and quickly spin up your own rendition of this example) [here](https://glitch.com/edit/#!/voucherify-redemption-example) and see a working live example at [https://voucherify-redemption-example.glitch.me/](https://voucherify-redemption-example.glitch.me/).

In the example you will find usages of validation and redemption functionalities in Voucherify package. The `server.js` uses `redemptions` and `validations` namespaces of voucherify client. This is more convenient than hitting the API endpoints directly, the client does all the groundwork of constructing REST requests for you.

## Useful links

- This example code [online](https://glitch.com/edit/#!/voucherify-redemption-example)
- This example [online](https://glitch.com/edit/#!/voucherify-redemption-example)

- Read more about [Voucherify](https://voucherify.io) 
- Voucherify [API docs](https://docs.voucherify.io)
- Learn more about [glitch](https://glitch.com/about/)

# How to use this repository

---

## Setup

[Sign up](http://app.voucherify.io/#/signup?plan=standard) to get your auth keys. The authorization keys should be set up in a .env file in the root directory, as follows (you can copy `env_template` to `.env` file):

```
# Application ID from your voucherify Project Settings
APPLICATION_ID=''
# Application Secret Key from your voucherify Project Settings
CLIENT_SECRET_KEY=''
```

After this initial Voucherify account and .env file setup you should run `node ./setup.js` to feed your voucherify account with data necessary for this example to work.
This will:
- Create a campaign and add 10 vouchers with unlimited redemptions
- Add a single product

AND DONE! You are ready to run `npm start` or open the live glitch and play around.

## Done playing with the example?

When you are done with the example and want a clean voucherify experience, just run `node ./cleanup.js`. This will remove the vast majority of the data we put there. With some exceptions:

After this operation you might need to clean your browser local storage if you wish to use the example again.