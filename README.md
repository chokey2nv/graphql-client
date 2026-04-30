// generate read me 
# OgaBai Api Integrations 

### Follow the test guard for this integration
```ts
const client = new GraphQLClient({
    url: "http://localhost:8080/graphql",
    headersFactory: async () => ({ 
      "authorization": "",
      "ojami-store-id": ""
    }),
});
const authService = createAuthService(client)
const res = await authService.signUp({
    pin: "12345678",
    phone: "08034668633",
    storeName: "test store",
});
const res = await authService.login({
    pin: "12345678",
    phone: "08034668633",
});
const res = await authService.signUp({
    pin: "12345678",
    phone: "08034668633",
    storeName: "test store",
});
const res = await authService.sendOTP({
    phone: "08034668633",
});
const res = await authService.verifyOTP({
    phone: "08034668633",
    otp,
});
const res = await authService.resetPin({
    pin: "12345678",
    phone: "08034668633",
},{}, {
    header: {
        "X-Otp-Verified-Access-Token": ""
    }
});
```