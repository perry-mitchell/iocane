var lib = require("../source/index.js");

var getConfigValue = lib.config.getConfigValue,
    setDerivedKeyIterationRange = lib.config.setDerivedKeyIterationRange;

module.exports = {

    getConfigValue: {

        getsValues: function(test) {
            test.ok(
                typeof getConfigValue("derivedKeyIterationsMin") === "number",
                "Config should return a number"
            );
            test.done();
        },

        throwsForNonExistentKeys: function(test) {
            test.throws(
                function() {
                    getConfigValue("blah")   
                },
                "Config should throw for non-existent key"
            );
            test.done();
        }

    },

    setDerivedKeyIterationRange: {

        overridesValues: function(test) {
            var oMin = getConfigValue("derivedKeyIterationsMin"),
                oMax = getConfigValue("derivedKeyIterationsMax");
            setDerivedKeyIterationRange(1, 2);
            test.strictEqual(getConfigValue("derivedKeyIterationsMin"), 1, "Min should be overridden");
            test.strictEqual(getConfigValue("derivedKeyIterationsMax"), 2, "Max should be overridden");
            setDerivedKeyIterationRange(oMin, oMax);
            test.done();
        }

    }

};
