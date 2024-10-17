import getPlatform from "./getPlatform.js";

export default async (instance, token) => {
  const platform = await getPlatform(instance);
  let user = false;
  let usernameFull;
  let resp, respJSON;

  switch (platform) {
    case "mastodon":
    case "friendica":
    case "pleroma":
    case "akkoma":
      resp = await fetch(
        `https://${instance}/api/v1/accounts/verify_credentials`,
        {
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );

      respJSON = await resp.json();
      usernameFull = `@${respJSON.username}@${instance}`;

      user = {
        name: respJSON.display_name || respJSON.username,
        username: respJSON.username,
        username_full: usernameFull,
        domain: instance,
        avatar_url: respJSON.avatar_static,
        token,
      };
      break;

    case "misskey":
    case "calckey":
    case "firefish":
      resp = await fetch(`https://${instance}/api/i`, {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          i: token,
        }),
        method: "POST",
      });

      respJSON = await resp.json();
      usernameFull = `@${respJSON.username}@${instance}`;

      user = {
        name: respJSON.name,
        username: respJSON.username,
        username_full: usernameFull,
        domain: instance,
        avatar_url: respJSON.avatarUrl,
        token,
      };

      break;

    default:
      break;
  }

  return user;
};
