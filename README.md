# Welcome to Voucherify Referral Program Example

---

This example shows how referral programs work in Voucherify. The bulk of actual referral program configuration is done on your Voucherify Dashboard.

You can see that this example assumes two types of referral programs. 

- [A standard referral program](http://docs.voucherify.io/docs/referral-program) where ther referrer is rewarded every time their referral code is redeemed.
- [Multi tiered referral program](http://support.voucherify.io/article/62-scenario-3) where you can define multiple reward tiers for different scenarios (read the docs to see what is possible)

To setup your own example please follow the links above to setup your referral program campaigns to add them in the `.env` file. You might notice that both kinds of referral programs are handled exactly the same way in our code. The distinction is only made for the purpose of better explaining the different situations in the example itself.

Also remember to configure your Voucherify API keys in the .env file.
You can use env-template file and copy it to `.env`.

## Using this repository

You can browse the code (and quickly spin up your own rendition of this example) [here](https://glitch.com/edit/#!/voucherify-referral-example) and see a working live example at [https://voucherify-referral-example.glitch.me/](https://voucherify-referral-example.glitch.me/).

You will find usages of `vouchers` and `redemptions` namespaces of [voucherify package](https://github.com/voucherifyio/voucherify-nodejs-sdk). This is more convenient than hitting the API endpoints directly, the voucherfiy client does all the groundwork of constructing REST requests for you!

## Useful links

- This example code [online](https://glitch.com/edit/#!/voucherify-referral-example)
- This example [online](https://voucherify-referral-example.glitch.me/)

- Read more about [Voucherify](https://voucherify.io) 
- Voucherify [API docs](https://docs.voucherify.io)
- Learn more about [glitch](https://glitch.com/about/)