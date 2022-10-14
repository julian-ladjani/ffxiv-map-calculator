const { nwbuild } = require("nw-builder")

nwbuild({
    files: ["./dist/**", "./nw/package.json"],
    version: "0.67.1",
    platforms: ["osx64", "win64"],
    mode: "build",
    flavor: "normal",
    macIcns: "./nw/mac.icns",
    zip: true,
    mergeZip: true,
});
