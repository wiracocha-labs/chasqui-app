import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("Authorization", function () {
  let authorization;
  let owner;
  let authorizedUser;
  let otherAccount;

  beforeEach(async function () {
    [owner, authorizedUser, otherAccount] = await ethers.getSigners();

    const Authorization = await ethers.getContractFactory("Authorization");
    authorization = await Authorization.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await authorization.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner by default", async function () {
      expect(await authorization.isAuthorized(owner.address)).to.be.true;
    });
  });

  describe("User Authorization", function () {
    it("Should allow owner to authorize users", async function () {
      await authorization.setUserAuthorization(authorizedUser.address, true);
      expect(await authorization.isAuthorized(authorizedUser.address)).to.be.true;
    });

    it("Should allow owner to revoke authorization", async function () {
      await authorization.setUserAuthorization(authorizedUser.address, true);
      await authorization.setUserAuthorization(authorizedUser.address, false);
      expect(await authorization.isAuthorized(authorizedUser.address)).to.be.false;
    });
  });
});
