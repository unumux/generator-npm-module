var path = require("path");

var yeoman = require("yeoman-generator");
var askName = require("inquirer-npm-name");

function generateScopedName(name) {
    return name.indexOf("@") === 0 ? name : "@" + name;
}

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.props = {};
    },

    prompting: function() {
        var done = this.async();

        askName({
            name: "name",
            message: "Your generator name",
            default: path.basename(process.cwd()),
            validate: function(str) {
                return str.length > 0;
            }
        }, this, function(name) {

            this.props.name = name;

            this.prompt([
                {
                    type: "confirm",
                    name: "isScoped",
                    store: true,
                    message: "Is this module scoped?",
                    default: true
                },
                {
                    type: "input",
                    name: "scoped",
                    message: "Where should this module be scoped?",
                    store: true,
                    filter: generateScopedName,
                    when: function(ans) {
                        return ans.isScoped;
                    }
                },
                {
                    type: "input",
                    name: "githubName",
                    store: true,
                    message: "What is your Github user or organization name?"
                }
            ], function(ans) {
                this.props = Object.assign({}, this.props, ans);
                done();
            }.bind(this));

        }.bind(this));

    },

    writing: function() {
        this.fs.copy(
            this.templatePath("**/{!(_*),.*}"),
            this.destinationPath("./")
        );

        this.fs.copyTpl(
            this.templatePath("_README.md"),
            this.destinationPath("README.md"),
            {
                name: this.props.name
            }
        );

        var packageJson = this.fs.readJSON(this.templatePath("_package.json"));

        var name = this.props.scoped ? this.props.scoped + "/" + this.props.name : this.props.name;

        packageJson.name = name;

        if(this.props.githubName) {
            packageJson.repository.url = "https://github.com/" + this.props.githubName + "/" + this.props.name;
        }

        this.fs.writeJSON(this.destinationPath("package.json"), packageJson);
    },

    install: function() {
        // this.installDependencies();
    }
});
