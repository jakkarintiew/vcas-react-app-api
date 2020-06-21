export const DBConfig = {
  name: "MyDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "frames",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "frameIndex",
          keypath: "frameIndex",
          options: { unique: true },
        },
        { name: "frameData", keypath: "frameData", options: { unique: false } },
      ],
    },
  ],
};
