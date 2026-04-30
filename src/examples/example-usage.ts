import { GraphQLClient } from "../client";
import { retryMiddleware } from "../middlewares/retry";
import { createAuthService } from "../services/user/auth.service";

const client = new GraphQLClient({
  url: "http://localhost:8080/graphql",
  tokenProvider: async () => localStorage.getItem("token"),
  headersFactory: async () => ({ "x-custom": "1" }),
  // middlewares: [retryMiddleware({ retries: 2 })],
  timeoutMs: 10_000,
});

const userService = createAuthService(client);

(async () => {
  const u = await userService.login({
    phone: "08034668633",
    pin: "12345678",
  });
  console.log(u);
})();
