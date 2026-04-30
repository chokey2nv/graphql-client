import { GraphQLClient } from "../client";
import { createUserService } from "../services/user/user.service";
import { createCacheMiddleware } from "../middlewares/cache";
// Normal client setup
const cacheMw = createCacheMiddleware({ ttlMs: 60_000 });

const client = new GraphQLClient({
  url: "https://api.example.com/graphql",
  tokenProvider: () => localStorage.getItem("token"),
  middlewares: [cacheMw],
});

// Example service
const userService = createUserService(client);

(async () => {
  // First request cached
  const u1 = await userService.getUser("123");

  // Second request comes from cache
  const u2 = await userService.getUser("123");

  // Force bypass cache just for this call
  const fresh = await client.request(
    `
      query GetUser($id: ID!) {
        user(id: $id) { id name email }
      }
    `,
    { id: "123" },
    {
        cacheOptions: { skipCache: true },
        headers: {}
    });

  // Clear cache globally (e.g. on logout)
  cacheMw.clearCache();
})();
