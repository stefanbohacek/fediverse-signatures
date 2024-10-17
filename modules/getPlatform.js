export default async (instance) => {
  const resp = await fetch(
    `https://fediverse-info.stefanbohacek.dev/node-info?domain=${instance}&onlysoftware=true`
  );

  const respJSON = await resp.json();
  const platform = respJSON?.software?.name;

  return platform;
};
