const { createSession } = require("../../dist/index.node.js");

describe("decryption", function() {
    it("decrypts content from version 0.*", async function() {
        const decrypted = await createSession().decrypt(
            "5YeY3xfU9IdPKnqwaDH3KQ==$019bd022090e9bef921c53a43fe0fa5a$02498e1cd4f2$f50d328c0682c05ec729f3ca888ef6b689fbeb471a6740f8619c89aedc4ebea0$245392",
            "passw0rd"
        );
        expect(decrypted).to.equal("test content");
    });

    it("decrypts content with new lines", async function() {
        const decrypted = await createSession().decrypt(
            "osxDBbSI+R/33/65KzfD5g==$48096f0356b5bd374c978d2ea5176279$jfNYMJbWjtXK$1dcc80ac2649aa38caf596aa3d03e2ff8ddba16f0628d7a262c3347db1095302$50000$cbc\n",
            "test"
        );
        expect(decrypted).to.equal("test-text");
    });
});
