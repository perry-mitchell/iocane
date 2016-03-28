(function(module) {

    "use strict";

    module.exports = {

        crypto:     require("./crypto.js"),

        derivation: require("./derive.js"),
        generators: require("./generators.js"),
        packers:    require("./packers.js"),
        security:   require("./security.js"),

        config:     require("./config.js")

    };

})(module);
