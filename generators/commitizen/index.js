var generators = require("yeoman-generator").generators;

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },

    writing: function() {
        var pkg = this.fs.readJSON(this.destinationPath("package.json"), {});
        var config = pkg.config || {};

        config.commitizen = {
            "path": "node_modules/cz-conventional-changelog"
        };

        config.ghooks = {
            "pre-commit": "npm test",
            "commit-msg": "validate-commit-msg"
        };

        config["validate-commit-msg"] = {
            "types": [
                "feat",
                "fix",
                "docs",
                "style",
                "refactor",
                "perf",
                "test",
                "chore",
                "revert"
            ],
            "warnOnFail": false,
            "maxSubjectLength": 100
        };

        pkg.config = config;

        var scripts = pkg.scripts || {};

        scripts.commit = "git-cz";

        pkg.scripts = scripts;

        this.fs.writeJSON(this.destinationPath("package.json"), pkg);
    },

    install: function() {
        var gitSetup = this.fs.exists(".git");

        if(!gitSetup) {
            this.spawnCommandSync("git", ["init"]);
        }

        this.npmInstall([
            "commitizen",
            "cz-conventional-changelog",
            "ghooks",
            "validate-commit-msg"
        ], { "saveDev": true }, function() {
            this.spawnCommandSync("npm", ["run", "install"], { cwd: "node_modules/ghooks/" });
        }.bind(this));


    }

});
