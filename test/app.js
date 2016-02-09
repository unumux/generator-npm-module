var path = require("path");
var assert = require("yeoman-assert");
var helpers = require("yeoman-generator").test;

describe("generator-npm-module:app", function() {
    describe("creates static files", function() {
        before(function(done) {
            helpers.run(path.join(__dirname, "../generators/app"))
                .withPrompts({
                    name: "some-obscure-module-name",
                    githubName: "ghUser",
                    isScoped: false
                })
                .on("end", done);
        });

        it("creates files", function() {
            assert.file([
                ".babelrc",
                ".gitignore",
                ".tern-project",
                "gulpfile.js",
                "package.json",
                "LICENSE",
                "README.md",
                "src/index.js"
            ]);
        });
    });

    describe("properly sets contents of files", function() {
        describe("is not scoped", function() {
            before(function(done) {
                helpers.run(path.join(__dirname, "../generators/app"))
                    .withPrompts({
                        name: "some-obscure-module-name",
                        githubName: "ghUser",
                        isScoped: false
                    })
                    .on("end", done);
            });

            it("sets the correct settings in package.json", function() {
                assert.JSONFileContent("package.json", { name: "some-obscure-module-name" });
                assert.JSONFileContent("package.json", { repository: { url: "https://github.com/ghUser/some-obscure-module-name" } });
            });

            it("puts the name in the README file", function() {
                assert.fileContent("README.md", "# some-obscure-module-name");
            });
        });

        describe("is scoped", function() {
            before(function(done) {
                helpers.run(path.join(__dirname, "../generators/app"))
                    .withPrompts({
                        name: "some-obscure-module-name",
                        githubName: "ghUser",
                        isScoped: true,
                        scoped: "@scopedUser"
                    })
                    .on("end", done);
            });

            it("sets the correct settings in package.json", function() {
                assert.JSONFileContent("package.json", { name: "@scopedUser/some-obscure-module-name" });
                assert.JSONFileContent("package.json", { repository: { url: "https://github.com/ghUser/some-obscure-module-name" } });
            });

            it("puts the name in the README file", function() {
                assert.fileContent("README.md", "# some-obscure-module-name");
            });
        });
    });
});
